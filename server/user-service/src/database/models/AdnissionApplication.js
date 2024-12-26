import mongoose from "mongoose";

const { Schema } = mongoose;
const StatusForm = {
  REGISTER: "REGISTER",
  ACCEPT: "ACCEPT",
  CANCEL: "CANCEL",
  REJECT: "REJECT",
};
const AdnissionApplicationSchema = new Schema(
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
      type: Number,
      default: null,
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
  },
  {
    timestamps: true,
  }
);

const AdnissionApplication = mongoose.model(
  "AdnissionApplication",
  AdnissionApplicationSchema
);
export default AdnissionApplication;
