import {
  updateUserById,
  createChild,
  findChildById,
  findChildrenByUserId,
  findUserById,
  updateUser,
  updateChild,
  fillterUser,
  countUser,
  findPasswordUserById,
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
  linkDocumentToChild,
  createAdmissionDocument,
  getAllApplications,
  findAdmissionDocumentById,
  saveAdmissionDocument,
  findAdmissionDocumentsByChildId,
  saveAdmissionApplication,
  createAdmissionApplication,
  updateTransportation,
  findAllFeedback,
  handGetApplicationById,
  createFeedback,
  getUserByEmail,
  checkUserByCondition,
  getUserByCriteria,
} from "../data-access/userDA.js";
import bcrypt from "bcryptjs";
import { ApiError, encryptPassword } from "../utils/index.js";
import { send_Notification_Mail_Register_School_For_Child } from "../utils/templateRegisterSchool.js";
import mongoose from "mongoose";
import {
  createClass,
  createEatFees,
  createSkill,
  findAndUpdateClass,
  findClass,
} from "../data-access/classDA.js";
import config from "../config/config.js";
import { findAdnissionApplication } from "../data-access/admissionAppDA.js";
import {
    countChild,
    findChildByCondition,
    getChildLearingById,
    findOneChildByCondition,
    findChildByPopulateClass,
    createTransportationForChildDA,
    getChildInforByParentIdAndChildId, getChildTransportDetailByParentIdAndChildId,
} from "../data-access/childDA.js";
import { createTransportation, getTransportationDetailDriverById } from "../data-access/transportationDA.js";
import { RabbitMQ_SocketNotifyUsers } from "../services/RabbitMQService/send/socketNotifyUsers.js";
import { RabbitMQ_notifyReceiver } from "../services/RabbitMQService/send/mail.js";
import { RabbitMq_GetAcademyById } from "../services/RabbitMQService/sendToGetData/GetAcademyById.js";
import { RabbitMQ_UpdateAcademyById } from "../services/RabbitMQService/send/UpdateAcademyById.js";
import { RabbitMQ_SocketRegisterForSchool } from "../services/RabbitMQService/send/SocketRegisterForSchool.js";
import { RabbitMQ_SocketRegisterForTransport } from "../services/RabbitMQService/send/SocketRegisterForTransport.js";

async function handleUpdateUserById(userId, data) {
  if (!userId || userId === "null") {
    throw new ApiError(404, `User with ID ${userId} not found`);
  }
  const existingEmail = await checkUserByCondition({
    email: data.email,
    _id: { $ne: userId },
  });
  const existingPhone = await checkUserByCondition({
    phone: data.phone,
    _id: { $ne: userId },
  });
  if (existingEmail) {
    throw new ApiError(400, `Duplicate email.`);
  }
  if (existingPhone) {
    throw new ApiError(400, `Duplicate phone.`);
  }
  const updatedUser = await updateUserById(userId, data);
  if (updatedUser.message === "DuplicateKey") {
    throw new ApiError(400, "Duplicate username");
  }
  if (!updatedUser) {
    throw new ApiError(404, `User with ID ${userId} not found`);
  }
  const receiveUser = {
    _id: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    avatar: "",
  };
  const sender = {};
  await RabbitMQ_SocketNotifyUsers(
    receiveUser,
    `Tài khoản của bạn đã cập nhật thành ${data.role}!`,
    sender
  );

  return { updatedUser };
}

async function handleLockUserById(userId, data) {
  if (!userId || userId === "null") {
    throw new ApiError(404, `User with ID ${userId} not found`);
  }
  if (!data.role) {
    throw new ApiError(404, `Not found`);
  }
  const updatedUser = await updateUserById(userId, data);
  if (!updatedUser) {
    throw new ApiError(404, `User with ID ${userId} not found`);
  }
  const receiveUser = {
    _id: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    avatar: "",
  };
  const sender = {};
  let context = {};
  if (data.role === "BLOCK") {
    context = "Tài khoản của bạn đã bị khóa";
  } else {
    context = "Tài khoản của bạn đã được mở khóa";
  }
  await RabbitMQ_SocketNotifyUsers(receiveUser, context, sender);

  return { updatedUser };
}

async function handleFillterUser(role, tab, limit) {
  tab = tab ? parseInt(tab) : 1;
  const skip = (tab - 1) * limit;
  let condition = {};
  if (role !== "ALL") {
    condition = { role: role };
  }
  const listUsers = await fillterUser(condition, skip, limit);
  const totalUsers = await countUser(condition);
  const totalPages = Math.ceil(totalUsers / limit);
  return { listUsers, totalPages };
}

async function handleSearchUser(role, tab, limit, search) {
  tab = tab ? parseInt(tab) : 1;
  const skip = (tab - 1) * limit;
  let searchCondition = {};
  if (role !== "ALL") {
    searchCondition = { role: role };
  }
  if (search) {
    const searchRegex = new RegExp(`${search}`, "i");
    searchCondition.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { username: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }
  const listUsers = await fillterUser(searchCondition, skip, limit);
  const totalUsers = await countUser(searchCondition);
  const totalPages = Math.ceil(totalUsers / limit);
  return { listUsers, totalPages };
}

async function handleUpdatePassword(user, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Invalid password");
  }
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }

  const encryptedPassword = await encryptPassword(newPassword);

  const updatedUser = await updateUserById(user._id, {
    password: encryptedPassword,
  });

  if (!updatedUser) {
    return res.status(404).json({
      status: 404,
      message: `User with ID ${user._id} not found`,
    });
  }

  return { updatedUser };
}

const handleChangePassword = async (user, currentPassword, newPassword) => {
  if (!user) {
    throw new ApiError(400, "Invalid user");
  }
  const password = await findPasswordUserById(user._id);
  const isMatch = await bcrypt.compare(currentPassword, password);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  const encryptedPassword = await encryptPassword(newPassword);

  const updatedUser = await updateUserById(user._id, {
    password: encryptedPassword,
  });

  if (!updatedUser) {
    throw new ApiError(404, `User with ID ${user._id} not found`);
  }

  return { updatedUser };
};

const getUserProfile = async (userId) => {
  return await findUserById(userId);
};

const updateProfile = async (userId, profileData) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, `User with ID ${userId} not found`);
  }

  const { firstName, lastName, email, phone, address } = profileData;
  if (email) {
    const existingUser = await getUserByCriteria({
      email,
      _id: { $ne: userId },
    });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new ApiError(`Email ${email} already exists`);
    }
    user.email = email;
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  return await updateUser(user);
};

const addChild = async (userId, childData) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existingChild = await findChildByNameAndBirthdate(
    childData.firstName,
    childData.lastName
  );
  if (existingChild) {
    throw new Error(
      `A child with the name "${
        childData.name && childData.lastName
      }" already exists.`
    );
  }

  const newChild = await createChild(childData);
  user.children.push(newChild._id);
  await updateUser(user);

  return user;
};

const getChildren = async (userId) => {
  return await findChildrenByUserId(userId);
};

const getChildById = async (userId, childId) => {
  const child = await findChildById(userId, childId);
  if (!child) {
    throw new Error(`Child with ID ${childId} not found`);
  }
  return child;
};

const getClassAndSkillInfoByChildId = async (childId) => {
  try {
    // Fetch child learning details using the service function
    const childDetails = await getChildLearingById(childId);
    console.log("childDetails", childDetails);

    if (!childDetails) {
      throw new ApiError(404, "Child not found");
    }

    // Check if the child has class and skill information with status ACTIVE
    const activeClassEntry =
      childDetails.class && childDetails.class.length > 0
        ? childDetails.class.find((entry) => entry.status === "ACTIVE")
        : null;
    const activeSkillEntry =
      childDetails.skill && childDetails.skill.length > 0
        ? childDetails.skill.find((entry) => entry.status === "ACTIVE")
        : null;

    if (!activeClassEntry && !activeSkillEntry) {
      throw new ApiError(
        400,
        "No ACTIVE class or skill information found for this child"
      );
    }
    // Fetch class and skill information from the academy service through user service
    const classInfo = activeClassEntry
      ? await RabbitMq_GetAcademyById("class", activeClassEntry.classId)
      : null;
    const skillInfo = activeSkillEntry
      ? await RabbitMq_GetAcademyById("skill", activeSkillEntry.skillId)
      : null;

    console.log("classInfo", classInfo);
    console.log("skillInfo", skillInfo);

    if (activeClassEntry && !classInfo) {
      throw new ApiError(400, "Invalid class information");
    }
    if (activeSkillEntry && !skillInfo) {
      throw new ApiError(400, "Invalid skill information");
    }

    // Fetch teacher information for class and skill if teacherId is present
    const classTeacher =
      classInfo && classInfo.teacherId
        ? await findUserById(classInfo.teacherId)
        : null;
    const skillTeacher =
      skillInfo && skillInfo.teacherId
        ? await findUserById(skillInfo.teacherId)
        : null;

    // Return structured information with teacher details included
    return {
      class: classInfo
        ? {
            _id: classInfo._id,
            name: classInfo.name,
            teacher: classTeacher,
            room: classInfo.room,
            startTime: classInfo.startTime,
            endTime: classInfo.endTime,
            status: classInfo.status,
          }
        : null,
      skill: skillInfo
        ? {
            _id: skillInfo._id,
            name: skillInfo.name,
            teacher: skillTeacher,
            room: classInfo.room,
            startTime: skillInfo.startTime,
            endTime: skillInfo.endTime,
            status: skillInfo.status,
          }
        : null,
    };
  } catch (error) {
    throw error;
  }
};
const handUpdateAcademyStatus = async (
  type,
  status,
  id,
  academyId,
  tuition,
  userId,
  childId
) => {
  let result;
  if (status !== "REJECT") {
    const dataAcademy = await RabbitMq_GetAcademyById(type, academyId);

    if (!dataAcademy) {
      throw new ApiError(400, "Invalidate academy");
    }
    if (type === "class") {
      result = await findAndUpdateClass(type, id, {
        ...{ status: status },
        ...{ new: true },
      });
    } else {
      result = await findAndUpdateClass(type, id, {
        ...{ status: status },
        ...{ new: true },
      });
    }
    const updateData = {
      availableSeats: dataAcademy.availableSeats - 1,
    };
    await RabbitMQ_UpdateAcademyById(type, academyId, updateData);
  } else {
    if (type === "class") {
      result = await findAndUpdateClass(type, id, {
        ...{ status: status },
        ...{ new: true },
      });
    } else {
      result = await findAndUpdateClass(type, id, {
        ...{ status: status },
        ...{ new: true },
      });
    }
  }
  const receiveUser = {
    _id: userId,
  };
  let content = "";
  if (type === "CLASS") {
    content = `Đăng kí lớp ${result.name} thành công!!!`;
  } else {
    content = `Đăng kí khoá học ${result.name} thành công!!!`;
  }

  await RabbitMQ_SocketNotifyUsers(receiveUser, content, {});
  return { result };
};
const updateChildren = async (userId, childId, childData) => {
  const child = await findChildById(userId, childId);

  if (!child) {
    throw new Error(`Child with ID ${childId} not found for the current user`);
  }

  console.log("Old child data:", child);

  const {
    firstName,
    lastName,
    dateOfBirth,
    avatar,
    birthCertificate,
    favourite,
  } = childData;

  if (firstName) child.firstName = firstName;
  if (lastName) child.lastName = lastName;
  if (dateOfBirth) child.dateOfBirth = dateOfBirth;
  if (avatar) child.avatar = avatar;
  if (birthCertificate) child.birthCertificate = birthCertificate;
  if (favourite) child.favourite = favourite;

  return await updateChild(child);
};
const handfindUsersWithRegisteredChildren = async (type, tab) => {
  let result;
  tab = tab ? parseInt(tab) : 1;
  let limit = 5;
  const skip = (tab - 1) * limit;
  if (type === "class") {
    result = await handGetChildRegisterClass();
  } else if (type === "skill") {
    result = await handGetChildRegisterSkill();
  } else {
    throw new ApiError(400, "Invalid 'type' specified in request body.");
  }
  const totalUsers = result.length;
  const totalPages = Math.ceil(totalUsers / limit);
  result = result.slice(skip, skip + limit);
  return { result, totalPages };
};
const showdoc = async (childId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    throw new ApiError(404, `Child with ID ${childId} not found`);
  }

  const userData = await handGetChildRegisterById(userId, childId); // Fetch user and child data
  if (!userData || !userData.children.length) {
    throw new ApiError(404, "Child not found");
  }

  const child = userData.children[0]; // Extract the child object

  let result = {
    _id: child._id,
    userId: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    address: userData.address,
    phone: userData.phone,
    children: child,
  };

  return { result };
};
const handReviewRegisteredFormChild = async (adnissionId) => {
  if (!mongoose.Types.ObjectId.isValid(adnissionId)) {
    throw new ApiError(
      404,
      `Adnission spplication with ID ${adnissionId} not found`
    );
  }
  const adnissionData = await handGetAdnissionApplicationById(adnissionId);
  if (!adnissionData) {
    throw new ApiError(404, `Not Found`);
  }
  const userData = await handGetChildRegisterById(
    adnissionData.userId,
    adnissionData.childId
  );
  if (!userData) {
    throw new ApiError(404, `Not Found`);
  }
  if (!adnissionData) {
    throw new ApiError(404, `Not Found`);
  }
  let result = {
    _id: adnissionData._id,
    userId: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    address: userData.address,
    phone: userData.phone,
    children: userData.children[0],
    startTime: adnissionData.startTime,
    createdAt: adnissionData.createdAt,
  };
  return { result };
};
const handResultRegisteredFormChild = async (
  adnissionId,
  status,
  noteByStaff
) => {
  if (!mongoose.Types.ObjectId.isValid(adnissionId)) {
    throw new ApiError(
      404,
      `Adnission spplication with ID ${adnissionId} not found`
    );
  }
  if (!status) {
    throw new ApiError(404, `Status not found`);
  }
  const adnissionData = await handUpdateAdnissionApplicationById(adnissionId, {
    status: status,
    noteByStaff: noteByStaff,
  });
  if (!adnissionData) {
    throw new ApiError(404, `Not Found`);
  }
  const userData = await findUserById(adnissionData.userId);
  if (!userData) {
    throw new ApiError(404, `Not Found`);
  }
  const child = await findChildById(
    adnissionData.userId.toString(),
    adnissionData.childId.toString()
  );
  let result = {};
  if (status === "ACCEPT") {
    const newClass = await createClass();
    if (child?.eatFees && child?.eatFees.length <= 0) {
      const newEatFees = await createEatFees();
      child.eatFees.push(newEatFees._id);
    }
    child.class.push(newClass._id);
    const newChild = await updateChild(child);
    result = {
      _id: adnissionData._id,
      userId: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      phone: userData.phone,
      children: newChild,
      startTime: adnissionData.startTime,
      createdAt: adnissionData.createdAt,
    };
  }

  let content = "";
  let context = "";
  let note = "";
  let title = "";
  if (status === "ACCEPT") {
    content = `Đơn đã được xác nhận!!!`;
    title = `được Xác Nhận`;
    context = ` và đang trong trạng thái chờ xếp lớp học cho trẻ`;
  } else {
    content = `Đơn đã bị từ chối!!!`;
    title = `bị Từ Chối `;
    context = `đơn nhập học cho trẻ`;
  }
  const receiveUser = {
    _id: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatar: "",
  };
  const sender = {};
  await RabbitMQ_SocketNotifyUsers(receiveUser, content, sender);
  const payload = {
    code: "00",
    data: {
      admissionId: adnissionId,
      userId: userData._id,
      registerForSchoolCode: "registerSchool-123",
    },
  };
  await RabbitMQ_SocketRegisterForSchool(payload);
  const userObj = userData.toObject();
  delete userObj.password;
  if (noteByStaff) {
    if (status === "ACTIVE") {
      note = "*Lưu ý: " + noteByStaff;
    } else {
      note = "*Lý do: " + noteByStaff;
    }
  }
  if (userData.email) {
    await RabbitMQ_notifyReceiver(
      userObj._id,
      userData.email,
      send_Notification_Mail_Register_School_For_Child(
        userData.firstName,
        userData.lastName,
        title,
        context,
        child.firstName,
        child.lastName,
        config.CLIENT_URL,
        note
      ),
      "Email sender",
      "Kindergarten.com"
    );
  }
  return { result };
};
const getAdmissionApplicationByChildId = async (childId) => {
  return await findAppByChildId(childId);
};

const saveUserAvatar = async (userId, avatarFileName) => {
  try {
    const updatedUser = await updateUserAvatar(userId, avatarFileName);
    return await updatedUser;
  } catch (error) {
    throw new Error("Error saving user avatar");
  }
};

const getAvatarFileName = async (userId) => {
  try {
    const avatarFileName = await getUserAvatar(userId);
    return await avatarFileName;
  } catch (error) {
    throw new Error("Error getting avatar file name");
  }
};

const saveChildAvatar = async (userId, childId, avatarFileName) => {
  try {
    const updatedChild = await updateChildAvatar(
      userId,
      childId,
      avatarFileName
    );
    return updatedChild;
  } catch (error) {
    throw new Error("Error saving child avatar");
  }
};

const getChildAvatarUrl = async (userId, childId) => {
  try {
    const avatarFileName = await getChildAvatar(userId, childId);
    return await avatarFileName;
  } catch (error) {
    throw new Error("Error getting avatar file name");
  }
};
const handChildAcademy = async (type, academyId) => {
  const dataAcademy = await RabbitMq_GetAcademyById(type, academyId);
  let conditionChild = {};
  if (!dataAcademy) {
    throw new ApiError(400, "Invalidate academy");
  }
  if (!mongoose.Types.ObjectId.isValid(dataAcademy._id)) {
    throw new Error("Invalid classId");
  }
  let classes = {};
  if (type === "class") {
    classes = await findClass(
      type,
      { classId: dataAcademy._id, status: "ACTIVE" },
      "_id"
    );
    conditionChild = { class: { $in: classes } };
  } else {
    classes = await findClass(
      type,
      { skillId: dataAcademy._id, status: "ACTIVE" },
      "_id"
    );
    conditionChild = { skill: { $in: classes } };
  }
  const classIds = classes.map((classObj) => classObj._id);
  const children = await findChildByCondition(
    conditionChild,
    "_id firstName lastName dateOfBirth avatar docs class",
    "",
    "",
    "",
    {
      path: "class",
      match: { _id: { $in: classIds } },
      select: "_id classId status",
    }
  );
  const result = {
    _id: dataAcademy._id,
    name: dataAcademy.name,
    teacherId: dataAcademy.teacherId,
    totalSeats: dataAcademy.totalSeats,
    availableSeats: dataAcademy.availableSeats,
    startTime: dataAcademy.startTime,
    endTime: dataAcademy.endTime,
    tuition: dataAcademy.tuition,
    condition: dataAcademy.condition,
    status: dataAcademy.status,
    room: dataAcademy.room,
    children: children,
  };
  if (type == "skill") {
    result.category = dataAcademy.category;
  }
  return { result };
};
const handChildWait = async (type, academyId, tab, limit) => {
  const dataAcademy = await RabbitMq_GetAcademyById(type, academyId);
  if (!dataAcademy) {
    throw new ApiError(400, "Invalidate academy");
  }
  if (!mongoose.Types.ObjectId.isValid(dataAcademy._id)) {
    throw new Error("Invalid classId");
  }
  tab = tab ? parseInt(tab) : 1;
  limit = limit ? parseInt(limit) : 5;
  const skip = (tab - 1) * limit;
  const classes = await findClass(type, { status: "ACCEPT" }, "_id");
  const children = await findChildByCondition(
    { class: { $in: classes } },
    "_id firstName lastName dateOfBirth avatar docs",
    skip,
    limit,
    { dateOfBirth: -1 }
  );
  const totalChild = await countChild({ class: { $in: classes } });
  const totalPages = Math.ceil(totalChild / limit);
  const enrichedChildren = await Promise.all(
    children.map(async (child) => {
      const application = await findAdnissionApplication(
        { childId: child._id },
        "noteByStaff"
      );
      return {
        _id: child._id,
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: child.dateOfBirth,
        avatar: child.avatar,
        docs: child.docs,
        noteByStaff: application.length > 0 ? application[0].noteByStaff : "",
      };
    })
  );

  const result = {
    _id: dataAcademy._id,
    name: dataAcademy.name,
    teacherId: dataAcademy.teacherId,
    totalSeats: dataAcademy.totalSeats,
    availableSeats: dataAcademy.availableSeats,
    startTime: dataAcademy.startTime,
    endTime: dataAcademy.endTime,
    tuition: dataAcademy.tuition,
    condition: dataAcademy.condition,
    status: dataAcademy.status,
    children: enrichedChildren,
  };
  return { result, totalPages };
};
const handSearchChildWait = async (
  type,
  academyId,
  condition,
  filter,
  tab,
  limit
) => {
  const dataAcademy = await RabbitMq_GetAcademyById(type, academyId);
  if (!dataAcademy) {
    throw new ApiError(400, "Invalidate academy");
  }
  if (!mongoose.Types.ObjectId.isValid(dataAcademy._id)) {
    throw new Error("Invalid classId");
  }
  tab = tab ? parseInt(tab) : 1;
  limit = limit ? parseInt(limit) : 5;
  const skip = (tab - 1) * limit;
  let searchCondition = {};
  if (filter && filter !== "all") {
    const age = parseInt(filter, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();
    const currentMilliseconds = currentDate.getMilliseconds();
    const startDate = new Date(
      Date.UTC(
        currentYear - age - 1,
        currentMonth,
        currentDay,
        currentHours,
        currentMinutes,
        currentSeconds,
        currentMilliseconds
      )
    );
    const endDate = new Date(
      Date.UTC(currentYear - age, currentMonth, currentDay, 23, 59, 59, 999)
    );
    searchCondition.dateOfBirth = {
      $gte: startDate,
      $lt: endDate,
    };
  }
  if (condition) {
    const searchRegex = new RegExp(`${condition}`, "i");
    searchCondition.$and = [
      ...(searchCondition.dateOfBirth
        ? [{ dateOfBirth: searchCondition.dateOfBirth }]
        : []),
      {
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
      },
    ];
  }
  const classes = await findClass(type, { status: "ACCEPT" }, "_id");
  const children = await findChildByCondition(
    { class: { $in: classes }, ...searchCondition },
    "_id firstName lastName dateOfBirth avatar docs",
    skip,
    limit,
    { dateOfBirth: -1 }
  );
  const totalChild = await countChild({
    class: { $in: classes },
    ...searchCondition,
  });
  const totalPages = Math.ceil(totalChild / limit);
  const enrichedChildren = await Promise.all(
    children.map(async (child) => {
      const application = await findAdnissionApplication(
        { childId: child._id },
        "noteByStaff"
      );

      return {
        _id: child._id,
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: child.dateOfBirth,
        avatar: child.avatar,
        docs: child.docs,
        noteByStaff: application.length > 0 ? application[0].noteByStaff : "",
      };
    })
  );

  const result = {
    _id: dataAcademy._id,
    name: dataAcademy.name,
    teacherId: dataAcademy.teacherId,
    totalSeats: dataAcademy.totalSeats,
    availableSeats: dataAcademy.availableSeats,
    startTime: dataAcademy.startTime,
    endTime: dataAcademy.endTime,
    tuition: dataAcademy.tuition,
    condition: dataAcademy.condition,
    status: dataAcademy.status,
    children: enrichedChildren,
  };

  return { result, totalPages };
};
const handleUpdateAdmissionDocument = async ({
  documentId,
  title,
  description,
  img,
}) => {
  if (!documentId) {
    throw new ApiError(400, "Document ID is required");
  }
  const admissionDocument = await findAdmissionDocumentById(documentId);

  if (!admissionDocument) {
    throw new ApiError(
      404,
      `No admission document found with ID: ${documentId}`
    );
  }

  // Cập nhật thông tin tài liệu
  admissionDocument.title = title || admissionDocument.title;
  admissionDocument.description = description || admissionDocument.description;
  admissionDocument.img = img || admissionDocument.img;
  admissionDocument.status = "ACTIVE";

  // Lưu thay đổi
  return await saveAdmissionDocument(admissionDocument);
};
const handleArrangeChild = async (type, academyId, data) => {
  const resList = [];
  if (!academyId || data.length === 0) {
    throw new ApiError(404, "Not found");
  }
  const dataAcademy = await RabbitMq_GetAcademyById(type, academyId);
  if (!dataAcademy) {
    throw new ApiError(404, "Not found");
  }

  for (let index = 0; index < data.length; index++) {
    var childId = data[index];
    const child = await findChildByPopulateClass(childId, { status: "ACCEPT" });
    if (!child) {
      console.log(`Child with ID ${childId} not found.`);
      continue;
    }
    const user = await findUserByChildId(
      childId,
      "_id firstName lastName email",
      "_id firstName lastName"
    );
    const classToUpdate = child.class[0];
    if (classToUpdate) {
      classToUpdate.classId = dataAcademy._id;
      classToUpdate.status = "ACTIVE";
      await findAndUpdateClass(type, classToUpdate._id, {
        classId: dataAcademy._id,
        status: "ACTIVE",
        name: dataAcademy.name,
      });
      const updateData = {
        availableSeats: --dataAcademy.availableSeats,
      };
      await RabbitMQ_UpdateAcademyById(type, academyId, updateData);
      const content = `${child.firstName} ${child.lastName} đã được xếp lớp!!!`;
      const title = " Xếp lớp";
      const context = ` nhập học cho trẻ`;
      const receiveUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: "",
      };
      const userObj = user.toObject();
      delete userObj.password;
      const sender = {};
      await RabbitMQ_SocketNotifyUsers(receiveUser, content, sender);
      if (user.email) {
        await RabbitMQ_notifyReceiver(
          userObj._id,
          user.email,
          send_Notification_Mail_Register_School_For_Child(
            user.firstName,
            user.lastName,
            title,
            context,
            child.firstName,
            child.lastName,
            config.CLIENT_URL,
            ""
          ),
          "Email sender",
          "Kindergarten.com"
        );
      }
      resList.push({
        childId: childId,
        updatedClassId: classToUpdate._id,
        status: "ACTIVE",
        user: user,
        class: dataAcademy,
      });
    } else {
      throw new ApiError(
        404,
        `No WAIT status class found for child with ID ${childId}`
      );
    }
  }
  return { resList };
};
const handleChangeClassChild = async (
  type,
  childId,
  oldAcademyId,
  newAcademyId
) => {
  if (!type || !oldAcademyId || !newAcademyId || !childId) {
    throw new ApiError(404, "Not Found");
  }
  const oldAcademy = await RabbitMq_GetAcademyById(type, oldAcademyId);
  const newAcademy = await RabbitMq_GetAcademyById(type, newAcademyId);
  const user = await findUserByChildId(
    childId,
    "_id firstName lastName email",
    "_id firstName lastName"
  );
  if (!oldAcademy || !newAcademy) {
    throw new ApiError(400, "Invalidate academy");
  }
  let condition = {};
  if (type == "class") {
    condition = {
      path: "class",
      match: {
        $or: [{ classId: oldAcademy._id }, { classId: newAcademy._id }],
      },
      select: "_id classId status",
    };
  } else {
    condition = {
      path: "skill",
      match: {
        $or: [{ skillId: oldAcademy._id }, { skillId: newAcademy._id }],
      },
      select: "_id skillId status",
    };
  }

  const children = await findOneChildByCondition(
    { _id: childId },
    "_id firstName lastName dateOfBirth avatar docs class skill",
    condition
  );
  let oldClass = [];

  if (type === "class") {
    oldClass = children.class.find(
      (cls) => cls.classId.toString() === oldAcademy._id.toString()
    );
  } else {
    oldClass = children.skill.find(
      (cls) => cls.skillId.toString() === oldAcademy._id.toString()
    );
  }

  if (oldClass) {
    await findAndUpdateClass(type, oldClass._id, {
      status: "CANCEL",
    });
  }
  let existingClass = [];

  if (type === "class") {
    existingClass = children.class.findIndex(
      (cls) => cls.classId.toString() === newAcademy._id.toString()
    );
  } else {
    existingClass = children.skill.findIndex(
      (cls) => cls.skillId.toString() === newAcademy._id.toString()
    );
  }
  if (existingClass !== -1) {
    if (type === "class") {
      await findAndUpdateClass(
        type,
        { _id: children.class[existingClass]._id },
        { status: "ACTIVE", name: newAcademy.name }
      );
    } else {
      await findAndUpdateClass(
        type,
        { _id: children.skill[existingClass]._id },
        { status: "ACTIVE", name: newAcademy.name }
      );
    }
  } else {
    let dataNewClass = {};
    let newClass = {};

    if (type === "class") {
      dataNewClass = {
        classId: newAcademy._id,
        name: newAcademy.name,
        status: "ACTIVE",
      };
      newClass = await createClass(dataNewClass);
      children.class.push(newClass._id);
    } else {
      dataNewClass = {
        skillId: newAcademy._id,
        name: newAcademy.name,
        status: "ACTIVE",
      };
      newClass = await createSkill(dataNewClass);
      children.skill.push(newClass._id);
    }
  }
  await updateChild(children);
  const updateData = {
    availableSeats: newAcademy.availableSeats - 1,
  };
  await RabbitMQ_UpdateAcademyById(type, newAcademy._id, updateData);
  await RabbitMQ_UpdateAcademyById(type, oldAcademy._id, {
    availableSeats: oldAcademy.availableSeats + 1,
  });

  const content = `${children.firstName} ${children.lastName} đã được chuyển lớp!!!`;
  const title = " Chuyển lớp";
  const context = ` học cho trẻ`;
  const receiveUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: "",
  };
  const userObj = user.toObject();
  delete userObj.password;
  const sender = {};
  await RabbitMQ_SocketNotifyUsers(receiveUser, content, sender);

  if (user.email) {
    await RabbitMQ_notifyReceiver(
      userObj._id,
      user.email,
      send_Notification_Mail_Register_School_For_Child(
        user.firstName,
        user.lastName,
        title,
        context,
        children.firstName,
        children.lastName,
        config.CLIENT_URL,
        ""
      ),
      "Email sender",
      "Kindergarten.com"
    );
  }
  const result = {
    _id: newAcademy._id,
    name: newAcademy.name,
    teacherId: newAcademy.teacherId,
    totalSeats: newAcademy.totalSeats,
    availableSeats: newAcademy.availableSeats,
    startTime: newAcademy.startTime,
    endTime: newAcademy.endTime,
    tuition: newAcademy.tuition,
    condition: newAcademy.condition,
    status: newAcademy.status,
  };
  return { result };
};
const handleGetRegisterByChildId = async (childId) => {
  if (!childId) {
    throw new ApiError(400, "Child ID is required");
  }

  const admissionApplication = await findAppByChildId(childId);

  if (!admissionApplication) {
    throw new ApiError(404, "Admission application not found");
  }

  return admissionApplication;
};
export const getAllTransportationApplications = async () => {
  const applications = await handGetAllTransportationApplications();

  // Format the data as needed
  const formattedData = applications.map((app) => ({
    _id: app._id,
    userId: app.userId._id,
    userFirstName: app.userId.firstName,
    userLastName: app.userId.lastName,
    childId: app.childId._id,
    childFirstName: app.childId.firstName,
    childLastName: app.childId.lastName,
    startTime: app.startTime,
    status: app.status,
    createdAt: app.createdAt,
    address: app.address,
  }));

  return { data: formattedData };
};
const handleUpdateAdmissionApplication = async (childId, status) => {
  if (!childId) {
    throw new ApiError(400, "Child ID is required");
  }
  const StatusForm = {
    REGISTER: "REGISTER",
    ACCEPT: "ACCEPT",
    CANCEL: "CANCEL",
    REJECT: "REJECT",
  };
  const admissionApplication = await findAppByChildId(childId);

  if (!admissionApplication) {
    throw new ApiError(404, "Admission application not found");
  }
  admissionApplication.startTime = new Date().getFullYear();
  admissionApplication.status = status || StatusForm.ACCEPT;
  const updatedApplication = await saveAdmissionApplication(
    admissionApplication
  );
  const payload = {
    code: "00",
    data: {
      admissionId: updatedApplication._id,
      userId: updatedApplication.userId,
      registerForSchoolCode: "registerSchool-123",
    },
  };
  await RabbitMQ_SocketRegisterForSchool(payload);

  return { updatedApplication };
};
const handleUpdateTransportation = async (id, updateData) => {
  try {
    const updatedTransportationApplication = await updateTransportation(
      id,
      updateData
    );
    if (updateData.status == "ACCEPT") {
      const creatTransportation = await createTransportation();
      await createTransportationForChildDA(
        updateData.childId,
        creatTransportation._id
      );
    }
    const payload = {
      code: "00",
      data: {
        admissionId: id,
        userId: updateData.userId,
        registerForTransportCode: "registerTransport-123",
      },
    };
    await RabbitMQ_SocketRegisterForTransport(payload);
    return updatedTransportationApplication;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const handleCreateTransportationApplication = async ({
  userId,
  childId,
  address,
  startTime,
}) => {
  if (!userId || !childId || !address || !startTime) {
    throw new ApiError(
      400,
      "userId, childId, address, and startTime are required"
    );
  }

  const transportData = { userId, childId, address, startTime };
  const transportationApplication = await createTransportationApplication(
    transportData
  );
  const payload = {
    code: "00",
    data: {
      admissionId: transportationApplication._id,
      userId: userId,
      registerForTransportCode: "registerTransport-123",
    },
  };
  await RabbitMQ_SocketRegisterForTransport(payload);
  return transportationApplication;
};

export const handleCreateAdmissionDocument = async ({
  title,
  description,
  img,
  status,
  childId,
}) => {
  // Validate required fields
  if (!childId) {
    throw new ApiError(400, "Child ID is required");
  }

  // Prepare data for creating the admission document
  const documentData = {
    title,
    description: description || "",
    img: img || null,
    status: status || "ACTIVE",
    child: childId,
  };

  // Create the admission document
  const admissionDocument = await createAdmissionDocument(documentData);

  // Link the document to the child
  await linkDocumentToChild(childId, admissionDocument._id);

  return admissionDocument;
};
const getAllTransport = async () => {
  try {
    const applications = await getAllApplications();
    if (applications.length === 0) {
      throw new ApiError(404, "No applications found");
    }

    return applications;
  } catch (error) {
    console.error("Error in transportationService:", error);
    throw error;
  }
};
const handleCreateAdmissionApplication = async ({ userId, childId }) => {
  const applicationData = {
    userId,
    childId,
    startTime: new Date().getFullYear(),
    status: "REGISTER",
  };
  const admissionApplication = await createAdmissionApplication(
    applicationData
  );
  const payload = {
    code: "00",
    data: {
      admissionId: admissionApplication._id,
      userId: userId,
      registerForSchoolCode: "registerSchool-123",
    },
  };
  await RabbitMQ_SocketRegisterForSchool(payload);
  return { admissionApplication };
};
const handleGetChildDetailByParentIdAndChildId = async (parentId, childId) => {
  const childInfor = await getChildInforByParentIdAndChildId(parentId, childId);
  return childInfor;
};
const getAllFeedbacks = async () => {
  try {
    const feedbacks = await findAllFeedback();
    return feedbacks;
  } catch (error) {
    throw new ApiError(404, "Error in getting feedbacks: " + error.message);
  }
};
const handViewRegisteredFormChild = async (id) => {
  try {
    if (!id) {
      throw new ApiError(404, "Invalid ID format");
    }

    const admissionData = await handGetApplicationById(id);
    if (!admissionData) {
      throw new ApiError(404, `Admission application with ID ${id} not found`);
    }

    const userData = await handGetChildRegisterById(
      admissionData.userId,
      admissionData.childId
    );
    if (!userData) {
      throw new ApiError(404, "User or child data not found");
    }

    const result = {
      _id: admissionData._id,
      userId: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      phone: userData.phone,
      children: userData.children?.[0] || null,
      startTime: admissionData.startTime,
      createdAt: admissionData.createdAt,
    };

    return result;
  } catch (error) {
    throw error;
  }
};
const createFeedbacks = async ({ content, rate, teacherId, userId }) => {
  if (!content || !rate || !teacherId) {
    throw new ApiError(404, "Missing required fields");
  }

  const StatusFeedback = {
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
  };
  const feedbackData = {
    content,
    rate,
    teacherId,
    userId,
    status: StatusFeedback.ACTIVE,
  };

  return await createFeedback(feedbackData);
};


const getChildrenTransportDetail = async (childId) => {
    const result =
        await getChildTransportDetailByParentIdAndChildId(childId);
    if (!result) {
        throw new ApiError(404, "No child data found");
    }
    if (result?.transportation.length <= 0) {
        throw new ApiError(404, "Child no have transportation.");
    }
    const transportationId = result.transportation[0].transportationId;
    const transportDetail = await getTransportationDetailDriverById(transportationId);

    if (!transportDetail) {
        throw new ApiError(404, "No transportation detail found");
    }
    let childObject;
    childObject = result.toObject();
    childObject.transportDetail = transportDetail;
    return childObject;
};

export default {
    getAllTransport,
    updateProfile,
    getUserProfile,
    addChild,
    getChildren,
    getChildById,
    getClassAndSkillInfoByChildId,
    updateChildren,
    handleUpdateUserById,
    handleLockUserById,
    handleUpdatePassword,
    handleFillterUser,
    handleSearchUser,
    handleChangePassword,
    handfindUsersWithRegisteredChildren,
    handUpdateAcademyStatus,
    handReviewRegisteredFormChild,
    handResultRegisteredFormChild,
    showdoc,
    getAdmissionApplicationByChildId,
    saveUserAvatar,
    getAvatarFileName,
    saveChildAvatar,
    getChildAvatarUrl,
    handChildAcademy,
    handChildWait,
    handSearchChildWait,
    handleArrangeChild,
    handleChangeClassChild,
    getAllTransportationApplications,
    handleCreateTransportationApplication,
    handleCreateAdmissionDocument,
    handleUpdateAdmissionDocument,
    handleGetRegisterByChildId,
    handleUpdateAdmissionApplication,
    handleUpdateTransportation,
    handleCreateAdmissionApplication,
    handleGetChildDetailByParentIdAndChildId,
    getAllFeedbacks,
    handViewRegisteredFormChild,
    createFeedbacks,
    getChildrenTransportDetail,
};
