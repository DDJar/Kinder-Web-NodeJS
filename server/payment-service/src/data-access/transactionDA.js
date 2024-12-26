import {Transaction} from "../database/index.js";

const creatTransaction = async (_transaction) => {
    console.log("Creating transaction...", _transaction);
    const transaction = await Transaction.create(_transaction)
    return transaction;
}
const getTransactionsSuccessByUserId = async (userId) => {
    const transactions = await Transaction.find(
        {userId: userId, status: "SUCCESSFULLY"}
    ).sort({createdAt: -1});
    return transactions
}
const getAllTransactionsSuccess = async (userId) => {
    const transactions = await Transaction.find(
        {status: "SUCCESSFULLY"}
    ).sort({createdAt: -1});
    return transactions
}

export default {creatTransaction, getTransactionsSuccessByUserId, getAllTransactionsSuccess};