import mongoose from "mongoose";

const { Schema } = mongoose;
const StatusForm = {
    REGISTER: "REGISTER",
    PASSED: "PASSED",
    FAILED: "FAILED",
    CANCEL: "CANCEL",
    REJECT: "REJECT",
    ACTIVE: "ACTIVE",
    ACCEPT: "ACCEPT",
};
const TransportationApplicationSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Children",
            require: true,
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        noteByStaff: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: Object.values(StatusForm),
            default: StatusForm.REGISTER,
        },
        address: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const TransportationApplication = mongoose.model(
    "TransportationApplication",
    TransportationApplicationSchema
);
export default TransportationApplication;
