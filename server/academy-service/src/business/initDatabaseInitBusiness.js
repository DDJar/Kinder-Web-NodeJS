import {initDataClass, initDataCurriculum, initDataRoom} from "../constants/databaseInit.js";
import AcademyDA from "../data-access/academyDA.js";
import curriculumDA from "../data-access/curriculumDA.js";
import {createRoom} from "../data-access/roomDA.js";

const handleInitDataUser = async () => {
    try {
        await AcademyDA.createClass(initDataClass)
    } catch (e) {
        console.log(e.message)
    }

    try {
        await curriculumDA.createCurriculum(initDataCurriculum)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createRoom(initDataRoom)
    } catch (e) {
        console.log(e.message)
    }
};


export default {
    handleInitDataUser
}