import {
  createRoom,
  getRoom,
  getAllRooms,
  getRoomsInUse,
  updateRoom,
  getRoomByCriteria,
} from "../data-access/roomDA.js";
import { Room } from "../database/index.js";
import { ApiError } from "../utils/apiError.js";

const createRoomInformation = async (roomData) => {
  const { name, totalSeats, cameraUrl } = roomData;

  if (typeof totalSeats !== "number" || totalSeats < 0 || totalSeats > 100) {
    throw new ApiError(
      400,
      "Số chỗ khả dụng phải nằm trong khoảng từ 0 đến 100"
    );
  }
  const existingRoomByName = await getRoomByCriteria({ name });
  if (existingRoomByName) {
    throw new ApiError(400, "Tên phòng đã tồn tại");
  }

  const existingRoomByCameraUrl = await getRoomByCriteria({ cameraUrl });
  if (existingRoomByCameraUrl) {
    throw new ApiError(400, "Camera URL đã tồn tại");
  }

  try {
    return await createRoom({
      name,
      totalSeats,
      cameraUrl,
      status: "ACTIVE",
    });
  } catch (error) {
    throw new ApiError(400, `Business Error: ${error.message}`);
  }
};

const getAllRoomsInformation = async () => {
  try {
    return await getAllRooms();
  } catch (error) {
    throw new ApiError(400, `Business Error: ${error.message}`);
  }
};

const getRoomInformation = async (roomId) => {
  try {
    return await getRoom(roomId);
  } catch (error) {
    throw new ApiError(400, `Business Error: ${error.message}`);
  }
};

const getRoomsUse = async () => {
  return await getRoomsInUse();
};

const updateRoomInformation = async (roomId, roomData) => {
  const { name, totalSeats, cameraUrl, status } = roomData;

  const existingRoom = await getRoom(roomId);
  if (!existingRoom) {
    throw new ApiError(404, "Phòng không tồn tại");
  }

  if (name) {
    const roomWithSameName = await getRoomByCriteria({
      name,
      _id: { $ne: roomId },
    });
    if (roomWithSameName) {
      throw new ApiError(400, "Tên phòng đã tồn tại");
    }
  }

  if (cameraUrl) {
    const roomWithSameCameraUrl = await getRoomByCriteria({
      cameraUrl,
      _id: { $ne: roomId },
    });
    if (roomWithSameCameraUrl) {
      throw new ApiError(400, "Camera URL đã tồn tại");
    }
  }

  try {
    return await updateRoom(roomId, { name, totalSeats, cameraUrl, status });
  } catch (error) {
    throw new ApiError(400, `Business Error: ${error.message}`);
  }
};

export default {
  createRoomInformation,
  getRoomInformation,
  getAllRoomsInformation,
  getRoomsUse,
  updateRoomInformation,
};
