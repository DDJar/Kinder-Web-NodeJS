import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;
/**
 * @enum {string}
 */
const Role = {
  USER: "USER",
  TEACHER: "TEACHER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
  ACCOUNTANT: "ACCOUNTANT",
  DRIVER: "DRIVER",
};
/**
 * @enum {string}
 */
const StatusUser = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
};

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "FirstName must be provided"],
      minlength: 1,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "LastName must be provided"],
      minlength: 1,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 10,
      maxlength: 50,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
      type: String,
      lowercase: true,
      trim: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number.",
      ],
    },
    password: {
      type: String,
      trim: false,
      required: [true, "Password must be provided"],
      minlength: 8,
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    status: {
      type: String,
      enum: Object.values(StatusUser),
      default: StatusUser.ACTIVE,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Children",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
