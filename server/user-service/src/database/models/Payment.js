import mongoose from "mongoose";

const {Schema} = mongoose;
const PayMethod = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
};
const PaymentSchema = new Schema(
    {

        amount: {type: Number, required: true},
        month: {type: Number, required: true},
        year: {type: Number, required: true},
        isPaid: {type: Boolean, default: true},
        payMethod: {type: String, enum: Object.values(PayMethod), default: PayMethod.ONLINE},
        transactionId: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
