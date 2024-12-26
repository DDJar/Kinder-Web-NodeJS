import mongoose from "mongoose";

const {Schema} = mongoose;

/**
 * @enum {string}
 */
const Status = {
    ACTIVE: "ACTIVE",
    FULL: "FULL",
    BLOCKED: "BLOCKED",
};

const CurriculumSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        totalSeats: {
            type: Number,
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
        durationOfStudy: {
            type: Number,
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

const Curriculum = mongoose.model("Curriculum", CurriculumSchema);
export default Curriculum;
