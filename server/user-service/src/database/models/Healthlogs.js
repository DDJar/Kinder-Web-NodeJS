import mongoose from "mongoose";

const { Schema } = mongoose;
const StatusClass = {
  BLOCK: "BLOCK",
  ACTIVE: "ACTIVE",
};

const HealthlogsSchema = new Schema(
  {
    height: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Children",
      required: true,
    },
    noteBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(StatusClass),
      default: StatusClass.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const Healthlogs = mongoose.model("Healthlogs", HealthlogsSchema);
export default Healthlogs;
