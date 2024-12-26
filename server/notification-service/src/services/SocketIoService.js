// SocketIoService.js
import {Server as SocketIOServer} from "socket.io";
import config from "../config/config.js";

class SocketIoService {
    constructor() {
        this.count = 0
        this.io = null;
        this.shareLocation = []
        // {
        //     _id:1212
        //     isStart: true
        //     users:[
        //     {
        //           _id: 12asd
        //     role: USER;
        //     location:
        //     }
        //     ]
        // }
    }

    init(server) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ["GET", "POST"],
            },
        });

        this.io.on("connection", (socket) => {
            socket.emit(config.socketMessages.RECEIVE_MESSAGE, "Connected to server");

            socket.on("online", (userId) => {
                // Join room based on userId
                socket.join(userId);
                console.log(`User online id: ${userId}`);
                socket.emit(config.socketMessages.RECEIVE_MESSAGE, userId);
            });

            socket.on("payment_join_room", (orderCode) => {
                // Join room based on userId
                console.log("payment-join-room: ", orderCode);
                socket.join(orderCode);
            });
            socket.on("payment_leave_room", (orderCode) => {
                // Join room based on userId
                console.log("payment-leave-room: ", orderCode);
                socket.leave(orderCode);
            });
            socket.on("attendance_join_room", (attendanceCode) => {
                socket.join(attendanceCode);
            });
            socket.on("attendance_leave_room", (attendanceCode) => {
                socket.leave(attendanceCode);
            });


            //Bus-service----------------------------------------------------
            socket.on(config.socketMessages.BUS_DRIVER_START_RUN, (_roomId) => {
                if (this.isExistBusRoom(_roomId)) {
                    this.shareLocation.map(room => {
                        if (room._id === _roomId) {
                            room.isStart = true
                        }
                        return room
                    })
                } else {
                    this.shareLocation.push({
                        _id: _roomId,
                        isStart: true,
                        users: [],
                    })
                }
                console.log("Tai xe start room", this.shareLocation)
                socket.join(_roomId);
            })
            socket.on(config.socketMessages.BUS_DRIVER_CANCLE_START_RUN, (_roomId) => {
                if (this.isExistBusRoom(_roomId)) {
                    this.shareLocation = this.shareLocation.map(room => {
                        if (room._id === _roomId) room.isStart = false;
                        return room
                    })
                }
                this.shareLocation.forEach((room) => {
                    console.log("emitLocation (cancel): ")
                    this.emitLocation(room)
                })
                console.log("Tai xe cancle")
                socket.leave(_roomId);
            })
            socket.on(config.socketMessages.BUS_JOIN_ROOM, (_roomId) => {
                console.log("Join room: ", _roomId);
                socket.join(_roomId);
                if (!this.isExistBusRoom(_roomId)) {
                    console.log("not Exist room::: ");
                } else {
                    this.shareLocation.forEach((room) => {
                        console.log("emitLocation init join room: ")
                        this.emitLocation(room)
                    })
                }
            })
            socket.on(config.socketMessages.BUS_LEAVE_ROOM, (_roomId) => {
                socket.leave(_roomId);
            })
            socket.on(config.socketMessages.BUS_SHARE_LOCATION, (data) => {
                if (this.isExistBusRoom(data?.roomId)) {
                    this.shareLocation = this.shareLocation.map(room => {
                        if (room._id === data?.roomId) {
                            const isExitUser = room.users?.some((user) => user._id === data?._id);
                            if (isExitUser) {
                                room.users = room.users?.map((user) => {
                                    if (user._id === user?._id) {
                                        user.location = data.location;
                                    }
                                    return user
                                })
                            } else {
                                room.users.push({
                                    _id: data?._id,
                                    role: data.role,
                                    location: data.location,
                                })
                            }

                        }
                        return room
                    })
                    socket.join(data?.roomId);
                    this.shareLocation.forEach((room) => {
                        if (room.isStart) {
                            console.log("emitLocation: ", ++this.count)
                            this.emitLocation(room)
                        }
                    })
                }
            })

            //Register school
            socket.on("register_for_school_join_room", (registerForSchoolCode) => {
                socket.join(registerForSchoolCode);
            });
            socket.on("register_for_school_leave_room", (registerForSchoolCode) => {
                socket.leave(registerForSchoolCode);
            });
            socket.on(
                "register_for_transport_join_room",
                (registerForTransportCode) => {
                    socket.join(registerForTransportCode);
                }
            );
            socket.on(
                "register_for_transport_leave_room",
                (registerForTransportCode) => {
                    socket.leave(registerForTransportCode);
                }
            );


        });
    }

    emitNotification(type, user, message, sender) {
        const date = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const createdAt = date.toISOString();
        // Emit notification to the specific room (userId)
        this.io.to(user._id).emit(config.socketMessages.RECEIVE_NOTIFY, {
            _id: "1",
            type,
            user,
            content: message,
            sender,
            createdAt,
        });
    }

    emitPaymentUpdate(data) {
        // Emit notification to the specific room (userId)
        const roomId = data.data.data.orderCode;
        this.io.to(roomId).emit("payment_update", data);
    }

    emitAttendance(data) {
        // Emit notification to the specific room (userId)
        const roomId = data.data.data.attendanceCode;
        console.log("room", roomId);
        this.io.to(roomId).emit("attendance", data);
    }

    emitRegisterForSchool(data) {
        // Emit notification to the specific room (userId)
        const roomId = data.data.data.registerForSchoolCode;
        console.log("room", roomId);
        this.io.to(roomId).emit("register_for_school", data);
    }

    emitRegisterForTransport(data) {
        // Emit notification to the specific room (userId)
        const roomId = data.data.data.registerForTransportCode;
        console.log("room", roomId);
        this.io.to(roomId).emit("register_for_transport", data);
    }

    emitLocation(_room) {
        this.io.to(_room._id).emit(config.socketMessages.BUS_LOCATION, _room);
    }

    isExistBusRoom(roomId) {
        return this.shareLocation.some((room) => room._id === roomId);
    }

    isExistBusRoomAndStart(roomId) {
        return this.shareLocation.some((room) => room._id === roomId && room.isStart === true);
    }


}

const socketIoService = new SocketIoService();
export default socketIoService;
