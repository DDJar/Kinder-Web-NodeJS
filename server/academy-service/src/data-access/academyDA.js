import {Class, Skill, Category} from "../database/index.js";

export async function getAcademiesById(type, id) {
    let result = {};
    let select = "";
    try {
        const model = type === "class" ? Class : Skill;
        if (type === "class") {
            select =
                "_id name teacherId totalSeats startTime endTime tuition condition availableSeats status room";

            result = await model.findById(id).select(select);
        } else {
            select =
                "_id name teacherId category totalSeats startTime endTime tuition condition availableSeats status room";
            result = await model.findById(id).select(select);
        }
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching academy by ID");
    }
}

export async function getAcademies(type, query, skip, limit, select, sort) {
    let result = {};
    try {
        const model = type === "class" ? Class : Skill;
        let queryBuilder = model
            .find(query || {})
            .select(select)
            .sort(sort);
        if (skip !== undefined) {
            queryBuilder = queryBuilder.skip(skip);
        }

        if (limit !== undefined) {
            queryBuilder = queryBuilder.limit(limit);
        }
        result = await queryBuilder;
        return result;
    } catch (error) {
        console.error(error);
    }
}

export async function countAcademies(type, query) {
    try {
        const model = type === "class" ? Class : Skill;
        const count = await model.countDocuments(query);
        return count;
    } catch (error) {
        console.error("Error counting academies:", error);
        throw error;
    }
}

export async function updateAcademy(type, idAcademy, updateData) {
    try {
        let result;
        if (type === "class") {
            delete updateData.category;
            result = await Class.findOneAndUpdate({_id: idAcademy}, updateData, {
                new: true,
                runValidators: true,
            });
        } else {
            result = await Skill.findOneAndUpdate({_id: idAcademy}, updateData, {
                new: true,
                runValidators: true,
            });
        }
        if (!result) {
            throw new Error(`Academy with id ${idAcademy} not found`);
        }
        return result;
    } catch (error) {
        console.error(error);
    }
}

const findActiveClassesByTeacher = async (teacherId) => {
    return await Class.find({teacherId, status: "ACTIVE"}).select(
        "_id name totalSeats startTime endTime tuition condition availableSeats status"
    );
};
const findSkillesByTeacher = async (teacherId) => {
    return await Skill.find({teacherId: teacherId, status: "ACTIVE"}).select(
        "_id name totalSeats startTime endTime tuition condition availableSeats status"
    );
};

export async function chekAcademies(type, condition) {
    let result = {};
    try {
        const model = type === "class" ? Class : Skill;
        let queryBuilder = model.findOne(condition || {});

        result = await queryBuilder;
        return result;
    } catch (error) {
        console.error(error);
    }
}

const createClass = async (_data) => {
    return await Class.create(_data);
}
export default {
    getAcademies,
    updateAcademy,
    getAcademiesById,
    countAcademies,
    findActiveClassesByTeacher,
    findSkillesByTeacher,
    chekAcademies,
    createClass
};
