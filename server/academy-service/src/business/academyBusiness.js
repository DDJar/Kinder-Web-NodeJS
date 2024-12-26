import academyDA from "../data-access/academyDA.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
const GetAcademies = async (
  type,
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
    }
  }
  let result = await academyDA.getAcademies(
    type,
    query,
    skip,
    limit,
    select,
    sort
  );
  const totalClass = await academyDA.countAcademies(type, query);
  if (isNaN(totalClass)) {
    throw new ApiError(400, `Total count of academies is NaN`);
  }
  let totalPages = Math.ceil(totalClass / limit);
  const data = {
    result: result,
    totalPages: totalPages,
  };
  return data;
};
const SearchAcademies = async (
  type,
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
            { totalSeats: searchNumber },
            { tuition: searchNumber },
            { condition: searchNumber },
            { availableSeats: searchNumber },
          ]),
    ];
  }
  let result = await academyDA.getAcademies(
    type,
    query,
    skip,
    limit,
    select,
    sort
  );
  const totalClass = await academyDA.countAcademies(type, query);
  if (isNaN(totalClass)) {
    throw new ApiError(400, `Total count of academies is NaN`);
  }
  let totalPages = Math.ceil(totalClass / limit);
  const data = {
    result: result,
    totalPages: totalPages,
  };
  return data;
};
const GetAcademiesById = async (type, id) => {
  const children = await academyDA.getAcademiesById(type, id);
  return children;
};
const UpdateAcademies = async (type, idAcademy, updateData) => {
  const children = await academyDA.updateAcademy(type, idAcademy, updateData);
  return children;
};
const getClassesByTeacher = async (teacherId) => {
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher ID");
  }
  const objectId = new mongoose.Types.ObjectId(teacherId);
  const classes = await academyDA.findActiveClassesByTeacher(objectId);
  return classes;
};
const getSkilessByTeacher = async (teacherId) => {
  const objectId = new mongoose.Types.ObjectId(teacherId);
  return await academyDA.findSkillesByTeacher(objectId);
};
const UpdateAcademiesById = async (type, idAcademy, updateData) => {
  const result = await academyDA.updateAcademy(type, idAcademy, updateData);
  return { result };
};
export default {
  GetAcademies,
  SearchAcademies,
  GetAcademiesById,
  UpdateAcademies,
  getClassesByTeacher,
  getSkilessByTeacher,
  UpdateAcademiesById,
};
