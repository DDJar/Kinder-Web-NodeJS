import mongoose from "mongoose";


const Rate = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
};

const StatusFeedback = {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
};


const FeedbackSchema = new mongoose.Schema(
    {

        content: {
            type: String,
            required: [true, "Content must be provided"],
        },

        rate: {
            type: Number,
            required: true,
            enum: Object.values(Rate),
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        // 
        status: {
            type: String,
            enum: Object.values(StatusFeedback),
            default: StatusFeedback.ACTIVE,
        },
    },
    {
        timestamps: true,
    }
);
const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;