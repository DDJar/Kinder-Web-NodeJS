import {
    User,
    Class,
    Skill,
    AdnissionApplication,
    AdmissionDocuments,
    TransportationApplication,
    Transportation,
    Feedback,
} from "../database/index.js";
import Children from "../database/models/ChildModel.js";
import {ApiError} from "../utils/index.js";
import userBusiness from "../business/userBusiness.js";
import childBusiness from "../business/childBusiness.js";
import authBusiness from "../business/authBusiness.js";
import mongoose from "mongoose";
import {isValidObjectId} from "mongoose";

const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;
        const user = req.user;
        if (newPassword == "null" || currentPassword == "null") {
            return res.json({
                status: 400,
                message: `Invalid password`,
            });
        }
        const {updatedUser} = await userBusiness.handleChangePassword(
            user,
            currentPassword,
            newPassword
        );
        return res.json({
            status: 200,
            message: "Password changed successfully",
            data: {user: updatedUser},
        });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
            });
        }
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        let {role} = req.query;
        const listUsers = await User.find({role: role}).select(
            "_id firstName lastName username email phone role"
        );
        return res.json({
            status: 200,
            message: "User fetched successfully",
            data: {
                users: listUsers,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};
const getUsers = async (req, res) => {
    try {
        let {role, tab} = req.query;
        const {listUsers, totalPages} = await userBusiness.handleFillterUser(
            role,
            tab,
            5
        );
        return res.json({
            status: 200,
            message: "Users fetched successfully",
            data: {
                users: listUsers,
                totalPages: totalPages,
            },
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const searchUsers = async (req, res) => {
    try {
        let {role, tab, search} = req.query;
        const {listUsers, totalPages} = await userBusiness.handleSearchUser(
            role,
            tab,
            5,
            search
        );
        return res.json({
            status: 200,
            message: "Users search successfully",
            data: {
                users: listUsers,
                totalPages: totalPages,
            },
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const updateUsers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {firstName, lastName, username, email, phone, role} = req.body;
        if (!firstName || !lastName || !username || !email || !phone || !role) {
            return res.json({
                status: 400,
                message: `Data input are required fields`,
            });
        }

        const updatedFields = {
            firstName,
            lastName,
            username,
            email,
            phone,
            role,
        };
        const {updatedUser} = await userBusiness.handleUpdateUserById(
            userId,
            updatedFields
        );
        return res.json({
            status: 200,
            message: `User with ID ${userId} updated successfully`,
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const lockUsers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {role} = req.body;
        const updatedFields = {
            role,
        };
        const {updatedUser} = await userBusiness.handleLockUserById(
            userId,
            updatedFields
        );
        return res.json({
            status: 200,
            message: `User with ID ${userId} updated successfully`,
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.json({
                status: 401,
                message: `User with ID ${userId} not found`,
            });
        }
        const userProfile = await userBusiness.getUserProfile(userId);
        if (!userProfile) {
            return res.json({
                status: 404,
                message: `User with ID ${userId} not found`,
            });
        }
        return res.json({
            status: 200,
            message: `User with ID ${userId} fetched successfully`,
            data: userProfile,
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedUser = await userBusiness.updateProfile(userId, req.body);
        return res.json({
            status: 200,
            message: `User with ID ${userId} updated successfully`,
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const addChild = async (req, res) => {
    try {
        const {userId, child} = req.body;

        const user = await userBusiness.addChild(userId, child);

        return res.json({
            status: 200,
            message: "Child added successfully!",
            data: user,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message,
        });
    }
};

const getChildren = async (req, res) => {
    const {userId} = req.query;
    try {
        const user = await userBusiness.getChildren(userId);
        return res.json({
            status: 200,
            message: "Children fetched successfully!",
            data: user,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getChildAll = async (req, res) => {
    const {childId} = req.params;
    try {
        const userId = req.user._id;
        const result = await userBusiness.showdoc(childId, userId);
        return res.json({
            status: 200,
            message: "Child fetched successfully!",
            data: result,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getChildById = async (req, res) => {
    try {
        const childId = req.params.childId;
        console.log("id", childId);
        if (!childId) {
            return res.json({
                status: 400,
                message: "Child not found",
            });
        }
        const userId = req.user._id;
        const child = await userBusiness.getChildById(userId, childId);
        return res.json({
            status: 200,
            message: "Child fetched successfully!",
            data: child,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

export const getClassAndSkillInfo = async (req, res) => {
    const {childId} = req.params;
    if (!childId) {
        throw new ApiError(400, "Child not found");
    }
    try {
        const data = await userBusiness.getClassAndSkillInfoByChildId(childId);
        return res.json({
            status: 200,
            message: "Child's class and skill fetched successfully!",
            data,
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};

const updateChildren = async (req, res) => {
    try {
        const userId = req.user._id;
        const childId = req.params.childId;
        const updatedChild = await userBusiness.updateChildren(
            userId,
            childId,
            req.body
        );
        return res.json({
            status: 200,
            message: `Child with ID ${childId} updated successfully`,
            data: {
                child: updatedChild,
            },
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const registerClass = async (req, res) => {
    const {idChild, idClass, name} = req.body;
    try {
        const user = await User.findById(req.user._id).populate({
            path: "children",
            match: {_id: idChild},
        });
        if (!user || !user.children.length) {
            throw new ApiError(404, "Child not found");
        }
        const child = user.children.find((c) => c._id.toString() === idChild);
        if (!child) {
            throw new ApiError(404, "Child not found");
        }
        const newClass = {
            classId: idClass,
            status: "REGISTER",
            name: name,
        };
        const createClass = await Class.create(newClass);

        child.class.push(createClass._id);
        await child.save();

        return res.json({
            status: 200,
            message: "Child fetched successfully!",
            data: user.children,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const registerSkill = async (req, res) => {
    const {idChild, idSkill, name} = req.body;
    try {
        const user = await User.findById(req.user._id).populate({
            path: "children",
            match: {_id: idChild},
        });
        if (!user || !user.children.length) {
            throw new ApiError(404, "Child not found");
        }
        const child = user.children.find((c) => c._id.toString() === idChild);
        if (!child) {
            throw new ApiError(404, "Child not found");
        }
        const newSkill = {
            skillId: idSkill,
            status: "REGISTER",
            name: name,
        };
        const createSkill = await Skill.create(newSkill);
        child.skill.push(createSkill._id);

        await child.save();
        return res.json({
            status: 200,
            message: "Children fetched successfully!",
            data: user.children,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const createChildTransport = async (req, res) => {
    try {
        const {transportationId, payments, childId} = req.body;

        const newTransportation = new Transportation({
            transportationId,
            payments,
        });

        const savedTransportation = await newTransportation.save();

        const child = await Children.findById(childId);
        if (!child) {
            return res.status(404).json({message: "Child not found"});
        }

        child.transportation.push(savedTransportation._id);

        await child.save();

        return res.json({
            status: 200,
            message: "Transportation created and added to child successfully!",
            data: child,
        });
    } catch (error) {
        console.error("Error creating transportation:", error);
        res.status(500).json({
            message: "Failed to create transportation and update child",
            error: error.message,
        });
    }
};

const findUsersWithRegisteredChildren = async (req, res) => {
    let {type, tab} = req.query;

    try {
        const {result, totalPages} =
            await userBusiness.handfindUsersWithRegisteredChildren(type, tab);
        return res.json({
            status: 200,
            message: "Fetched successfully!",
            data: {result: result, totalPages: totalPages},
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getDataFormRegister = async (req, res) => {
    const adnissionId = req.params.id;
    try {
        const {result} = await userBusiness.handReviewRegisteredFormChild(
            adnissionId
        );
        return res.json({
            status: 200,
            message: "Fetched successfully!",
            data: {result},
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getChildAcademy = async (req, res) => {
    try {
        let {type, academyId} = req.query;
        const {result} = await userBusiness.handChildAcademy(type, academyId);
        return res.json({
            status: 200,
            message: "Featch successfully!",
            data: {result: result},
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};
const getChildWait = async (req, res) => {
    try {
        let {type, academyId, tab, limit} = req.query;
        const {result, totalPages} = await userBusiness.handChildWait(
            type,
            academyId,
            tab,
            limit
        );
        return res.json({
            status: 200,
            message: "Featch successfully!",
            data: {result: result, totalPages: totalPages},
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const searchChildWait = async (req, res) => {
    try {
        let {type, academyId, condition, filter, tab, limit} = req.query;
        const {result, totalPages} = await userBusiness.handSearchChildWait(
            type,
            academyId,
            condition,
            filter,
            tab,
            limit
        );
        return res.json({
            status: 200,
            message: "Featch successfully!",
            data: {result: result, totalPages: totalPages},
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const updateAcademyStatus = async (req, res) => {
    try {
        let {type, status, id, academyId, tuition, userId, childId} = req.body;
        let {result} = await userBusiness.handUpdateAcademyStatus(
            type,
            status,
            id,
            academyId,
            tuition,
            userId,
            childId
        );
        return res.json({
            status: 200,
            message: "Update successfully!",
            data: {result: result},
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};
const getClassesByTeacherFromAcademy = async (req, res) => {
    const {teacherId} = req.query;
    try {
        const response = await axios.get(`${API_URL}/get-classes-by-teacher`, {
            params: {
                teacherId: teacherId,
            },
        });

        if (!response.data || !response.data.classes) {
            return res.json({
                status: 404,
                message: "No classes found for this teacher.",
            });
        }
        console.log("Fetched classes:", classes);
        return res.json({
            status: 200,
            message: "Classes fetched successfully!",
            data: response.data.classes,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

async function findChildrenByClassId(classId) {
    console.log(classId);
    try {
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            throw new Error("Invalid classId");
        }

        const classes = await Class.find({
            classId: classId,
            status: "ACCEPT",
        }).select("_id");

        if (classes.length === 0) {
            return [];
        }

        const classIds = classes.map((cls) => cls._id);

        const children = await Children.find({class: {$in: classIds}}).populate(
            "class"
        );

        return children;
    } catch (error) {
        console.error("Error finding children by classId:", error);
        throw error;
    }
}

const getChildrenByClassId = async (req, res) => {
    const {classId, attendDay, attendMonth, attendYear} = req.query;
    try {
        const result = await childBusiness.fetchChildrenByClassId(
            classId,
            attendDay,
            attendMonth,
            attendYear
        );
        return res.status(result.status).json(result);
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};
const getChildrenBySkillId = async (req, res) => {
    const {skillId} = req.query;
    try {
        const response = await childBusiness.getChildrenBySkillId(skillId);
        return res.status(response.status).json(response);
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};
const processingDataFormRegister = async (req, res) => {
    const {admissionApplicationId, status, noteByStaff} = req.body;
    try {
        const {result} = await userBusiness.handResultRegisteredFormChild(
            admissionApplicationId,
            status,
            noteByStaff
        );
        return res.json({
            status: 200,
            message: "Processing successfully!",
            data: {result},
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
//đăng kí học
export const createAdmissionApplication = async (req, res) => {
  const { userId, childId } = req.body;
  if (!userId || !childId) {
    throw new ApiError(
      400,
      "ParentId is required, childId is required or invalid"
    );
  }
  try {
    const { admissionApplication } =
      await userBusiness.handleCreateAdmissionApplication({ userId, childId });

        return res.status(200).json({
            status: 200,
            message: "Admission application created successfully!",
            data: admissionApplication,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
//cập nhật đăng kí
const updateAdmissionApplication = async (req, res) => {
    const {childId, status} = req.body;
    console.log(req.body);

  try {
    const {updatedApplication} =
      await userBusiness.handleUpdateAdmissionApplication(childId, status);

        return res.status(200).json({
            status: 200,
            message: "Admission application updated successfully!",
            data: updatedApplication,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
//hiển thị đơn
export const getRegisterByChildId = async (req, res) => {
    console.log("Request Body:", req.body);
    const {childId} = req.query;
    console.log("Child ID:", childId);

    try {
        const admissionApplication = await userBusiness.handleGetRegisterByChildId(
            childId
        );

        return res.status(200).json({
            status: 200,
            data: admissionApplication,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const updateregistertransport = async (req, res) => {
    const {userId, childId, address, startTime, status, id, noteByStaff} =
        req.body;

    try {
        if (!userId || !childId) {
            return res.json({
                status: 400,
                message: "userId, childId are required",
            });
        }
        const updatedTransportationApplication =
            await userBusiness.handleUpdateTransportation(id, {
                userId,
                childId,
                address,
                startTime,
                status,
                noteByStaff,
            });

        if (!updatedTransportationApplication) {
            return res.status(404).json({
                status: 404,
                message: "Transportation application not found",
            });
        }

        return res.json({
            status: 200,
            message: "Transportation application updated successfully!",
            data: updatedTransportationApplication,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
//đăng kí bus
const createregistertransport = async (req, res) => {
    const {userId, childId, address, startTime} = req.body;

    try {
        const transportationApplication =
            await userBusiness.handleCreateTransportationApplication({
                userId,
                childId,
                address,
                startTime,
            });

        return res.json({
            status: 200,
            message: "Transport application created successfully!",
            data: transportationApplication,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getAllTransport = async (req, res) => {
    try {
        const applications = await userBusiness.getAllTransport();

        return res.json({
            status: 200,
            message: "Fetched history register successfully",
            applications,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getAllTransportationApplications = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({message: "User ID is required"});
        }

        const applications = await TransportationApplication.find({userId})
            .populate("userId", "firstName lastName")
            .populate({
                path: "childId",
                select: "firstName lastName transportation",
                populate: {
                    path: "transportation",
                    select: "transportationId",
                },
            });

        if (applications.length === 0) {
            return res.json({
                status: 200,
                message: "No applications found",
                data: [],
            });
        }

        return res.status(200).json({applications});
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

//doc
const createAdmissionDocument = async (req, res) => {
    const {title, description, img, status, childId} = req.body;

    try {
        const admissionDocument = await userBusiness.handleCreateAdmissionDocument({
            title,
            description,
            img,
            status,
            childId,
        });

        return res.status(200).json({
            status: 200,
            message: "Document created successfully and linked to the child!",
            data: admissionDocument,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
//hiển thị
export const getAdmissionDocumentsByChildId = async (req, res) => {
    const {id: childId} = req.params;

    try {
        const admissionDocuments =
            await userBusiness.handleGetAdmissionDocumentsByChildId(childId);

        return res.status(200).json({
            status: 200,
            message: "Documents fetched successfully",
            data: admissionDocuments,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

export const updateAdmissionDocument = async (req, res) => {
    const {documentId, title, description, img} = req.body;

    try {
        const updatedDocument = await userBusiness.handleUpdateAdmissionDocument({
            documentId,
            title,
            description,
            img,
        });

        return res.status(200).json({
            status: 200,
            message: "Document updated successfully!",
            data: updatedDocument,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getAvatarUrl = async (req, res) => {
    const userId = req.user._id;
    const avatarFileName = await userBusiness.getAvatarFileName(userId);
    const blobname = avatarFileName.avatar;
    if (!avatarFileName) {
        return res.status(404).send({error: "Avatar not found"});
    }
    try {
        return res.json({
            status: 200,
            message: "Avatar retrieved successfully",
            data: blobname,
        });
    } catch (error) {
        console.error("Error getting image URL:", error);
        res.status(500).send({error: "Failed to get image URL"});
    }
};

const uploadAvatar = async (req, res) => {
    const userId = req.user._id;
    const {avatarFileName} = req.body;

    console.log("userId", userId);
    console.log("avatarFileName", req.body);

    try {
        const updatedUser = await userBusiness.saveUserAvatar(
            userId,
            avatarFileName
        );
        console.log("updatedUser", updatedUser);
        return res.json({
            status: 200,
            message: "Avatar uploaded successfully",
            data: updatedUser,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getChildAvatarUrl = async (req, res) => {
    const userId = req.user._id;
    const {childId} = req.params;

    try {
        const avatarFileName = await userBusiness.getChildAvatarUrl(
            userId,
            childId
        );
        if (!avatarFileName) {
            return res.status(404).send({error: "Child avatar not found"});
        }
        return res.json({
            status: 200,
            message: "Child avatar retrieved successfully",
            data: avatarFileName,
        });
    } catch (error) {
        console.error("Error getting child image URL:", error);
        res.status(500).send({error: "Failed to get child image URL"});
    }
};

const uploadChildAvatar = async (req, res) => {
    const userId = req.user._id;
    const {childId, avatarFileName} = req.body;

    try {
        const updatedChild = await userBusiness.saveChildAvatar(
            userId,
            childId,
            avatarFileName
        );
        return res.json({
            status: 200,
            message: "Child avatar uploaded successfully",
            data: updatedChild,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const arrangeChild = async (req, res) => {
    const {academyId, selectedChildren, type} = req.body;
    try {
        const {resList} = await userBusiness.handleArrangeChild(
            type,
            academyId,
            selectedChildren
        );
        return res.json({
            status: 200,
            message: "Arrange successfully",
            data: resList,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const changeClassChild = async (req, res) => {
    const {type, childId, oldAcademyId, newAcademyId} = req.body;
    try {
        const {result} = await userBusiness.handleChangeClassChild(
            type,
            childId,
            oldAcademyId,
            newAcademyId
        );
        return res.json({
            status: 200,
            message: "Change class successfully",
            data: result,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const checkInClassChild = async (req, res) => {
    const {classId, childId, isCheckIn, receiver} = req.body;
    try {
        const {result} = await childBusiness.handleCheckInChild(
            req.user._id,
            classId,
            childId,
            isCheckIn,
            receiver
        );
        return res.json({
            status: 200,
            message: "Successfully",
            data: result,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const checkOutClassChild = async (req, res) => {
    const {classId, childId, isCheckOut, receiver, receiverUrl} = req.body;
    try {
        const {result} = await childBusiness.handleCheckOutChild(
            req.user._id,
            classId,
            childId,
            isCheckOut,
            receiver,
            receiverUrl
        );
        return res.json({
            status: 200,
            message: "Successfully",
            data: result,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getAttendance = async (req, res) => {
    const {childId} = req.params;
    if (!childId) {
        throw new ApiError(404, "Child not Found");
    }
    try {
        const attendanceRecords = await childBusiness.getChildAttendance(childId);

        return res.json({
            status: 200,
            message: "Attendance data retrieved successfully",
            data: attendanceRecords,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId || !isValidObjectId(userId)) {
            return res.json({
                status: 400,
                message: "TeacherId is required or invalid",
            });
        }

        const user = await authBusiness.getUserById(userId);
        if (!user) {
            return res.json({
                status: 200,
                message: "No data found for this teacher",
                data: [],
            });
        }

        return res.json({
            status: 200,
            message: "Classes fetched successfully!",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.json({
            status: error.statusCode || 500,
            message: "Internal server error",
        });
    }
};
const createFeedback = async (req, res) => {
    const {content, rate, teacherId} = req.body;
    const userId = req.user._id;

    if (!userId || userId.trim() === "" || userId === "null") {
        return res.json({
            status: 400,
            message: "UserId is required or invalid",
        });
    }

    try {
        const feedback = await userBusiness.createFeedbacks({
            content,
            rate,
            teacherId,
            userId,
        });

        return res.json({
            status: 200,
            message: "Feedback created successfully!",
            data: feedback,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await userBusiness.getAllFeedbacks();
        console.log("feedbacks", feedbacks);
        if (!feedbacks || feedbacks.length === 0) {
            return res.status(200).json({
                message: "No feedback data found.",
                data: [],
            });
        }

        return res.status(200).json({
            status: 200,
            message: "feedbacks fetched successfully!",
            data: feedbacks,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};
const getApplicationbyId = async (req, res) => {
    const {id} = req.query;
    console.log("Received ID:", id);

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid ID format",
            });
        }
        const result = await userBusiness.handViewRegisteredFormChild(id);

        if (!result) {
            return res.status(404).json({
                status: 404,
                message: `Admission application with ID ${id} not found`,
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Fetched successfully!",
            data: result,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const createHealthlog = async (req, res) => {
    try {
        const {height, weight, note, childId} = req.body;
        const noteBy = req.user._id;

        if (!childId) {
            return res.status(400).json({
                status: 400,
                message: "Child ID is required.",
            });
        }

        const healthlog = await childBusiness.createHealthlog(
            height,
            weight,
            note,
            childId,
            noteBy
        );

        return res.json({
            status: 200,
            message: "Healthlog created successfully",
            data: healthlog,
        });
    } catch (error) {
        return res.status(500).json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const getChildDevelopment = async (req, res) => {
    try {
        const {childId} = req.params;
        if (!childId) {
            return res.json({
                status: 400,
                message: "Child ID are required.",
            });
        }

        const developmentData = await childBusiness.getDevelopmentByChildId(
            childId
        );

        return res.json({
            status: 200,
            message: "Data fetched successfully",
            data: developmentData,
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};

const getChildrenTransportDetail = async (req, res) => {
    const {childId} = req.query;
    try {
        const user = await userBusiness.getChildrenTransportDetail(childId);
        return res.json({
            status: 200,
            message: "Children fetched successfully!",
            data: user,
        });
    } catch (error) {
        return res.json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

export default {
    createHealthlog,
    changePassword,
    getAllUsers,
    getProfile,
    getUsers,
    updateUsers,
    searchUsers,
    addChild,
    getChildren,
    getChildById,
    getClassAndSkillInfo,
    updateChildren,
    registerClass,
    registerSkill,
    findUsersWithRegisteredChildren,
    updateAcademyStatus,
    updateProfile,
    getClassesByTeacherFromAcademy,
    findChildrenByClassId,
    getChildrenByClassId,
    lockUsers,
    getDataFormRegister,
    processingDataFormRegister,
    createAdmissionApplication,
    createAdmissionDocument,
    getAvatarUrl,
    getChildAll,
    updateAdmissionApplication,
    updateAdmissionDocument,
    getRegisterByChildId,
    uploadAvatar,
    getChildAvatarUrl,
    uploadChildAvatar,
    getChildAcademy,
    getChildWait,
    searchChildWait,
    arrangeChild,
    changeClassChild,
    getAdmissionDocumentsByChildId,
    createregistertransport,
    getAllTransportationApplications,
    getAllTransport,
    updateregistertransport,
    getAttendance,
    checkOutClassChild,
    checkInClassChild,
    getChildrenBySkillId,
    createChildTransport,
    createFeedback,
    getUserById,
    getAllFeedbacks,
    getApplicationbyId,
    getChildDevelopment,
    getChildrenTransportDetail
};
