import mongoose from "mongoose";

const { Schema } = mongoose;
const Status = {
  CANCEL: "CANCEL",
  ACTIVE: "ACTIVE",
  ACCEPT: "ACCEPT",
};

const TransportationSchema = new Schema(
  {
    transportationId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACCEPT,
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

const Transportation = mongoose.model("Transportation", TransportationSchema);
export default Transportation;
