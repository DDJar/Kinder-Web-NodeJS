import mongoose from "mongoose";
import {
  countTransportationService,
  createTransportationService,
  findAndUpdateTransportation,
  findAttendanceTransportation,
  findAttendanceTransportationsAndUpdate,
  findOneAttendanceTransportation,
  findTransportation,
  findTransportationService,
  findTransportationlication,
  getTransportationService,
  saveTransportation,
  updateTransportationService,
  GetTransport,
  GetDriver,
} from "../data-access/transportationDA.js";
import {
  countChild,
  findChildByCondition,
  findChildByPopulate,
  findOneChildByCondition,
} from "../data-access/childDA.js";
import { AttendanceTransportation } from "../database/index.js";
import { ApiError } from "../utils/index.js";
import config from "../config/config.js";
import { findUserByChildId } from "../data-access/userDA.js";
import { send_Notification_Mail_Register_School_For_Child } from "../utils/templateRegisterSchool.js";
import { convertUtcToVietnamTime, formatDateTime } from "../utils/date.js";
import { findAttendanceClass } from "../data-access/classDA.js";
import { RabbitMQ_SocketNotifyUsers } from "../services/RabbitMQService/send/socketNotifyUsers.js";
import { RabbitMQ_notifyReceiver } from "../services/RabbitMQService/send/mail.js";
import { send_Notification_Mail_Attendance_For_Child } from "../utils/templateAttendance.js";
import { RabbitMQ_SocketAttendance } from "../services/RabbitMQService/send/SocketAttendance.js";

const handleCreateTransportationService = async (
  name,
  driverId,
  totalSeats,
  tuition,
  busNumber
) => {
  if (!name || !driverId || !totalSeats || !tuition || !busNumber) {
    throw new ApiError(400, "Valid is required");
  }

  const transportationData = {
    name: name,
    driverId: driverId,
    totalSeats: totalSeats,
    tuition: tuition,
    busNumber: busNumber,
    availableSeats: totalSeats,
  };

  const result = await createTransportationService(transportationData);
  if (result.message) {
    if (result.message.name === 1 || result.message.busNumber === 1) {
      throw new ApiError(400, "Duplicate");
    }
  }

  return { result };
};
const handleGetTransportationService = async (
  condition,
  tab,
  limit,
  sortField,
  sortOrder,
  select
) => {
  tab = tab ? parseInt(tab) : 1;
  limit = limit ? parseInt(limit) : 5;
  const skip = (tab - 1) * limit;
  let query = {};
  const sort = sortField ? { [sortField]: sortOrder === "asc" ? 1 : -1 } : {};
  if (condition) {
    if (condition.status !== "ALL") {
      query = condition;
    } else {
      delete condition.status;
      query = condition;
    }
  }
  let result = await getTransportationService(query, skip, limit, select, sort);
  const total = await countTransportationService(query);
  if (isNaN(total)) {
    throw new ApiError(400, "Total count of transportation is NaN");
  }
  let totalPages = Math.ceil(total / limit);
  const data = {
    result: result,
    totalPages: totalPages,
  };
  return data;
};
const handleSearchTransportationService = async (
  condition,
  search,
  tab,
  limit,
  sortField,
  sortOrder,
  select
) => {
  tab = tab ? parseInt(tab) : 1;
  limit = limit ? parseInt(limit) : 5;
  const skip = (tab - 1) * limit;
  let query = {};
  const sort = sortField ? { [sortField]: sortOrder === "asc" ? 1 : -1 } : {};
  if (condition) {
    if (condition.status !== "ALL") {
      query = condition;
    } else {
      delete condition.status;
      query = condition;
    }
  }
  if (search) {
    const searchRegex = new RegExp(`${search}`, "i");
    const searchNumber = Number.parseInt(search, 10);
    query.$or = [
      { name: searchRegex },
      ...(Number.isNaN(searchNumber)
        ? []
        : [
            { name: searchRegex },
            { totalSeats: searchNumber },
            { availableSeats: searchNumber },
            { tuition: searchNumber },
            { busNumber: searchRegex },
          ]),
    ];
  }
  let result = await getTransportationService(query, skip, limit, select, sort);
  const total = await countTransportationService(query);
  if (isNaN(total)) {
    throw new ApiError(400, "Total count of transportation is NaN");
  }
  let totalPages = Math.ceil(total / limit);
  const data = {
    result: result,
    totalPages: totalPages,
  };
  return data;
};
const handleUpdateTransportation = async (id, updateData) => {
  const transportation = await updateTransportationService(id, updateData);
  if (transportation.message) {
    if (
      transportation.message.name === 1 ||
      transportation.message.busNumber === 1
    ) {
      throw new ApiError(400, "Duplicate");
    }
  }
  return transportation;
};
const handleGetTransportation = async (id) => {
  const transport = await GetTransport(id);
  return transport;
};
const handleGetDriver = async (id) => {
  const driver = await GetDriver(id);
  return driver;
};
const handChildWaitTransportation = async (transportId, tab, limit) => {
  if (!transportId) {
    throw new ApiError(404, "Not found");
  }
  const dataTransportation = await findTransportationService(
    { _id: transportId },
    "_id name driverId totalSeats availableSeats tuition busNumber status"
  );

  if (!dataTransportation) {
    throw new ApiError(400, "Invalidate transportation");
  }
  if (!mongoose.Types.ObjectId.isValid(dataTransportation._id)) {
    throw new ApiError(400, "Invalid");
  }
  tab = tab ? parseInt(tab) : 1;
  limit = limit ? parseInt(limit) : 5;
  const skip = (tab - 1) * limit;
  const transportationes = await findTransportation(
    { status: "ACCEPT" },
    "_id"
  );
  const children = await findChildByCondition(
    { transportation: { $in: transportationes } },
    "_id firstName lastName dateOfBirth avatar docs transportation",
    skip,
    limit,
    { dateOfBirth: -1 }
  );

  const totalChild = await countChild({
    transportation: { $in: transportationes },
  });
  const totalPages = Math.ceil(totalChild / limit);
  const enrichedChildren = await Promise.all(
    children.map(async (child) => {
      const application = await findTransportationlication(
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
    _id: dataTransportation._id,
    name: dataTransportation.name,
    driverId: dataTransportation.driverId,
    totalSeats: dataTransportation.totalSeats,
    availableSeats: dataTransportation.availableSeats,
    tuition: dataTransportation.tuition,
    busNumber: dataTransportation.busNumber,
    status: dataTransportation.status,
    children: enrichedChildren,
  };
  return { result, totalPages };
};
const handChildSearchWaitTransportation = async (
  transportId,
  condition,
  tab,
  limit
) => {
  if (!transportId) {
    throw new ApiError(404, "Not found");
  }
  const dataTransportation = await findTransportationService(
    { _id: transportId },
    "_id name driverId totalSeats availableSeats tuition busNumber status"
  );
  if (!dataTransportation) {
    throw new ApiError(400, "Invalidate transportation");
  }
  if (!mongoose.Types.ObjectId.isValid(dataTransportation._id)) {
    throw new ApiError(400, "Invalid");
  }
  tab = tab ? parseInt(tab) : 1;
  limit = limit ? parseInt(limit) : 5;
  const skip = (tab - 1) * limit;
  let searchCondition = {};
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
  const transportationes = await findTransportation(
    { status: "ACCEPT" },
    "_id"
  );
  const children = await findChildByCondition(
    { transportation: { $in: transportationes }, ...searchCondition },
    "_id firstName lastName dateOfBirth avatar docs transportation",
    skip,
    limit,
    { dateOfBirth: -1 }
  );

  const totalChild = await countChild({
    transportation: { $in: transportationes },
    ...searchCondition,
  });
  const totalPages = Math.ceil(totalChild / limit);
  const enrichedChildren = await Promise.all(
    children.map(async (child) => {
      const application = await findTransportationlication(
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
    _id: dataTransportation._id,
    name: dataTransportation.name,
    driverId: dataTransportation.driverId,
    totalSeats: dataTransportation.totalSeats,
    availableSeats: dataTransportation.availableSeats,
    tuition: dataTransportation.tuition,
    busNumber: dataTransportation.busNumber,
    status: dataTransportation.status,
    children: enrichedChildren,
  };
  return { result, totalPages };
};
const handleArrangeChildTransportation = async (transportId, data) => {
  const resList = [];
  if (!transportId || data.length === 0) {
    throw new ApiError(404, "Not found");
  }
  const dataTransportation = await findTransportationService(
    { _id: transportId },
    "_id name driverId totalSeats availableSeats tuition busNumber status"
  );
  if (!dataTransportation) {
    throw new ApiError(404, "Not found");
  }

  for (let index = 0; index < data.length; index++) {
    var childId = data[index];
    const child = await findChildByPopulate(
      childId,
      "transportation",
      { status: "ACCEPT" },
      "_id transportationId status"
    );
    if (!child) {
      console.log(`Child with ID ${childId} not found.`);
      continue;
    }
    const user = await findUserByChildId(
      childId,
      "_id firstName lastName email",
      "_id firstName lastName"
    );
    const transportationToUpdate = child.transportation[0];
    if (transportationToUpdate) {
      await findAndUpdateTransportation(transportationToUpdate._id, {
        transportationId: dataTransportation._id,
        status: "ACTIVE",
      });
      const updateData = {
        availableSeats: --dataTransportation.availableSeats,
      };
      await updateTransportationService(dataTransportation._id, updateData);
      const content = `${child.firstName} ${child.lastName} đã được xếp vào xe ${dataTransportation.name}!!!`;
      const title = " Xếp xe ";
      const context = `đưa đón cho trẻ`;
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
        updatedTransportationId: transportationToUpdate._id,
        status: "ACTIVE",
        user: user,
        transportation: dataTransportation,
      });
    } else {
      throw new ApiError(404, `Not found`);
    }
  }
  return { resList };
};
const fetchChildrenByTransportId = async (
  transportId,
  attendDay,
  attendMonth,
  attendYear,
  type
) => {
  if (!transportId || !mongoose.Types.ObjectId.isValid(transportId)) {
    throw new ApiError(404, `Not found`);
  }

  const transportObjectId = new mongoose.Types.ObjectId(transportId);

  const transportDetail = await findTransportation(
    { transportationId: transportObjectId, status: "ACTIVE" },
    "_id"
  );

  if (!transportDetail) {
    throw new ApiError(404, `Not found`);
  }
  const transportIds = transportDetail.map(
    (transportItem) => transportItem._id
  );

  const children = await findChildByCondition(
    { transportation: { $in: transportIds } },
    "_id firstName lastName dateOfBirth avatar transportation"
  );
  if (children.length === 0) {
    throw new ApiError(404, `Not found`);
  }
  const childIds = children.map((childrenItem) => childrenItem._id);
  const currentDate = new Date();
  const attendanceCondition = {
    transportId: transportObjectId,
    childId: { $in: childIds },
    attendDay: attendDay || currentDate.getDate(),
    attendMonth: attendMonth || currentDate.getMonth() + 1,
    attendYear: attendYear || currentDate.getFullYear(),
  };
  const classAttendanceRecords = await findAttendanceClass(
    {
      childId: { $in: childIds },
      attendDay: attendDay || currentDate.getDate(),
      attendMonth: attendMonth || currentDate.getMonth() + 1,
      attendYear: attendYear || currentDate.getFullYear(),
    },
    "_id childId isCheckIn isCheckOut receiver receiverUrl"
  );
  const attendanceRecords = await findAttendanceTransportation(
    attendanceCondition,
    "_id childId isCheckIn isCheckOut type isUse receiverUrl"
  );
  const childrenWithAttendance = await Promise.all(
    children.map(async (child) => {
      const firstAttendance = attendanceRecords.find(
        (record) =>
          record.childId.toString() === child._id.toString() &&
          record.type === "FIRST"
      );
      const secondAttendance = attendanceRecords.find(
        (record) =>
          record.childId.toString() === child._id.toString() &&
          record.type === "SECOND"
      );
      const classAttendance = classAttendanceRecords.find(
        (record) => record.childId.toString() === child._id.toString()
      );
      const user = await findUserByChildId(
        child._id,
        "_id firstName lastName email phone address",
        "_id firstName lastName"
      );
      return {
        ...child.toObject(),
        address: user?.address || "",
        parentName: `${user?.firstName} ${user?.lastName}` || "",
        phoneNumber: user?.phone,
        attendance: {
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
          class: classAttendance
            ? {
                teacherId: classAttendance.teacherId,
                classId: classAttendance.classId,
                isCheckIn: classAttendance.isCheckIn,
                isCheckOut: classAttendance.isCheckOut,
                receiver: classAttendance.receiver,
                receiverUrl: classAttendance.receiverUrl,
              }
            : {
                _id: null,
                isCheckIn: false,
                isCheckOut: false,
                receiver: "DRIVER",
                receiverUrl: "",
              },
        },
      };
    })
  );
  return { childrenWithAttendance };
};
const handleCheckInTransportChild = async (
  driverId,
  transportId,
  childrenId,
  isCheckIn,
  type,
  isUse
) => {
  if (
    !driverId ||
    !transportId ||
    !childrenId ||
    !type ||
    isCheckIn === null ||
    isCheckIn === undefined
  ) {
    throw new ApiError(404, "Not Found");
  }
  const currentDate = new Date();
  const vietnamDate = convertUtcToVietnamTime(currentDate);
  let query = {
    driverId: driverId,
    transportId: transportId,
    childId: childrenId,
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
  };
  const data = {
    driverId: driverId,
    transportId: transportId,
    childId: childrenId,
    type: type,
    isUse: isUse,
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
    isCheckIn: isCheckIn,
    createdCheckInAt: vietnamDate.formattedDate,
  };
  let result = {};
  if (type === "FIRST") {
    query.type = "FIRST";
    const existsAttend = await findOneAttendanceTransportation(
      query,
      "_id driverId transportId childId "
    );
    if (existsAttend) {
      result = await findAttendanceTransportationsAndUpdate(
        { _id: existsAttend._id },
        data,
        "_id driverId transportId childId "
      );
    } else {
      const attendanceRecord = new AttendanceTransportation(data);
      result = await saveTransportation(attendanceRecord);
    }
  }
  if (type === "SECOND") {
    query.type = "SECOND";
    const existsAttend = await findOneAttendanceTransportation(
      query,
      "_id driverId transportId childId"
    );
    if (existsAttend) {
      result = await findAttendanceTransportationsAndUpdate(
        { _id: existsAttend._id },
        data,
        "_id driverId transportId childId"
      );
    } else {
      const attendanceRecord = new AttendanceTransportation(data);
      result = await saveTransportation(attendanceRecord);
    }
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
      attendanceCode: "attendanceClass-123",
    },
  };
  if (isUse === "YES") {
    if (isCheckIn === true) {
      if (type === "SECOND") {
        content = `Trẻ đã lên xe về`;
        title = `Tài xế đã nhận trẻ vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
        context = ` và đang trên đường đi về nhà cho trẻ`;
      } else {
        content = `Trẻ đã lên xe`;
        title = `Tài xế đã nhận trẻ vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
        context = ` và đang trên đường đi tới trường cho trẻ`;
      }
    } else {
      content = `Hủy lên xe`;
      title = `Tài xế đã hủy nhận trẻ lên xe vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` sẽ trả lại trẻ`;
    }
  } else {
    if (type === "SECOND" && isUse === "") {
      content = `Hủy lên xe`;
      title = `Tài xế đã hủy nhận trẻ lên xe vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` sẽ trả lại trẻ`;
    } else {
      if (isUse === "") {
        content = `Hủy xác nhận phụ huynh chở`;
        title = `Tài xế đã hủy xác nhận phụ huynh chở vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
        context = ` và đang đón trẻ`;
      }
    }

    if (isUse === "NO") {
      content = `Trẻ đã được phụ huynh chở`;
      title = `Tài xế đã xác nhận phụ huynh chở vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` của trẻ`;
    }
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
const handleCheckOutTransportChild = async (
  driverId,
  transportId,
  childrenId,
  isCheckOut,
  type,
  isUse,
  receiverUrl
) => {
  if (
    !driverId ||
    !transportId ||
    !childrenId ||
    !type ||
    isCheckOut === null ||
    isCheckOut === undefined
  ) {
    throw new ApiError(404, "Not Found");
  }
  const currentDate = new Date();
  const vietnamDate = convertUtcToVietnamTime(currentDate);
  let query = {
    driverId: driverId,
    transportId: transportId,
    childId: childrenId,
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
  };
  const data = {
    driverId: driverId,
    transportId: transportId,
    childId: childrenId,
    type: type,
    isUse: isUse,
    receiverUrl: receiverUrl ? receiverUrl : "",
    attendDay: vietnamDate.day,
    attendMonth: vietnamDate.month,
    attendYear: vietnamDate.year,
    isCheckOut: isCheckOut,
    createdCheckOutAt: vietnamDate.formattedDate,
  };
  let result = {};
  if (type === "FIRST") {
    query.type = "FIRST";
    const existsAttend = await findOneAttendanceTransportation(
      query,
      "_id driverId transportId childId "
    );
    if (existsAttend) {
      result = await findAttendanceTransportationsAndUpdate(
        { _id: existsAttend._id },
        data,
        "_id driverId transportId childId createdCheckOutAt"
      );
    } else {
      const attendanceRecord = new AttendanceTransportation(data);
      result = await saveTransportation(attendanceRecord);
    }
  }
  if (type === "SECOND") {
    query.type = "SECOND";
    const existsAttend = await findOneAttendanceTransportation(
      query,
      "_id driverId transportId childId createdCheckOutAt"
    );
    if (existsAttend) {
      result = await findAttendanceTransportationsAndUpdate(
        { _id: existsAttend._id },
        data,
        "_id driverId transportId childId createdCheckOutAt"
      );
    } else {
      const attendanceRecord = new AttendanceTransportation(data);
      result = await saveTransportation(attendanceRecord);
    }
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
  let linkImg = "";
  if (isCheckOut === true) {
    if (type === "SECOND") {
      content = `Trẻ đã xuống xe`;
      title = `Tài xế đã cho trẻ xuống vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` và đã tới nhà cho trẻ`;
      note = "Đã cho trẻ xuống tại: ";
      linkImg = receiverUrl;
    } else {
      content = `Trẻ đã xuống xe`;
      title = `Tài xế đã cho trẻ xuống vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
      context = ` và đã tới trường cho trẻ`;
    }
  } else {
    content = `Hủy xuống xe`;
    title = `Tài xế đã hủy xuống xe vào lúc ${notifDateTime.hours}:${notifDateTime.minutes} ngày ${notifDateTime.day} tháng ${notifDateTime.month} năm ${notifDateTime.year}`;
    context = ` hiện chưa xuống xe trẻ`;
  }
  const receiveUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: "",
  };
  const sender = {};
  const payload = {
    code: "00",
    data: {
      childId: childrenId,
      attendanceCode: "attendanceClass-123",
    },
  };
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
const handChildTransportation = async (transportId) => {
  if (!transportId || !mongoose.Types.ObjectId.isValid(transportId)) {
    throw new ApiError(404, `Not found`);
  }
  const dataTransportation = await findTransportationService(
    { _id: transportId },
    "_id name driverId totalSeats availableSeats tuition busNumber status"
  );
  if (!dataTransportation) {
    throw new ApiError(400, "Invalidate transportation");
  }
  if (!mongoose.Types.ObjectId.isValid(dataTransportation._id)) {
    throw new ApiError(400, "Invalid");
  }
  let conditionChild = {};
  const transportation = await findTransportation(
    { transportationId: dataTransportation._id, status: "ACTIVE" },
    "_id"
  );
  conditionChild = { transportation: { $in: transportation } };

  const transportIds = transportation.map((transportObj) => transportObj._id);
  const children = await findChildByCondition(
    conditionChild,
    "_id firstName lastName dateOfBirth avatar docs transportation",
    "",
    "",
    "",
    {
      path: "transportation",
      match: { _id: { $in: transportIds } },
      select: "_id transportationId status",
    }
  );
  const result = {
    _id: dataTransportation._id,
    name: dataTransportation.name,
    driverId: dataTransportation.driverId,
    totalSeats: dataTransportation.totalSeats,
    availableSeats: dataTransportation.availableSeats,
    tuition: dataTransportation.tuition,
    busNumber: dataTransportation.busNumber,
    status: dataTransportation.status,
    children: children,
  };

  return { result };
};
export default {
  handleCreateTransportationService,
  handleGetTransportationService,
  handleSearchTransportationService,
  handleUpdateTransportation,
  handChildWaitTransportation,
  handChildSearchWaitTransportation,
  handleArrangeChildTransportation,
  fetchChildrenByTransportId,
  handleCheckInTransportChild,
  handleCheckOutTransportChild,
  handChildTransportation,
  handleGetTransportation,
  handleGetDriver,
};
