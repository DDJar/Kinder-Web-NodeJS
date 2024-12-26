import {createAttend, createClass, createEatFees} from "../data-access/classDA.js";
import {
    createAdmissionApplication,
    createAdmissionDocument,
    createChild,
    createTransportationApplication, createUser
} from "../data-access/userDA.js";
import {
    initDataAdmisionApplication,
    initDataAdmissionDocs,
    initDataAttendence,
    initDataChild,
    initDataClass,
    initDataEatFees,
    initDatahealthLogs,
    initDataPayment,
    initDataTransportation,
    initDataTransportationApplication, initDataTransportationService, initDataUsers
} from "../constants/databaseInit.js";
import {createHealthlogForChild} from "../data-access/childDA.js";
import {createPayment} from "../data-access/paymentDA.js";
import {createTransportation, createTransportationService} from "../data-access/transportationDA.js";

const handleInitDataUser = async () => {
    try {
        await createAdmissionDocument(initDataAdmissionDocs)
    } catch (e) {
        console.log(e.message)
    }

    try {
        await createAdmissionApplication(initDataAdmisionApplication)
    } catch (e) {
        console.log(e.message)
    }

    try {
        await createAttend(initDataAttendence)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createChild(initDataChild)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createClass(initDataClass)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createEatFees(initDataEatFees)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createHealthlogForChild(initDatahealthLogs)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createPayment(initDataPayment)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createTransportationApplication(initDataTransportationApplication)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createTransportation(initDataTransportation)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createTransportationService(initDataTransportationService)
    } catch (e) {
        console.log(e.message)
    }
    try {
        await createUser(initDataUsers)
    } catch (e) {
        console.log(e.message)
    }

};


export default {
    handleInitDataUser
}