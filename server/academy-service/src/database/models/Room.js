import mongoose from "mongoose";

const { Schema } = mongoose;

const StatusRoom = {
  BLOCK: "BLOCK",
  ACTIVE: "ACTIVE",
};

const RoomSchema = new Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      default: "",
    },
    totalSeats: {
      type: Number,
      default: null,
    },
    cameraUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(StatusRoom),
      default: StatusRoom.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", RoomSchema);
export default Room;
