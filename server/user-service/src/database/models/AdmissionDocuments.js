import mongoose from "mongoose";

const { Schema } = mongoose;
const TitleForm = {
  BIRTH_CER: "BIRTH_CER",
  HEALTH_CHECK: "HEALTH_CHECK",
  PSYCHOLOGICAL: "PSYCHOLOGICAL",
  HEALTH_MONITORING: "HEALTH_MONITORING",
  HOUSEHOLD_BOO: "HOUSEHOLD_BOOK",
  HEALTH_INSURANCE: "HEALTH_INSURANCE",
};
const StatusForm = {
  BLOCKED: "BLOCKED",
  ACTIVE: "ACTIVE",
};
const AdmissionDocumentsSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusForm),
      default: StatusForm.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const AdmissionDocuments = mongoose.model(
  "AdmissionDocuments",
  AdmissionDocumentsSchema
);
export default AdmissionDocuments;
