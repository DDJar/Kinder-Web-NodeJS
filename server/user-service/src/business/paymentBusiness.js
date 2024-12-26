import {
    createPaymentForClassByClassId,
    createPaymentForEatFeesByEatFeesId,
    createPaymentForSkillBySkillId,
    createPaymentForTransportationByTransportationId,
    GetChildrenFeeByChildId,
} from "../data-access/childDA.js";
import {ApiError} from "../utils/index.js";
import {GetChildrenLearnByParentId} from "../data-access/userDA.js";
import {
    getDateMonthYearByTimestamps,
    getMonthDetails,
} from "../utils/date.js";
import {GetCountChildAttendenceAtMonth} from "../data-access/classDA.js";
import {logger} from "@azure/storage-blob";
import {createPayment} from "../data-access/paymentDA.js";
import {getTransportationServiceById} from "../data-access/transportationDA.js";
import {Types} from "mongoose";
import {RabbitMq_GetAcademyById} from "../services/RabbitMQService/sendToGetData/GetAcademyById.js";
import {RabbitMQ_SocketPaymentUpdate} from "../services/RabbitMQService/send/SocketPaymentUpdate.js";

const GetTuitionFeesByChildId = async (childId, time) => {
    if (!childId) {
        throw new ApiError(400, "childId is required");
    }
    try {
        childId = new Types.ObjectId(childId);
    } catch (e) {
        throw new ApiError(400, "Wrong childId");
    }
    const childDetail = await GetChildrenFeeByChildId(childId, time);
    if (!childDetail) {
        throw new ApiError(404, "Not Found");
    }

    let previousMonthDate = {
        month: time.month - 1 <= 0 ? 12 : time.month - 1,
        year: time.month - 1 <= 0 ? time.year - 1 : time.year,
    };

    const countChildAttendence =
        (await GetCountChildAttendenceAtMonth(childId, {
            month: previousMonthDate.month,
            year: previousMonthDate.year,
        })) || 0;
    const prevMonthDetails = getMonthDetails(
        previousMonthDate.month,
        previousMonthDate.year
    );
    const currentMonthDetails = getMonthDetails(time.month, time.year);

    let childDetailObject;
    childDetailObject = childDetail.toObject();

    let totalFees = 0;
    let isFirstMonthLearn = false;
    let payFor = [];
    if (childDetailObject.class.length > 0) {
        const detailClass = await RabbitMq_GetAcademyById(
            "class",
            childDetailObject.class[0].classId
        );
        childDetailObject.class[0].tuition = detailClass.tuition;
        childDetailObject.class[0].name = detailClass.name;
        childDetailObject.class[0].isPaid =
            childDetailObject.class[0].payments.length > 0;
        if (!childDetailObject.class[0].isPaid) {
            totalFees += detailClass.tuition;
            payFor.push("class");
        }
    }
    if (childDetailObject.skill.length > 0) {
        childDetailObject.skill.map(async (item) => {
            const detailClass = await RabbitMq_GetAcademyById(
                "skill",
                item.skillId
            );
            let isPaid = item.payments.length > 0;
            if (!isPaid) {
                totalFees += detailClass.tuition;
                if (!payFor.includes("skill")) {
                    payFor.push("skill");
                }
            }
            return {
                ...item,
                tuition: detailClass.tuition,
                name: detailClass.name,
                isPaid,
            };
        });
    }
    if (childDetailObject.eatFees.length > 0) {
        childDetailObject.eatFees[0].tuition = 70;
        childDetailObject.eatFees[0].isPaid =
            childDetailObject.eatFees[0].payments.length > 0;
        const updatedDate = getDateMonthYearByTimestamps(
            childDetailObject.eatFees[0].createdAt
        );
        if (
            previousMonthDate.year <= updatedDate.year &&
            previousMonthDate.month < updatedDate.month
        ) {
            isFirstMonthLearn = true;
        }
        if (!childDetailObject.eatFees[0].isPaid) {
            totalFees +=
                childDetailObject.eatFees[0].tuition *
                (currentMonthDetails.daysInMonth - currentMonthDetails.sundays);
            if (!isFirstMonthLearn) {
                totalFees -=
                    (prevMonthDetails.daysInMonth -
                        prevMonthDetails.sundays -
                        countChildAttendence) *
                    childDetailObject.eatFees[0].tuition;
            }
            payFor.push("eatFees");
        }
    }
    if (childDetailObject.transportation.length > 0) {
        const detailTransportation = await getTransportationServiceById(
            childDetailObject.transportation[0].transportationId
        );
        childDetailObject.transportation[0].tuition = detailTransportation?.tuition;
        childDetailObject.transportation[0].isPaid =
            childDetailObject.transportation[0].payments.length > 0;

        if (!childDetailObject.transportation[0].isPaid) {
            totalFees += childDetailObject.transportation[0].tuition;
            payFor.push("transportation");
        }
    }
    childDetailObject.totalFees = totalFees;
    childDetailObject.countAttendence = countChildAttendence || 0;
    childDetailObject.prevMonthDaysInMonthLearn =
        prevMonthDetails.daysInMonth - prevMonthDetails.sundays;
    childDetailObject.currentMonthDaysInMonthLearn =
        currentMonthDetails.daysInMonth - currentMonthDetails.sundays;
    childDetailObject.isFirstMonthLearn = isFirstMonthLearn;
    childDetailObject.payFor = payFor;

    return childDetailObject;
};

const HandleGetChildrenLearnByParentId = async (parentId, time) => {
    const childrenLearn = await GetChildrenLearnByParentId(parentId, time);
    if (!childrenLearn) {
        throw new ApiError(404, "Not Found");
    }

    let childDetailObject = childrenLearn.toObject();

    let resultChildrenLearn = null;
    resultChildrenLearn = childDetailObject.children?.map((child) => {
        let isPaid = true;
        let isLearning = false;

        if (child.class.length > 0) {
            const updatedDate = getDateMonthYearByTimestamps(
                child.class[0].createdAt
            );
            if (time.year >= updatedDate.year && time.month >= updatedDate.month) {
                isLearning = true;
            }
            child.class.map((item) => {
                if (item.payments.length === 0) {
                    isPaid = false;
                }
            });
        }
        if (child.skill.length > 0) {
            child.skill.map((item) => {
                if (item.payments.length === 0) {
                    isPaid = false;
                }
            });
        }
        if (child.transportation.length > 0) {
            child.transportation.map((item) => {
                if (item.payments.length === 0) {
                    isPaid = false;
                }
            });
        }
        return {
            _id: child._id,
            firstName: child.firstName,
            lastName: child.lastName,
            isPaid: isPaid,
            avatar: child.avatar,
            isLearning: isLearning,
        };
    });

    return resultChildrenLearn;
};
const HandlePaymentUpdate = async (_data, paymentMethod = "ONLINE") => {
    const _dataPayment = _data.data.data;
    try {
        const childInfo = await GetChildrenFeeByChildId(
            _dataPayment.order.childId,
            _dataPayment.order.time
        );
        if (!childInfo) {
            return null;
        }
        let _paymentData = {
            amount: _dataPayment.order.amount,
            month: _dataPayment.order.time.month,
            year: _dataPayment.order.time.year,
            isPay: true,
            paymentMethod: paymentMethod,
        };

        if (_dataPayment.order.payFor.includes("class")) {
            if (childInfo?.class?.length > 0) {
                const classId = childInfo.class[0]._id;
                const newPayment = await createPayment(_paymentData);
                await createPaymentForClassByClassId(classId, newPayment._id);
            }
        }
        if (_dataPayment.order.payFor.includes("eatFees")) {
            if (childInfo?.eatFees?.length > 0) {
                const id = childInfo.eatFees[0]._id;
                const newPayment = await createPayment(_paymentData);
                await createPaymentForEatFeesByEatFeesId(id, newPayment._id);
            }
        }
        if (_dataPayment.order.payFor.includes("skill")) {
            if (childInfo?.skill?.length > 0) {
                const id = childInfo.skill[0]._id;
                const newPayment = await createPayment(_paymentData);
                await createPaymentForSkillBySkillId(id, newPayment._id);
            }
        }
        if (_dataPayment.order.payFor.includes("transportation")) {
            if (childInfo?.transportation?.length > 0) {
                const id = childInfo.transportation[0]._id;
                const newPayment = await createPayment(_paymentData);
                await createPaymentForTransportationByTransportationId(
                    id,
                    newPayment._id
                );
            }
        }
        await RabbitMQ_SocketPaymentUpdate(_data.data);
    } catch (error) {
        logger.error(error);
        throw new ApiError(500, error.message);
    }
    return null;
};

export default {
    GetTuitionFeesByChildId,
    HandleGetChildrenLearnByParentId,
    HandlePaymentUpdate,
};
