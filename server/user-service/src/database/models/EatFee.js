import mongoose from "mongoose";

const {Schema} = mongoose;
const Status = {
    CANCEL: "CANCEL",
    ACTIVE: "ACTIVE",
};

const EatFeeSchema = new Schema(
    {
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.ACTIVE,
        },
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const EatFee = mongoose.model("EatFee", EatFeeSchema);
export default EatFee;
