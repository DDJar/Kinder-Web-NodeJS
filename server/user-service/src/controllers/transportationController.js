import transportationBusiness from "../business/transportationBusiness.js";

const createTransportationService = async (req, res) => {
  try {
    const { name, driverId, totalSeats, tuition, busNumber } = req.body;

    await transportationBusiness.handleCreateTransportationService(
      name,
      driverId,
      totalSeats,
      tuition,
      busNumber
    );
    return res.json({
      status: 200,
      message: "Create transportation service successfully!",
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const getTransportationService = async (req, res) => {
  try {
    let { condition, tab, limit, sortField, sortOrder } = req.query;

    const select =
      "_id name driverId totalSeats availableSeats tuition busNumber status";
    let result = await transportationBusiness.handleGetTransportationService(
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
const searchTransportationService = async (req, res) => {
  try {
    let { condition, search, tab, limit, sortField, sortOrder } = req.query;
    const select =
      "_id name driverId totalSeats availableSeats tuition busNumber status";
    let result = await transportationBusiness.handleSearchTransportationService(
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
const updateTransportationServiceById = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    if (!req.params.id || req.params.id == "null") {
      return res.json({
        status: 404,
        message: "Not found",
        data: null,
      });
    }
    if (!updateData || !Object.keys(updateData).length) {
      return res.json({
        status: 404,
        message: "No data provided for update",
        data: null,
      });
    }
    let result = await transportationBusiness.handleUpdateTransportation(
      id,
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
const GetTransportationById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!req.query.id || req.params.id == "null") {
      return res.json({
        status: 404,
        message: "Not found",
        data: null,
      });
    }
    let result = await transportationBusiness.handleGetTransportation(id);
    return res.json({
      status: 200,
      message: "fecth successfully",
      data: result,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};
const GetDriverById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!req.query.id || req.params.id == "null") {
      return res.json({
        status: 404,
        message: "Not found",
        data: null,
      });
    }

    const result = await transportationBusiness.handleGetDriver(id);

    if (result) {
      return res.json({
        status: 200,
        message: "Fetch successfully",
        data: result,
      });
    }

    return res.json({
      status: 200,
      message: "No driver found",
      data: [],
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

const getChildWaitTransportation = async (req, res) => {
  try {
    let { transportId, tab, limit } = req.query;
    const { result, totalPages } =
      await transportationBusiness.handChildWaitTransportation(
        transportId,
        tab,
        limit
      );
    return res.json({
      status: 200,
      message: "Featch successfully!",
      data: { result: result, totalPages: totalPages },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};

const searchChildWaitTransportation = async (req, res) => {
  try {
    let { transportId, condition, tab, limit } = req.query;
    const { result, totalPages } =
      await transportationBusiness.handChildSearchWaitTransportation(
        transportId,
        condition,
        tab,
        limit
      );
    return res.json({
      status: 200,
      message: "Featch successfully!",
      data: { result: result, totalPages: totalPages },
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const arrangeChildTransportation = async (req, res) => {
  const { transportId, selectedChildren } = req.body;
  try {
    const { resList } =
      await transportationBusiness.handleArrangeChildTransportation(
        transportId,
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
const getChildrenByAttendanceTransportId = async (req, res) => {
  const { transportId, attendDay, attendMonth, attendYear, type } = req.query;
  try {
    const { childrenWithAttendance } =
      await transportationBusiness.fetchChildrenByTransportId(
        transportId,
        attendDay,
        attendMonth,
        attendYear,
        type
      );
    return res.json({
      status: 200,
      message: "Children fetched successfully!",
      data: childrenWithAttendance,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const checkInTransportChild = async (req, res) => {
  const { transportId, childId, isCheckIn, type, isUse } = req.body;
  try {
    const { result } = await transportationBusiness.handleCheckInTransportChild(
      req.user._id,
      transportId,
      childId,
      isCheckIn,
      type,
      isUse
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
const checkOutTransportChild = async (req, res) => {
  const { transportId, childId, isCheckOut, type, isUse, receiverUrl } =
    req.body;
  try {
    const { result } =
      await transportationBusiness.handleCheckOutTransportChild(
        req.user._id,
        transportId,
        childId,
        isCheckOut,
        type,
        isUse,
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
const getChildTransportation = async (req, res) => {
  const { transportId } = req.query;
  try {
    const { result } = await transportationBusiness.handChildTransportation(
      transportId
    );
    return res.json({
      status: 200,
      message: "Successfully",
      data: { result: result },
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
export default {
  createTransportationService,
  getTransportationService,
  searchTransportationService,
  updateTransportationServiceById,
  getChildWaitTransportation,
  searchChildWaitTransportation,
  arrangeChildTransportation,
  getChildrenByAttendanceTransportId,
  checkInTransportChild,
  checkOutTransportChild,
  getChildTransportation,
  GetTransportationById,
  GetDriverById,
};
