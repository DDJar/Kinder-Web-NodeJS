import mongoose from "mongoose";

const { Schema } = mongoose;
const StatusSkill = {
  REGISTER: "REGISTER",
  PASSED: "PASSED",
  FAILED: "FAILED",
  CANCEL: "CANCEL",
  REJECT: "REJECT",
  ACTIVE: "ACTIVE",
};
const payMethodSkill = {
  NO: "NO",
  YES: "YES",
};
const SkillSchema = new Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusSkill),
      default: StatusSkill.ACTIVE,
    },
    name: {
      type: String,
      default: "",
    },
    payment: {
      type: String,
      enum: Object.values(payMethodSkill),
      default: payMethodSkill.NO,
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

const Skill = mongoose.model("Skill", SkillSchema);
export default Skill;
