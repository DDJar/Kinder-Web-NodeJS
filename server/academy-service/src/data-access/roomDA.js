import { Room, Class } from "../database/index.js";

const createRoom = async (roomData) => {
  return await Room.create(roomData);
};

// Tìm phòng theo tiêu chí
const getRoomByCriteria = async (criteria) => {
  return await Room.findOne(criteria);
};

const getRoom = async (roomId) => {
  return await Room.findById(roomId);
};

const getAllRooms = async () => {
  return await Room.find();
};
const getRoomsInUse = async () => {
  const rooms = await Room.find();
  return rooms.map((cls) => cls._id);
};
const updateRoom = async (roomId, updateData) => {
  return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
};
export { createRoom, getRoom, getAllRooms, getRoomsInUse, updateRoom, getRoomByCriteria };
