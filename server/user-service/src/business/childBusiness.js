import mongoose from "mongoose";
import {
  findChildrenByClassId,
  findChildrenBySkill,
  findClassById,
  findOneChildByCondition,
  findSkillById,
  createHealthlogForChild,
  getHealthLogsByChildId,
} from "../data-access/childDA.js";
import {
  findAttendanceTransportation,
  findTransportation,
  findTransportationlication,
  getTransportationService,
  getTransportationServiceById,
} from "../data-access/transportationDA.js";
import {
  findAttendanceClass,
  findAttendanceClassAndUpdate,
  findClass,
  findOneAttendanceClass,
  saveAttend,
  GetCountChildAttendenceAtMonth,
  getAttendanceByChildId,
} from "../data-access/classDA.js";
import {
  convertUtcToVietnamTime,
  formatDateTime,
  getCurrentDate,
} from "../utils/date.js";
import { ApiError } from "../utils/index.js";
import { AttendanceClass } from "../database/index.js";
import { findUserByChildId } from "../data-access/userDA.js";
import { send_Notification_Mail_Register_School_For_Child } from "../utils/templateRegisterSchool.js";
import config from "../config/config.js";
import { send_Notification_Mail_Attendance_For_Child } from "../utils/templateAttendance.js";
import { RabbitMQ_SocketNotifyUsers } from "../services/RabbitMQService/send/socketNotifyUsers.js";
import { RabbitMQ_notifyReceiver } from "../services/RabbitMQService/send/mail.js";
import { RabbitMQ_SocketAttendance } from "../services/RabbitMQService/send/SocketAttendance.js";


const createHealthlog = async (height, weight, note, childId, noteBy) => {
  try {
    if (!height || !weight) {
      throw new ApiError(400,"Height and weight are required.");
    }

    const healthLogData = {
      height,
      weight,
      note,
      childId,
      noteBy,
      status: "ACTIVE",
    };

    return await createHealthlogForChild(healthLogData);
  } catch (error) {
    throw new ApiError(505,`Business Logic Error: ${error.message}`);
  }
};

const getDevelopmentByChildId = async (childId) => {
  try {
    const healthLogs = await getHealthLogsByChildId(childId);
    return healthLogs;
  } catch (error) {
    throw new ApiError(505,`Lỗi trong quá trình lấy dữ liệu: ${error.message}`);
  }
};


const fetchChildrenByClassId = async (
  classId,
  attendDay,
  attendMonth,
  attendYear
) => {
  try {
    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
      return {
        status: 400,
        message: "ClassId is required or invalid",
        data: [],
      };
    }

    const classObjectId = new mongoose.Types.ObjectId(classId);
    const classDetails = await findClass(
      "class",
      { classId: classObjectId, status: "ACTIVE" },
      "_id name"
    );
    if (!classDetails) {
      return {
        status: 200,
        message: "No children found in class",
        data: [],
      };
    }
    const classIds = classDetails.map((classItem) => classItem._id);
    const children = await findChildrenByClassId(classIds);
    if (children.length === 0) {
      return {
        status: 200,
        message: "No children found in class",
        data: [],
      };
    }
    const childIds = children.map((childrenItem) => childrenItem._id);
    const currentDate = new Date();
    const attendanceCondition = {
      classId: classObjectId,
      childId: { $in: childIds },
      attendDay: attendDay || currentDate.getDate(),
      attendMonth: attendMonth || currentDate.getMonth() + 1,
      attendYear: attendYear || currentDate.getFullYear(),
    };
    const attendanceTransportCondition = {
      childId: { $in: childIds },
      attendDay: attendDay || currentDate.getDate(),
      attendMonth: attendMonth || currentDate.getMonth() + 1,
      attendYear: attendYear || currentDate.getFullYear(),
    };
    const [
      attendanceRecords,
      applicationTransport,
      attendanceTransportRecords,
      transportationChild,
    ] = await Promise.all([
      findAttendanceClass(
        attendanceCondition,
        "_id childId isCheckIn isCheckOut receiver receiverUrl"
      ),
      findTransportationlication(
        { childId: { $in: childIds }, status: "ACCEPT" },
        "_id childId"
      ),
      findAttendanceTransportation(
        attendanceTransportCondition,
        "_id childId isCheckIn isCheckOut transportId type isUse receiverUrl"
      ),
      findTransportation(
        {
          _id: {
            $in: children.map((child) => child.transportation).flat(),
          },
          status: "ACTIVE",
        },
        "_id transportationId"
      ),
    ]);
    const transportIds = transportationChild
      .filter((record) => record.transportationId)
      .map((record) => record.transportationId);

    const transportationDetails = await getTransportationService(
      { _id: { $in: transportIds } },
      undefined,
      undefined,
      "_id name driverId",
      undefined
    );
    const childrenWithAttendance = children.map((child) => {
      const attendance = attendanceRecords.find(
        (record) => record.childId.toString() === child._id.toString()
      );

      const firstAttendance = attendanceTransportRecords.find(
        (record) =>
          record.childId.toString() === child._id.toString() &&
          record.type === "FIRST"
      );
      const secondAttendance = attendanceTransportRecords.find(
        (record) =>
          record.childId.toString() === child._id.toString() &&
          record.type === "SECOND"
      );
      const isInApplicationTransport = applicationTransport.some(
        (transport) => transport.childId.toString() === child._id.toString()
      );
      const transportationInfo = transportationChild
        .filter((transportRecord) =>
          child.transportation.some((transportId) =>
            transportRecord._id.equals(transportId)
          )
        )
        .map((transportRecord) => {
          const transportDetail = transportationDetails.find((transport) =>
            transport._id.equals(transportRecord.transportationId)
          );
          return transportDetail
            ? {
                _id: transportDetail._id,
                name: transportDetail.name,
                driverId: transportDetail.driverId,
              }
            : null;
        });
      const attendanceData = isInApplicationTransport
        ? {
            first: firstAttendance
              ? {
                  _id: firstAttendance._id,
                  isCheckIn: firstAttendance.isCheckIn,
                  isCheckOut: firstAttendance.isCheckOut,
                  type: firstAttendance.type,
                  isUse: firstAttendance.isUse,
                }
              : {
                  _id: null,
                  isCheckIn: false,
                  isCheckOut: false,
                  type: "FIRST",
                  isUse: "",
                },
            second: secondAttendance
              ? {
                  _id: secondAttendance._id,
                  isCheckIn: secondAttendance.isCheckIn,
                  isCheckOut: secondAttendance.isCheckOut,
                  type: secondAttendance.type,
                  isUse: secondAttendance.isUse,
                  receiverUrl: secondAttendance.receiverUrl,
                }
              : {
                  _id: null,
                  isCheckIn: false,
                  isCheckOut: false,
                  type: "SECOND",
                  isUse: "",
                  receiverUrl: null,
                },
          }
        : {};
      const childObj = child.toObject();
      delete childObj.transportation;
      return {
        ...childObj,
        transportDetail: transportationInfo.length
          ? transportationInfo[0]
          : null,
        attendance: {
          ...attendanceData,
          class: attendance
            ? {
                _id: attendance._id,
                isCheckIn: attendance.isCheckIn,
                isCheckOut: attendance.isCheckOut,
                receiver: attendance.receiver,
                receiverUrl: attendance.receiverUrl,
              }
            : {
                _id: null,
                isCheckIn: false,
                isCheckOut: false,
                receiver: "",
                receiverUrl: "",
              },
        },
      };
    });
    return {
      status: 200,
      message: "Children fetched successfully!",
      data: childrenWithAttendance,
    };
  } catch (error) {
    console.error("Error fetching children:", error);
    return {
      status: 500,
      message: "Internal server error",
      data: [],
    };
  }
};

const getChildrenBySkillId = async (skillId) => {
  try {
    if (!skillId || !mongoose.Types.ObjectId.isValid(skillId)) {
      return {
        status: 400,
        message: "skillId is required or invalid.",
        data: [],
      };
    }

    const skillObjectId = new mongoose.Types.ObjectId(skillId);
    const skillDetails = await findSkillById(skillObjectId);
    if (!skillDetails) {
      return {
        status: 200,
        message: "No skill found with this ID.",
        data: [],
      };
    }
    const skillIds = skillDetails.map((skillItem) => skillItem._id);
    const children = await findChildrenBySkill(skillIds);
    if (children.length === 0) {
      return {
        status: 200,
        message: "No children found with this skill.",
        data: [],
      };
    }
    return {
      status: 200,
      message: "Children fetched successfully!",
      data: children,
    };
  } catch (error) {
    console.error("Error fetching children by skill:", error);
    return {
      status: 500,
      message: "Internal server error",
      data: [],
    };
  }
};
const handleCheckInChild = async (
  teacherId,
  classId,
  childrenId,
  isCheckIn,
  receiver
) => {
  if (
    !teacherId ||
    !classId ||
    !childrenId ||
    isCheckIn === null ||
    isCheckIn === undefined
  ) {
    throw new ApiError(404, "Not Found");
  }
  const currentDate = new Date();
  const vietnamDate = convertUtcToVietnamTime(currentDate);
  let query = {
    teacherId: teacherId,
    classId: classId,
    childId: childrenId,
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
  };
  const data = {
    teacherId: teacherId,
    classId: classId,
    childId: childrenId,
    receiver: receiver,
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
    isCheckIn: isCheckIn,
    createdCheckInAt: vietnamDate.formattedDate,
  };
  let result = {};
  const existsAttend = await findOneAttendanceClass(
    query,
    "_id teacherId classId childId "
  );
  if (existsAttend) {
    result = await findAttendanceClassAndUpdate(
      { _id: existsAttend._id },
      data,
      "_id teacherId classId childId "
    );
  } else {
    const attendanceRecord = new AttendanceClass(data);
    result = await saveAttend(attendanceRecord);
  }
  const children = await findOneChildByCondition(
    { _id: childrenId },
    "_id firstName lastName"
  );
  const user = await findUserByChildId(
    children._id,
    "_id firstName lastName email phone address",
    "_id firstName lastName"
  );
  const notifDateTime = convertUtcToVietnamTime(currentDate);
  let content = "";
  let context = "";
  let note = "";
  let title = "";
  const payload = {
    code: "00",
    data: {
      childId: childrenId,
      attendanceCode: "attendanceTransport-123",
    },
  };
  if (isCheckIn === true) {
    content = `Trẻ đã vào lớp`;
    title = `Giáo viên đã nhận trẻ lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
    context = ` và đang dẫn vào lớp cho trẻ`;
  } else {
    content = `Hủy trẻ vào lớp`;
    title = `Giáo viên đã hủy nhận trẻ lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
    context = ` và đang đợi nhận trẻ`;
  }
  const receiveUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: "",
  };
  const sender = {};
  await RabbitMQ_SocketNotifyUsers(receiveUser, content, sender);
  await RabbitMQ_SocketAttendance(payload);
  const userObj = user.toObject();
  delete userObj.password;
  if (user.email) {
    await RabbitMQ_notifyReceiver(
      userObj._id,
      user.email,
      send_Notification_Mail_Attendance_For_Child(
        user.firstName,
        user.lastName,
        title,
        context,
        children.firstName,
        children.lastName,
        config.CLIENT_URL,
        note,
        ""
      ),
      "Email sender",
      "Kindergarten.com"
    );
  }

  return { result };
};
const handleCheckOutChild = async (
  teacherId,
  classId,
  childrenId,
  isCheckOut,
  receiver,
  receiverUrl
) => {
  if (
    !teacherId ||
    !classId ||
    !childrenId ||
    isCheckOut === null ||
    isCheckOut === undefined
  ) {
    throw new ApiError(404, "Not Found");
  }
  const currentDate = new Date();
  const vietnamDate = convertUtcToVietnamTime(currentDate);
  let query = {
    teacherId: teacherId,
    classId: classId,
    childId: childrenId,
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
  };
  const data = {
    teacherId: teacherId,
    classId: classId,
    childId: childrenId,
    receiver: receiver,
    receiverUrl: receiverUrl ? receiverUrl : "",
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
    isCheckOut: isCheckOut,
    createdCheckOutAt: vietnamDate.formattedDate,
  };
  const existsAttend = await findOneAttendanceClass(
    query,
    "_id teacherId classId childId "
  );
  if (!existsAttend) {
    throw new ApiError(404, "Not Found");
  }
  const result = await findAttendanceClassAndUpdate(
    { _id: existsAttend._id },
    data,
    "_id teacherId classId childId "
  );
  const children = await findOneChildByCondition(
    { _id: childrenId },
    "_id firstName lastName"
  );
  const user = await findUserByChildId(
    children._id,
    "_id firstName lastName email phone address",
    "_id firstName lastName"
  );
  const notifDateTime = convertUtcToVietnamTime(currentDate);
  let content = "";
  let context = "";
  let note = "";
  let title = "";
  let linkImg = "";
  const payload = {
    code: "00",
    data: {
      childId: childrenId,
      attendanceCode: "attendanceTransport-123",
    },
  };
  if (isCheckOut === true) {
    if (receiver === "DRIVER") {
      content = `Đã trả trẻ`;
      title = `Giáo viên đã trả trẻ vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` và tài xế đã đón trẻ`;
      note = "Đã cho trẻ cho tài xế: ";
      linkImg = receiverUrl;
    } else if (receiver === "USER") {
      content = `Đã trả trẻ`;
      title = `Giáo viên đã trả trẻ cho phụ huynh vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` cho trẻ`;
      note = "Đã cho trẻ cho phụ huynh: ";
      linkImg = receiverUrl;
    }
  } else {
    content = `Hủy trả trẻ`;
    title = `Giáo viên đã hủy trả trẻ vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
    context = ` hiện chưa trả trẻ`;
  }
  const receiveUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: "",
  };
  const sender = {};
  await RabbitMQ_SocketNotifyUsers(receiveUser, content, sender);
  await RabbitMQ_SocketAttendance(payload);
  const userObj = user.toObject();
  delete userObj.password;
  if (user.email) {
    await RabbitMQ_notifyReceiver(
      userObj._id,
      user.email,
      send_Notification_Mail_Attendance_For_Child(
        user.firstName,
        user.lastName,
        title,
        context,
        children.firstName,
        children.lastName,
        config.CLIENT_URL,
        note,
        linkImg ? linkImg : ""
      ),
      "Email sender",
      "Kindergarten.com"
    );
  }
  return { result };
};

const getChildAttendance = async (childId) => {
  try {
    const attendanceRecords = await getAttendanceByChildId(childId);
    return attendanceRecords;
  } catch (error) {
    throw new Error("Error processing attendance data");
  }
};

export default {
  fetchChildrenByClassId,
  getChildrenBySkillId,
  handleCheckInChild,
  handleCheckOutChild,
  getChildAttendance,
  createHealthlog,
  getDevelopmentByChildId,
};
