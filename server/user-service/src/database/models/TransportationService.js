import mongoose from "mongoose";

const { Schema } = mongoose;
const Status = {
  ACTIVE: "ACTIVE",
  FULL: "FULL",
  BLOCKED: "BLOCKED",
};
const TransportationServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    tuition: {
      type: Number,
      required: true,
    },
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);
TransportationServiceSchema.pre("save", function (next) {
  if (this.availableSeats <= 0) {
    this.status = Status.FULL;
  } else {
    this.status = Status.ACTIVE;
  }
  next();
});
TransportationServiceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.availableSeats !== undefined) {
    if (update.availableSeats <= 0) {
      this.setUpdate({ ...update, status: Status.FULL });
    } else {
      this.setUpdate({ ...update, status: Status.ACTIVE });
    }
  }
  next();
});
const TransportationService = mongoose.model(
  "TransportationService",
  TransportationServiceSchema
);
export default TransportationService;
