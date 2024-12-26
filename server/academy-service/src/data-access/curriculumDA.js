import {Curriculum} from "../database/index.js";

const findCurriculumByName = async (_name) => {
    return await Curriculum.findOne({name: _name})
}
const createCurriculum = async (data) => {
    return await Curriculum.create(data)
}

const getAllCurriculumeByStatus = async (_status) => {
    return await Curriculum.find({
        status: _status
    })
}

export default {findCurriculumByName, createCurriculum, getAllCurriculumeByStatus}