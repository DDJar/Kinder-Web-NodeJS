import mongoose from "mongoose";

const { Schema } = mongoose;
const TypeStatus = {
  FIRST: "FIRST",
  SECOND: "SECOND",
};
const AttendanceTransportationchema = new Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportationService",
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Children",
      require: true,
    },
    type: {
      type: String,
      enum: Object.values(TypeStatus),
      default: TypeStatus.FIRST,
    },
    receiverUrl: {
      type: String,
      default: "",
    },
    isUse: {
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

const AttendanceTransportation = mongoose.model(
  "AttendanceTransportation",
  AttendanceTransportationchema
);
export default AttendanceTransportation;
