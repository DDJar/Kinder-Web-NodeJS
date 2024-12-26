import { Class, Skill, AttendanceClass, EatFee } from "../database/index.js";

async function createClass(_class) {
  return await Class.create(_class);
}

async function createSkill(_skill) {
  return await Skill.create(_skill);
}

async function createEatFees(_eatFees) {
  return await EatFee.create(_eatFees);
}

async function findClass(type, condition, select) {
  if (type === "class") {
    return await Class.find(condition).select(select);
  } else {
    return await Skill.find(condition).select(select);
  }
}

async function findAndUpdateClass(type, classId, condition) {
  if (type === "class") {
    return await Class.findByIdAndUpdate(classId, condition);
  } else {
    return await Skill.findByIdAndUpdate(classId, condition);
  }
}

async function saveClass(data) {
  return data.save();
}

async function createAttend(data) {
  return await AttendanceClass.create(data);
}

async function findAttendanceClass(condition, select) {
  return await AttendanceClass.find(condition).select(select);
}

async function findOneAttendanceClass(condition, select) {
  return await AttendanceClass.findOne(condition).select(select);
}

async function saveAttend(data) {
  return data.save();
}

async function findAttendanceClassAndUpdate(condition, update, select) {
  return await AttendanceClass.findOneAndUpdate(condition, update, {
    new: true,
    fields: select,
  });
}

async function GetCountChildAttendenceAtMonth(childId, atMonthYear) {
  const countAttend = AttendanceClass.countDocuments({
    childId,
    attendMonth: atMonthYear.month,
    attendYear: atMonthYear.year,
    isCheckIn: true,
    isCheckOut: true,
  });
  return countAttend;
}

async function getAttendanceByChildId(childId) {
  const attendanceRecords = await AttendanceClass.find({ childId }).exec();
  return attendanceRecords;
}

export {
  createClass,
  createSkill,
  findClass,
  findAndUpdateClass,
  saveClass,
  createAttend,
  findAttendanceClass,
  saveAttend,
  findAttendanceClassAndUpdate,
  findOneAttendanceClass,
  GetCountChildAttendenceAtMonth,
  createEatFees,
  getAttendanceByChildId,
};
