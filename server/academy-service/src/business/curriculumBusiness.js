import curriculumDA from "../data-access/curriculumDA.js";
import {ApiError} from "../utils/index.js";

const handleFindCurriculumByName = async (name) => {
    return curriculumDA.findCurriculumByName(name);
}
const handleCreatCurriculum = async (_data) => {
    const isExistCurriculum = await handleFindCurriculumByName(_data.name);
    if (isExistCurriculum) {
        throw new ApiError(409, "ExistCurriculum");
    }
    return await curriculumDA.createCurriculum(_data)
}
const handleGetAllCurriculumByStatus = async (_status) => {
    return await curriculumDA.getAllCurriculumeByStatus(_status)
}

export default {handleFindCurriculumByName, handleCreatCurriculum, handleGetAllCurriculumByStatus}