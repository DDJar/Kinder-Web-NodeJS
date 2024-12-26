import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * @enum {string}
 */
const Status = {
  ACTIVE: "ACTIVE",
  FULL: "FULL",
  BLOCKED: "BLOCKED",
};
const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    totalSeats: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    tuition: {
      type: Number,
      required: true,
    },
    condition: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
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
SkillSchema.pre("save", function (next) {
  if (this.availableSeats <= 0) {
    this.status = Status.FULL;
  } else {
    this.status = Status.ACTIVE;
  }
  next();
});
SkillSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.availableSeats !== undefined) {
    if (update.availableSeats <= 0) {
      this.setUpdate({ ...update, status: Status.FULL });
    } else {
      this.setUpdate({ ...update, status: Status.ACTIVE });
    }
  }
  if (update.endTime !== undefined) {
    const endTime = new Date(update.endTime);
    if (endTime < new Date()) {
      this.setUpdate({ ...update, status: Status.FULL });
    }
  }
  next();
});
const Skill = mongoose.model("Skill", SkillSchema);
export default Skill;
