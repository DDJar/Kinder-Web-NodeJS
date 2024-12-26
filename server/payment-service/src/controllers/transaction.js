import {Transaction} from "../database/index.js";

export async function createTransaction(userId, childId, content, volume) {
    try {
        const transaction = new Transaction({
            userId: userId,
            childId: childId,
            content: content,
            volume: volume,
        });
        return await transaction.save();
    } catch (error) {
        console.error(error);
    }
}

export async function createTransactionFromData(_data) {
    return await Transaction.create(_data)
}
