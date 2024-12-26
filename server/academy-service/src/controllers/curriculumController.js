import curriculumBusiness from "../business/curriculumBusiness.js";

const createCurriculum = async (req, res) => {
    try {

        const {name, totalSeats, tuition, condition, durationOfStudy, skills} = req.body;
        const curriculum = await curriculumBusiness.handleCreatCurriculum({
            name,
            totalSeats,
            tuition,
            condition,
            durationOfStudy
        });
        console.log(curriculum);
        res.json({
            status: "200",
            message: "Curriculum created successfully",
            data: curriculum
        })
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getAllCurriculum = async (req, res) => {
    try {
        const curriculums = await curriculumBusiness.handleGetAllCurriculumByStatus("ACTIVE");
        res.json({
            status: "200",
            message: "Curriculum created successfully",
            data: curriculums
        })
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

export default {
    createCurriculum,
    getAllCurriculum
}