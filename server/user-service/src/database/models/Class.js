import mongoose from "mongoose";

const { Schema } = mongoose;
const StatusClass = {
  REGISTER: "REGISTER",
  PASSED: "PASSED",
  FAILED: "FAILED",
  CANCEL: "CANCEL",
  REJECT: "REJECT",
  ACTIVE: "ACTIVE",
  ACCEPT: "ACCEPT",
};
const payMethodClass = {
  NO: "NO",
  YES: "YES",
};
const ClassSchema = new Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: Object.values(StatusClass),
      default: StatusClass.ACCEPT,
    },
    name: {
      type: String,
      default: "",
    },
    payment: {
      type: String,
      enum: Object.values(payMethodClass),
      default: payMethodClass.NO,
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", ClassSchema);
export default Class;
