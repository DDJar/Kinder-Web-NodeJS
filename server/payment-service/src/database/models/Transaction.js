import mongoose from "mongoose";

const {Schema} = mongoose;

/**
 * @enum {string}
 */
const Status = {
    SUCCESSFULLY: "SUCCESSFULLY",
    FAILED: "FAILED",
};

const TransactionSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        content: {
            type: String,
        },
        volume: {
            type: Number,
        },
        month: {
            type: Number,
            require: true,
        },
        year: {
            type: Number,
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.FAILED,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
