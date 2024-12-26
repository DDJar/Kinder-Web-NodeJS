import roomBusiness from "../business/roomBusiness.js";

const createRoom = async (req, res) => {
  try {
    const roomData = req.body;
    const newRoom = await roomBusiness.createRoomInformation(roomData);

    return res.json({
      status: 200,
      message: "Create room successfully",
      data: newRoom,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const allRooms = await roomBusiness.getAllRoomsInformation();

    const roomsInUse = await roomBusiness.getRoomsUse();

    const availableRooms = allRooms.filter(
      (room) => !roomsInUse.includes(room.id)
    );

    return res.json({
      status: 200,
      message: "Rooms fetched successfully",
      data: availableRooms,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const totalRooms = await roomBusiness.getAllRoomsInformation();
    const paginatedRooms = totalRooms.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalRooms.length / limit);

    return res.json({
      status: 200,
      message: "Rooms fetched successfully",
      data: paginatedRooms,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log(roomId);
    const roomData = await roomBusiness.getRoomInformation(roomId);

    if (!roomData) {
      return res.json({
        status: 404,
        message: "Room not found",
      });
    }

    return res.json({
      status: 200,
      message: "Room fetched successfully",
      data: roomData,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomData = req.body;

    const updatedRoom = await roomBusiness.updateRoomInformation(roomId, roomData);

    if (!updatedRoom) {
      return res.json({
        status: 404,
        message: "Room not found",
      });
    }

    return res.json({
      status: 200,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  createRoom,
  getRoom,
  getAllRooms,
  getRooms,
  updateRoom,
};
