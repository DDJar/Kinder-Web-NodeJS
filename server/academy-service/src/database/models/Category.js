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
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
const Category = mongoose.model("Category", CategorySchema);
export default Category;
