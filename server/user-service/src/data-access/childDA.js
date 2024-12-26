import {
    User,
    Children,
    Skill,
    Class,
    EatFee,
    Transportation,
    Healthlogs,
} from "../database/index.js";
import {getCurrentDate} from "../utils/date.js";
import {createPayment} from "./paymentDA.js";

const createHealthlogForChild = async (healthLogData) => {
    return await Healthlogs.create(healthLogData);
};

const getHealthLogsByChildId = async (childId) => {
    return await Healthlogs.find({childId: childId}).sort({createdAt: 1});
};

const GetAllChildByParentId = async (parentId) => {
    const children = await User.findById(parentId)
        .select("_id")
        .populate({
            path: "children",
            select: "firstName lastName avatar",
            populate: [
                {
                    path: "class",
                    match: {payment: false},
                    select: "_id classId payment",
                },
                {
                    path: "skill",
                    match: {payment: false},
                    select: "_id skillCourseId payment",
                },
            ],
        });
    return children;
};
const findClassById = async (classId) => {
    const classDetails = await Class.find({classId: classId});
    return classDetails;
};

const findChildrenByClassId = async (classObjectId) => {
    return await Children.find({class: {$in: classObjectId}})
        .select(
            "_id firstName lastName dateOfBirth avatar birthCertificate favourite class skill transportation"
        )
        .exec();
};
const findSkillById = async (skillId) => {
    return Skill.find({skillId: skillId});
};
const findChildrenBySkill = async (skillObjectId) => {
    return Children.find({skill: {$in: skillObjectId}})
        .select(
            "_id firstName lastName dateOfBirth avatar birthCertificate favourite class skill"
        )
        .exec();
};
const findChildByCondition = async (
    condition,
    select,
    skip,
    limit,
    sort,
    populate
) => {
    try {
        const model = Children;
        let queryBuilder = model
            .find(condition)
            .skip(skip)
            .limit(limit)
            .select(select);
        if (sort && Object.keys(sort).length > 0) {
            queryBuilder = queryBuilder.sort(sort);
        }
        if (populate !== undefined) {
            queryBuilder = queryBuilder.populate(populate);
        }
        return await queryBuilder;
    } catch (error) {
        console.error(error);
    }
};
const findOneChildByCondition = async (condition, select, populate) => {
    try {
        const model = Children;
        let queryBuilder = model.findOne(condition).select(select);
        if (populate !== undefined) {
            queryBuilder = queryBuilder.populate(populate);
        }
        return await queryBuilder;
    } catch (error) {
        console.log(error);
    }
};
const findChildByPopulateClass = async (chidId, condition) => {
    return await Children.findById(chidId).populate({
        path: "class",
        match: condition,
        select: "_id classId status",
    });
};
const findChildByPopulate = async (chidId, path, condition, select) => {
    return await Children.findById(chidId).populate({
        path: path,
        match: condition,
        select: select,
    });
};

async function countChild(condition) {
    return await Children.countDocuments(condition);
}

const getChildLearingById = async (childId) => {
    return await Children.findById(childId)
        .populate("class")
        .populate("skill")
        .exec();
};

const GetChildrenFeeByChildId = async (childId, time) => {
    return await Children.findById(childId)
        .select("-docs")
        .populate({
            path: "class",
            match: {
                status: "ACTIVE",
                $expr: {
                    $or: [
                        {$lt: [{$year: "$createdAt"}, time.year]},
                        {
                            $and: [
                                {$eq: [{$year: "$createdAt"}, time.year]},
                                {$lte: [{$month: "$createdAt"}, time.month]},
                            ],
                        },
                    ],
                },
            },
            populate: {
                path: "payments",
                match: {month: time.month, year: time.year},
            },
        })
        .populate({
            path: "skill",
            match: {
                status: "ACTIVE",
                $expr: {
                    $or: [
                        {$lt: [{$year: "$createdAt"}, time.year]},
                        {
                            $and: [
                                {$eq: [{$year: "$createdAt"}, time.year]},
                                {$lte: [{$month: "$createdAt"}, time.month]},
                            ],
                        },
                    ],
                },
            },
            populate: {
                path: "payments",
                match: {month: time.month, year: time.year},
            },
        })
        .populate({
            path: "transportation",
            match: {
                status: "ACTIVE",
                $expr: {
                    $or: [
                        {$lt: [{$year: "$createdAt"}, time.year]},
                        {
                            $and: [
                                {$eq: [{$year: "$createdAt"}, time.year]},
                                {$lte: [{$month: "$createdAt"}, time.month]},
                            ],
                        },
                    ],
                },
            },
            populate: {
                path: "payments",
                match: {month: time.month, year: time.year},
            },
        })
        .populate({
            path: "eatFees",
            match: {
                status: "ACTIVE",
                $expr: {
                    $or: [
                        {$lt: [{$year: "$createdAt"}, time.year]},
                        {
                            $and: [
                                {$eq: [{$year: "$createdAt"}, time.year]},
                                {$lte: [{$month: "$createdAt"}, time.month]},
                            ],
                        },
                    ],
                },
            },
            populate: {
                path: "payments",
                match: {month: time.month, year: time.year},
            },
        })
        .exec();
};
const updatePaymentByChildIdPayFor = async (
    _dataPayment,
    paymentMethod = "ONLINE"
) => {
    const childInfo = await GetChildrenFeeByChildId(_dataPayment.childId);
    if (!childInfo) {
        return null;
    }
    const currentDate = getCurrentDate();
    const paymentData = {
        amount: _dataPayment.amount,
        month: currentDate.month,
        year: currentDate.year,
        isPay: true,
        paymentMethod: paymentMethod,
    };
    if (_dataPayment.payFor.includes("class")) {
        if (childInfo?.class?.length > 0) {
            const classId = childInfo.class[0]._id;
            console.log("vao day 2", classId);
            const newPayment = await createPayment(paymentData);
            console.log("newPayment", newPayment);
            await Class.findByIdAndUpdate(
                classId,
                {$push: {payments: newPayment._id}},
                {new: true}
            );
        }
    }
    return null;
};
const createPaymentForClassByClassId = async (classId, paymentId) => {
    await Class.findByIdAndUpdate(
        classId,
        {$push: {payments: paymentId}},
        {new: true}
    );
};
const createPaymentForSkillBySkillId = async (skillId, paymentId) => {
    await Skill.findByIdAndUpdate(
        skillId,
        {$push: {payments: paymentId}},
        {new: true}
    );
};
const createPaymentForEatFeesByEatFeesId = async (eatFeesId, paymentId) => {
    await EatFee.findByIdAndUpdate(
        eatFeesId,
        {$push: {payments: paymentId}},
        {new: true}
    );
};
const createPaymentForTransportationByTransportationId = async (
    transportationId,
    paymentId
) => {
    await Transportation.findByIdAndUpdate(
        transportationId,
        {$push: {payments: paymentId}},
        {new: true}
    );
};

const createTransportationForChildDA = async (childId, _transportId) => {
    const child = await Children.findByIdAndUpdate(
        {_id: childId},
        {
            $push: {transportation: _transportId},
        },
        {new: true}
    );
    return null;
};
const getChildInforByParentIdAndChildId = async (parentId, childId) => {
    return await User.findById(parentId)
        .populate({
            path: "children",
            match: {_id: childId},
            select: "_id firstName lastName avatar",
        })
        .select("_id firstName lastName");
};

const getChildTransportDetailByParentIdAndChildId = async (childId) => {
    return await Children.findById(childId)
        .select("_id firstName lastName avatar")
        .populate({
            path: "transportation",
            match: {
                status: "ACTIVE",
            },
        })
        .exec();
};
export {
    GetAllChildByParentId,
    findChildByCondition,
    countChild,
    findChildByPopulateClass,
    getChildLearingById,
    findOneChildByCondition,
    GetChildrenFeeByChildId,
    findChildrenByClassId,
    findClassById,
    findSkillById,
    findChildrenBySkill,
    updatePaymentByChildIdPayFor,
    createPaymentForClassByClassId,
    createPaymentForSkillBySkillId,
    createPaymentForEatFeesByEatFeesId,
    createPaymentForTransportationByTransportationId,
    findChildByPopulate,
    createTransportationForChildDA,
    getChildInforByParentIdAndChildId,
    createHealthlogForChild,
    getHealthLogsByChildId,
    getChildTransportDetailByParentIdAndChildId
};
