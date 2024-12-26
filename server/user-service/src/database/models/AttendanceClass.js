import mongoose from "mongoose";

const { Schema } = mongoose;
const ReceiverType = {
  USER: "USER",
  TEACHER: "TEACHER",
  DRIVER: "DRIVER",
  NULL: "",
};
const AttendanceClassSchema = new Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Children",
      require: true,
    },
    receiver: {
      type: String,
      enum: Object.values(ReceiverType),
      default: ReceiverType.NULL,
    },
    receiverUrl: {
      type: String,
      default: "",
    },
    attendDay: {
      type: Number,
      require: true,
    },
    attendMonth: {
      type: Number,
      require: true,
    },
    attendYear: {
      type: Number,
      require: true,
    },
    isCheckIn: {
      type: Boolean,
      default: false,
    },
    createdCheckInAt: {
      type: Date,
      default: null,
    },
    isCheckOut: {
      type: Boolean,
      default: false,
    },
    createdCheckOutAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceClass = mongoose.model(
  "AttendanceClass",
  AttendanceClassSchema
);
export default AttendanceClass;
