import {ApiError} from "../utils/index.js";
import paymentBusiness from "../business/paymentBusiness.js";


async function createTransaction(req, res) {
    const {description, cancelUrl, amount, returnUrl, payFor, childId, time} = req.body;
    console.log(req.body);
    try {
        if (!description || !cancelUrl || !amount || !returnUrl || !payFor || !childId || !time) {
            throw new ApiError(400, "All fields are required");
        }
        const data = await paymentBusiness.handleCreateTransaction(description, cancelUrl, amount, returnUrl, payFor, childId, req.user, time)
        return res.json(data)
    } catch (error) {
        console.error(error);
        return res.json({
            status: error.statusCode || 500,
            message: error.message,
        });
    }

}

async function receiveHook(req, res) {
    console.log("receiveHook: ", req.body);
    const {code, desc, success, data} = req.body;
    try {
        if (!code || !desc || !success || !data) {
            console.log("test 404", code, desc, success, data)
            throw new ApiError(400, "All fields are required");
        }
        await paymentBusiness.handleReceiveHook(code, desc, success, data)
        return res.json({
            status: 200,
            message: "Payment successfully received",
        })
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message,
        });
    }

}

async function getHistory(req, res) {
    const userId = req.user._id;
    console.log("getHistory")
    try {
        const transactions = await paymentBusiness.getTransactionsSuccessByUserId(userId);
        return res.json({
            status: 200,
            message: "get history payment successfully",
            data: transactions,
        })
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message,
        })
    }
}

async function getAllHistory(req, res) {
    try {
        const transactions = await paymentBusiness.getAllTransactionsSuccess();
        return res.json({
            status: 200,
            message: "get history payment successfully",
            data: transactions,
        })
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message,
        })
    }
}

export default {
    createTransaction,
    receiveHook,
    getHistory,
    getAllHistory
}