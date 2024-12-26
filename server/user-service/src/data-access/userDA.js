import {
    User,
    Children,
    AdnissionApplication,
    TransportationApplication,
    AdmissionDocuments,
    Feedback,
} from "../database/index.js";
import {getCurrentDate} from "../utils/date.js";
import mongoose from "mongoose";

async function getUserByUserName(_username) {
    return await User.findOne({username: _username}).select(
        "_id firstName lastName avatar role email password"
    );
}

async function getUserByEmail(_email) {
    return await User.findOne({email: _email}).select(
        "_id firstName lastName avatar role email password"
    );
}

async function checkUserByCondition(condition) {
    return await User.findOne(condition || {}).select(
        "_id firstName lastName avatar phone email role email password"
    );
}

async function fillterUser(condition, skip, limit) {
    return await User.find(condition || {})
        .skip(skip)
        .limit(limit)
        .select("_id firstName lastName username email phone role");
}

async function countUser(condition) {
    return await User.countDocuments(condition);
}

async function updateUserById(_id, data) {
    try {
        return await User.findByIdAndUpdate(_id, data, {new: true});
    } catch (error) {
        return {
            status: error.code || 500,
            message: error.codeName || "Internal server error",
        };
    }
}

async function createUser(_user) {
    return await User.create(_user);
}

const findUserById = async (userId) => {
    return User.findById(userId).select(
        "_id name firstName lastName email avatar address phone children"
    );
};

const getUserByCriteria = async (criteria) => {
    return await User.findOne(criteria);
};

const findPasswordUserById = async (userId) => {
    const userPassword = await User.findById(userId).select("password");
    return userPassword.password;
};

const updateUser = async (user) => {
    return await user.save();
};

const updateChild = async (children) => {
    return await children.save();
};

const createChild = async (childData) => {
    return await Children.create(childData);
};

const findChildByNameAndBirthdate = async (firstName, lastName) => {
    return await Children.findOne({firstName, lastName});
};

const findChildrenByUserId = async (userId) => {
    return await User.findById(userId)
        .select("address children")
        .populate({
            path: "children",
            select:
                "_id firstName lastName dateOfBirth avatar birthCertificate favourite class skill transportation",
            populate: [
                {
                    path: "class",
                    select: "_id classId name status createdAt",
                },
                {
                    path: "skill",
                    select: "_id skillId name status createdAt",
                },
                {
                    path: "transportation",
                    select: "_id",
                },
            ],
        })
        .select("children");
};
const handGetChildRegisterClass = () => {
    return AdnissionApplication.aggregate([
        {
            $match: {
                status: "REGISTER",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $unwind: "$userDetails",
        },
        {
            $lookup: {
                from: "childrens",
                localField: "childId",
                foreignField: "_id",
                as: "childrenDetails",
            },
        },
        {
            $unwind: "$childrenDetails",
        },
        {
            $project: {
                admissionApplicationId: "$_id",
                _id: "$userDetails._id",
                firstName: "$userDetails.firstName",
                lastName: "$userDetails.lastName",
                childrenDetails: {
                    _id: "$childrenDetails._id",
                    firstName: "$childrenDetails.firstName",
                    lastName: "$childrenDetails.lastName",
                    dateOfBirth: "$childrenDetails.dateOfBirth",
                },
            },
        },
    ]);
};
const handGetChildRegisterById = async (userId, childId) => {
    return await User.findById(userId)
        .populate({
            path: "children",
            match: {_id: childId},
            select: "_id firstName lastName dateOfBirth avatar docs",
            populate: [
                {
                    path: "docs",
                    select: "_id title img",
                },
                {
                    path: "transportation",
                    select: "_id",
                },
            ],
        })
        .select("firstName lastName address phone children");
};
const handGetAdnissionApplicationById = async (adnissionId) => {
    return await AdnissionApplication.findById(adnissionId).select(
        "userId childId startTime createdAt"
    );
};
const handUpdateAdnissionApplicationById = async (adnissionId, data) => {
    return await AdnissionApplication.findByIdAndUpdate(adnissionId, data, {
        new: true,
    }).select("userId childId startTime createdAt");
};
const handGetChildRegisterSkill = () => {
    return User.aggregate([
        {
            $lookup: {
                from: "childrens",
                localField: "children",
                foreignField: "_id",
                as: "childrenDetails",
            },
        },
        {
            $unwind: "$childrenDetails",
        },
        {
            $unwind: "$childrenDetails.skill",
        },
        {
            $lookup: {
                from: "skills",
                localField: "childrenDetails.skill",
                foreignField: "_id",
                as: "skillDetails",
            },
        },
        {
            $unwind: "$skillDetails",
        },
        {
            $match: {
                "skillDetails.status": "REGISTER",
            },
        },
        {
            $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                "childrenDetails._id": 1,
                "childrenDetails.firstName": 1,
                "childrenDetails.lastName": 1,
                "childrenDetails.dateOfBirth": 1,
                "skillDetails._id": 1,
                "skillDetails.skillId": 1,
                "skillDetails.name": 1,
            },
        },
    ]);
};
const findAppByChildId = async (childId) => {
    return await AdnissionApplication.findOne({childId});
};

export const saveAdmissionApplication = async (admissionApplication) => {
    return await admissionApplication.save();
};
export const createAdmissionApplication = async (applicationData) => {
    return await AdnissionApplication.create(applicationData);
};
const updateUserAvatar = async (userId, avatarFileName) => {
    return await User.findByIdAndUpdate(
        userId,
        {avatar: avatarFileName},
        {new: true}
    );
};

const getUserAvatar = async (userId) => {
    return await User.findById(userId).select("avatar");
};

const getChildAvatar = async (userId, childId) => {
    const child = await findChildById(userId, childId);
    if (child) {
        return child.avatar;
    }
    return null;
};

const updateChildAvatar = async (userId, childId, avatarFileName) => {
    const child = await findChildById(userId, childId);
    if (child) {
        child.avatar = avatarFileName;
        return await child.save();
    }
    throw new Error("Child not found");
};

const findChildById = async (userId, childId) => {
    const user = await User.findById(userId)
        .populate({
            path: "children",
            populate: {
                path: "docs",
                select: "title img",
            },
        })
        .select("children");

    if (user) {
        return user.children.find((child) => child._id.toString() === childId);
    }
    return null;
};

const findUserByChildId = async (childId, selectUser, selectChild) => {
    return await User.findOne({children: childId})
        .select(selectUser)
        .populate({
            path: "children",
            match: {_id: childId},
            select: selectChild,
        });
};

const GetChildrenLearnByParentId = async (parentId, time) => {
    const myChildren = await User.findById(parentId)
        .select("_id")
        .populate({
            path: "children",
            select: "firstName lastName avatar _id",
            populate: [
                {
                    path: "class",
                    select: "_id name updatedAt createdAt",
                    match: {status: "ACTIVE"},
                    populate: {
                        path: "payments",
                        match: {month: time.month, year: time.year},
                    },
                },
                {
                    path: "skill",
                    select: "_id name",
                    match: {status: "ACTIVE"},
                    populate: {
                        path: "payments",
                        match: {month: time.month, year: time.year},
                    },
                },
                {
                    path: "transportation",
                    match: {status: "ACTIVE"},
                    populate: {
                        path: "payments",
                        match: {month: time.month, year: time.year},
                    },
                },
            ],
        });
    return myChildren;
};

const handGetAllTransportationApplications = async (userId) => {
    console.log("userId:", userId);
    return await TransportationApplication.find({userId})
        .populate("userId", "firstName lastName")
        .populate("childId", "firstName lastName")
        .select("userId childId startTime status createdAt address");
};
const createTransportationApplication = async (transportData) => {
    return await TransportationApplication.create(transportData);
};
const createAdmissionDocument = async (documentData) => {
    return await AdmissionDocuments.create(documentData);
};
const findAdmissionDocumentById = async (documentId) => {
    return await AdmissionDocuments.findById(documentId);
};

export const saveAdmissionDocument = async (admissionDocument) => {
    return await admissionDocument.save();
};
export const findAdmissionDocumentsByChildId = async (childId) => {
    return await AdmissionDocuments.find({child: childId});
};
export const linkDocumentToChild = async (childId, documentId) => {
    return await Children.findByIdAndUpdate(
        childId,
        {$push: {docs: documentId}},
        {new: true}
    );
};
const getAllApplications = async () => {
    try {
        return await TransportationApplication.find()
            .populate("userId", "firstName lastName")
            .populate({
                path: "childId",
                select: "firstName lastName class",
                populate: {
                    path: "class",
                    select: "_id classId name status createdAt",
                },
            })
            .exec();
    } catch (error) {
        console.error("Error in transportationRepository:", error);
        throw error;
    }
};
const updateTransportation = async (id, updateData) => {
    try {
        const updatedTransportationApplication =
            await TransportationApplication.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

        return updatedTransportationApplication;
    } catch (error) {
        throw new Error(
            "Error updating transportation application: " + error.message
        );
    }
};
const findAllFeedback = async () => {
    const feedbacks = await Feedback.find()
        .populate("userId", "firstName lastName email phone children")
        .populate("teacherId", "firstName lastName email phone avatar")
        .exec();
    console.log("Feedbacks found:", feedbacks);
    return feedbacks;
};
const handGetApplicationById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }

    return await AdnissionApplication.findById(id).select(
        "userId childId startTime createdAt"
    );
};
const createFeedback = async (feedbackData) => {
    return await Feedback.create(feedbackData);
};

export {
    getUserByUserName,
    updateTransportation,
    createUser,
    findUserById,
    findPasswordUserById,
    updateUser,
    getUserByEmail,
    checkUserByCondition,
    fillterUser,
    countUser,
    updateUserById,
    createChild,
    findChildrenByUserId,
    findChildById,
    updateChild,
    handGetChildRegisterClass,
    handGetChildRegisterSkill,
    handGetAdnissionApplicationById,
    handGetChildRegisterById,
    handUpdateAdnissionApplicationById,
    findChildByNameAndBirthdate,
    findAppByChildId,
    updateUserAvatar,
    getUserAvatar,
    getChildAvatar,
    updateChildAvatar,
    findUserByChildId,
    handGetAllTransportationApplications,
    createTransportationApplication,
    createAdmissionDocument,
    getAllApplications,
    findAdmissionDocumentById,
    GetChildrenLearnByParentId,
    findAllFeedback,
    handGetApplicationById,
    createFeedback,
    getUserByCriteria,
};
