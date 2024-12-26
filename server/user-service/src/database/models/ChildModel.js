import mongoose from "mongoose";

const {Schema} = mongoose;

const ChildSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "First name must be provided"],
        minlength: 1,
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Last name must be provided"],
        minlength: 1,
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth must be provided"],
    },
    favourite: {
        type: String,
        default: "",
    },
    parentNote: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    birthCertificate: {
        type: String,
        default: "",
    },
    noteBy:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    class: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
    ],
    skill: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
        },
    ],
    eatFees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EatFee",
        },
    ],
    transportation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transportation",
        },
    ],
    docs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdmissionDocuments",
        },
    ],
});

const Children = mongoose.model("Children", ChildSchema);
export default Children;
