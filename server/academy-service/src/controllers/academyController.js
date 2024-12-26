import { Class, Skill } from "../database/index.js";
import Category from "../database/models/Category.js";
import { ApiError } from "../utils/index.js";
import academyBusiness from "../business/academyBusiness.js";
import academyDA from "../data-access/academyDA.js";
import mongoose from "mongoose";

const createAcademy = async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Bad request");
  }

  const {
    type,
    name,
    teacherId,
    totalSeats,
    startTime,
    endTime,
    tuition,
    condition,
    category,
    room,
  } = req.body;
  var data = req.body;
  data.availableSeats = data.totalSeats;
  console.log(data.teacherId);
  var isExist;
  delete data.type;
  var academy;
  try {
    if (type === "class") {
      delete data.category;
      isExist = await Class.findOne({ name: data.name });
      if (isExist) {
        throw new ApiError(400, `${type} is exist!!!`);
      }
      academy = await Class.create(data);
    }
    // type === skill
    else {
      isExist = await Skill.findOne({ name });
      if (isExist) {
        throw new ApiError(400, `${type} is exist!!!`);
      }
      academy = await Skill.create(data);
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }

  return res.json({
    status: 200,
    message: "Create successfully!",
    data: academy,
  });
};
const createCategory = async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Bad request");
  }

  const { name } = req.body;
  var data = req.body;
  var category;

  try {
    let isExist = await Category.findOne({ name: data.name });
    if (isExist) {
      throw new ApiError(400, `${name} is exist!!!`);
    }
    category = await Category.create(data);
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }

  return res.json({
    status: 200,
    message: "Create successfully!",
    data: category,
  });
};

const getClass = async (req, res) => {
  try {
    let query = req.query;
    if (req.query.name) {
      query.name = new RegExp(`${req.query.name}`, "i");
    } else {
      query = req.query;
    }
    const listClass = await Class.find(query || {})
      .select(
        "_id name teacherId totalSeats startTime endTime tuition condition availableSeats status"
      )
      .limit(10)
      .sort({ endTime: -1, status: 1 });
    return res.json({
      status: 200,
      message: "Class fetched successfully",
      data: listClass,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const getSkill = async (req, res) => {
  try {
    let query = {};
    if (req.query.name || req.query.category) {
      query.$or = [];
      if (req.query.name) {
        query.$or.push({ name: new RegExp(req.query.name, "i") });
      }
      if (req.query.category) {
        const objectId = new mongoose.Types.ObjectId(req.query.category);
        query = { category: objectId };
      }
    } else {
      query = req.query;
    }
    const listSkill = await Skill.find(query || {})
      .select(
        "_id name teacherId category totalSeats startTime endTime tuition condition availableSeats status"
      )
      .limit(10)
      .sort({ endTime: -1, status: 1 })
      .populate("category");
    return res.json({
      status: 200,
      message: "Class fetched successfully",
      data: listSkill,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const getAllCategory = async (req, res) => {
  try {
    let query = req.query;
    const listCategory = await Category.find(query || {}).select("_id name");
    return res.json({
      status: 200,
      message: "Category fetched successfully",
      data: listCategory,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const getAcademyById = async (req, res) => {
  try {
    let { type, academyId } = req.query;
    let result = await academyDA.getAcademiesById(type, academyId);
    return res.json({
      status: 200,
      message: "Fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const getAcademy = async (req, res) => {
  try {
    let { type, condition, tab, limit, sortField, sortOrder } = req.query;
    if (!type) {
      type = "class";
    }
    if (type !== "class" && type !== "skill") {
      return res.json({
        status: 404,
        message: "Type not found",
      });
    }
    const select =
      type === "skill"
        ? "_id name teacherId category totalSeats startTime endTime tuition condition availableSeats status"
        : "_id name teacherId totalSeats startTime endTime tuition condition availableSeats status";
    let result = await academyBusiness.GetAcademies(
      type,
      condition,
      tab,
      limit,
      sortField,
      sortOrder,
      select
    );
    return res.json({
      status: 200,
      message: "Fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const searchAcademy = async (req, res) => {
  try {
    let { type, condition, search, tab, limit, sortField, sortOrder } =
      req.query;
    if (!type) {
      type = "class";
    }
    if (type !== "class" && type !== "skill") {
      return res.json({
        status: 404,
        message: "Type not found",
      });
    }
    const select =
      type === "skill"
        ? "_id name teacherId category totalSeats startTime endTime tuition condition availableSeats status"
        : "_id name teacherId totalSeats startTime endTime tuition condition availableSeats status";
    let result = await academyBusiness.SearchAcademies(
      type,
      condition,
      search,
      tab,
      limit,
      sortField,
      sortOrder,
      select
    );
    return res.json({
      status: 200,
      message: "Fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const updateAcademyById = async (req, res) => {
  try {
    let { type } = req.body;
    const academyId = req.params.id;
    const updateData = req.body;
    delete updateData.type;
    if (!type || !req.params.id || req.params.id == "null") {
      return res.json({
        status: 404,
        message: "Not found",
        data: null,
      });
    }

    let { result } = await academyBusiness.UpdateAcademiesById(
      type,
      academyId,
      updateData
    );
    return res.json({
      status: 200,
      message: "Update successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const getClassesByTeacher = async (req, res) => {
  const { teacherId } = req.query;
  const user = req.user;

  try {
    if (!teacherId || teacherId.trim() === "" || teacherId === "null") {
      return res.status(400).json({
        status: 400,
        message: "TeacherId is required or invalid",
      });
    }
    const classes = await academyBusiness.getClassesByTeacher(teacherId);

    if (!classes || classes.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No classes found for this teacher",
        data: { classes: [] },
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Classes fetched successfully!",
      data: { classes },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

const getSkilessByTeacher = async (req, res) => {
  const { teacherId } = req.query;
  try {
    // Validate teacherId
    if (!teacherId || teacherId.trim() === "" || teacherId === "null") {
      return res.status(400).json({
        status: 400,
        message: "TeacherId is required or invalid",
      });
    }

    // Fetch classes from business logic
    const skilles = await academyBusiness.getSkilessByTeacher(teacherId);

    // Handle no classes found case
    if (!skilles || skilles.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No skilles found for this teacher",
        data: { skilles: [] }, // Ensure 'data' is always present
      });
    }

    // Success response
    return res.status(200).json({
      status: 200,
      message: "skilles fetched successfully!",
      data: { skilles },
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  createAcademy,
  getClass,
  getSkill,
  getClassesByTeacher,
  getAcademyById,
  updateAcademyById,
  getAllCategory,
  createCategory,
  getAcademy,
  searchAcademy,
  getSkilessByTeacher,
};
