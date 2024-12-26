import {payOs} from "../services/payosService.js";
import {ApiError} from "../utils/index.js";
import transactionDA from "../data-access/transactionDA.js";
import {Types} from "mongoose";
import TransactionDA from "../data-access/transactionDA.js";
import {RabbitMQ_SocketPaymentUpdate} from "../services/RabbitMQService/send/RabbitMQ_SocketPaymentUpdate.js";
import {
    RabbitMQ_PaymentUpdateInUserService
} from "../services/RabbitMQService/send/RabbitMQ_PaymentUpdateInUserService.js";
import {
    RabbitMQ_requestChildDetailsByParentIdAndChildId
} from "../services/RabbitMQService/sendToGetData/requestChildDetailsByParentIdAndChildId.js";

let orders = [];

const handleCreateTransaction = async (
    description,
    cancelUrl,
    amount,
    returnUrl,
    payFor,
    childId,
    user,
    time
) => {
    const orderCode = Number(String(new Date().getTime()).slice(0, 10));
    const existingOrder = orders.find(
        (order) => order.userId === user._id && order.childId === childId
    );
    if (existingOrder) {
        // Update existing order
        existingOrder.orderCode = orderCode;
        existingOrder.amount = amount;
        existingOrder.payFor = payFor;
        existingOrder.childId = childId;
        existingOrder.time = time;
    } else {
        // Add a new order
        orders.push({userId: user._id, orderCode, amount, payFor, childId, time});
    }
    const body = {
        orderCode: orderCode,
        amount: amount,
        description: description,
        cancelUrl: cancelUrl,
        returnUrl: returnUrl,
    };
    try {
        const paymentLinkRes = await payOs.createPaymentLink(body);
        return {
            error: 0,
            message: "Success",
            data: {
                bin: paymentLinkRes.bin,
                checkoutUrl: paymentLinkRes.checkoutUrl,
                accountNumber: paymentLinkRes.accountNumber,
                accountName: paymentLinkRes.accountName,
                amount: paymentLinkRes.amount,
                description: paymentLinkRes.description,
                orderCode: paymentLinkRes.orderCode,
                qrCode: paymentLinkRes.qrCode,
            },
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(-1, "fail");
    }
};
const handleReceiveHook = async (code, desc, success, data) => {
    const order = orders.find(
        (order) =>
            order.orderCode === data.orderCode && order.amount === data.amount
    );
    //progress database thanh toans thanh cong
    if (!order) {
        throw new ApiError(404, "Payment Not Found");
    }
    orders = orders.filter((order) => order.orderCode !== order.orderCode);

    const payload = {
        code,
        desc,
        success,
        data: {
            amount: data.amount,
            description: data.description,
            reference: data.reference,
            transactionDateTime: data.transactionDateTime,
            orderCode: data.orderCode,
            paymentLinkId: data.paymentLinkId,
            order,
        },
    };
    //handle payment in user-service
    await RabbitMQ_PaymentUpdateInUserService(payload);
    //create payment in payment-service
    const paymentData = {
        userId: new Types.ObjectId(order.userId),
        childId: new Types.ObjectId(order.childId),
        amount: order.amount,
        month: order.time.month,
        year: order.time.year,
        content: order.payFor.toString(),
        status: "SUCCESSFULLY",
    };
    const transactionData = await transactionDA.creatTransaction(paymentData);
    console.log("transactionData", transactionData);
    await RabbitMQ_SocketPaymentUpdate(payload);
    return null;
};
const getTransactionsSuccessByUserId = async (userId) => {
    const transactions = await TransactionDA.getTransactionsSuccessByUserId(
        userId
    );
    if (!transactions) {
        return transactions
    }
    let childIds = []
    let childInfos = []
    for (let index = 0; index < transactions.length; index++) {
        if (!childIds.includes(transactions[index].childId)) {
            childIds.push(transactions[index].childId);
            const childInfo =
                await getInfoParentChildByParentIdChildId(
                    userId,
                    transactions[index].childId
                );
            if (childInfo?.children) {
                childInfos.push(childInfo?.children[0]);
            }
        }
    }
    let _transactions = transactions.map((tx) => {
        const child = childInfos.find((child) => child._id === tx.childId.toString());
        return {
            userId: tx.userId,
            childId: tx.childId,
            content: tx.content,
            month: tx.month,
            year: tx.year,
            amount: tx.amount,
            status: tx.status,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
            child: child || null
        };
    })
    // console.log(transactions)
    return _transactions;
};
const getAllTransactionsSuccess = async () => {
    const transactions = await TransactionDA.getAllTransactionsSuccess();
    if (!transactions) {
        return transactions
    }
    let childIds = []
    let childInfos = []
    for (let index = 0; index < transactions.length; index++) {
        if (!childIds.includes(transactions[index].childId.toString())) {
            childIds.push(transactions[index].childId.toString());
            const childInfo =
                await getInfoParentChildByParentIdChildId(
                    transactions[index].userId,
                    transactions[index].childId
                );
            if (childInfo?.children) {
                childInfos.push({
                    user: {
                        _id: childInfo._id, firstName: childInfo.firstName, lastName: childInfo.lastName
                    },
                    child: childInfo?.children[0]
                });
            }
        }
    }

    let _transactions = transactions.map((tx) => {
        const child = childInfos.find((child) => child.child._id === tx.childId.toString());
        return {
            userId: tx.userId,
            childId: tx.childId,
            content: tx.content,
            month: tx.month,
            year: tx.year,
            amount: tx.amount,
            status: tx.status,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
            child: child.child || null,
            user: child.user || null
        };
    })
    console.log("_transactions", _transactions)
    return _transactions;
};

const getInfoParentChildByParentIdChildId = async (parentId, childId) => {
    return await RabbitMQ_requestChildDetailsByParentIdAndChildId(
        parentId,
        childId
    );
}
export default {
    handleCreateTransaction,
    handleReceiveHook,
    getTransactionsSuccessByUserId,
    getInfoParentChildByParentIdChildId,
    getAllTransactionsSuccess,
};
