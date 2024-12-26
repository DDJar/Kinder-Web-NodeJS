import moment from "moment";
import request from "request";
import crypto from "crypto";
import { Transaction } from "../database/index.js";
import { Salary } from "../database/index.js";
import { ApiError } from "../utils/index.js";
import config from "../config/config.js";
import { createTransaction } from "./transaction.js";

const newTransaction = async (req, res) => {
  try {
    let { userId, childId, content, volume } = req.body;
    let result = await createTransaction(userId, childId, content, volume);

    return res.json({
      status: 200,
      message: "Fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

const createPaymentUrl = async (req, res, next) => {
  const dataForm = req.body.dataForm;

  try {
    const transaction = Transaction.findById(dataForm.transactionId);
    if (!transaction) {
      throw new ApiError(400, "Invalid transaction");
    }
    transaction.status.push("FAILED");
    await transaction.save();
    config.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let transactionId = transaction._id;
    let amount = transaction.volume;
    let bankCode = req.body.bankCode;

    let locale = "vn";
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = transactionId;
    vnp_Params["vnp_OrderInfo"] = "thanh toan " + transaction._id;
    vnp_Params["vnp_OrderType"] = "Cash";
    vnp_Params["vnp_Amount"] = amount;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl: vnpUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error saving transaction details", error });
  }
};
const filterAndGroupByMonth = async (req, res) => {
  try {
    const { userId, childId } = req.body;
    const transactions = await Transaction.find({ userId, childId });

    const groupedByMonth = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.createdAt).getMonth() + 1;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(transaction);
      return acc;
    }, {});

    res.json(groupedByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const vnpayReturn = async (req, res, next) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];
  let orderId = vnp_Params["vnp_TxnRef"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let tmnCode = config.vnp_TmnCode;
  let rspCode = vnp_Params["vnp_ResponseCode"];
  let secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  let returnUrl = config.vnp_ReturnUrl;
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const transaction = await Transaction.findOne({ _id: orderId });

  let isPaid = transaction.status === "SUCCESSFULLY";

  if (secureHash === signed) {
    if (transaction) {
      if (!isPaid) {
        if (rspCode == "00") {
          transaction.status = "SUCCESSFULLY";
          await transaction.save();
          res.redirect(config.CLIENT_URL);
        } else {
          transaction.status = "FAILED";
          await transaction.save();
          res.status(200).json({ RspCode: "00", Message: "Success" });
        }
      } else {
        res.status(200).json({
          RspCode: "02",
          Message: "This transaction has been updated to the payment status",
        });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Transaction not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};
const vnpayIpn = (req, res, next) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let orderId = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = process.env.vnp_HashSecret;
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  let paymentStatus = "0";

  let checkOrderId = true;
  let checkAmount = true;
  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          if (rspCode == "00") {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
//payroll

const getSalary = async (req, res) => {
  try {
    // Validate and sanitize query parameters (optional)
    const query = req.query || {};

    // Fetch salary data from the database
    const listSalary = await Salary.find(query).select(
      "_id authorId salaryId payMethod transactionId createdAt updatedAt"
    );

    // Respond with the fetched data
    return res.status(200).json({
      status: 200,
      message: "Salary fetched successfully",
      data: listSalary,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
export default {
  createPaymentUrl,
  vnpayReturn,
  newTransaction,
  vnpayIpn,
  filterAndGroupByMonth,
  getSalary,
};
