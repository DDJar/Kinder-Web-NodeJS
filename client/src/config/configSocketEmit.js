const socketMessages = {
    RECEIVE_MESSAGE: 'receive_message',
    RECEIVE_NOTIFY: 'receive_notify',
    PAYMENT_UPDATE: 'payment_update',
    PAYMENT_JOIN_ROOM: 'payment_join_room',
    PAYMENT_LEAVE_ROOM: 'payment_leave_room',
    ATTENDANCE: 'attendance',
    ATTENDANCE_JOIN_ROOM: 'attendance_join_room',
    ATTENDANCE_LEAVE_ROOM: 'attendance_leave_room',

    //bus-service
    BUS_DRIVER_START_RUN: 'bus_driver_start_run',
    BUS_DRIVER_CANCLE_START_RUN: 'bus_driver_cancle_start_run',
    BUS_JOIN_ROOM: 'bus_join_room',
    BUS_LEAVE_ROOM: 'bus_leave_room',
    BUS_SHARE_LOCATION: 'bus_share_location',
    BUS_IS_START: 'bus_is_start',
    BUS_LOCATION: 'bus_location',
    REGISTER_FOR_SCHOOL: 'register_for_school',
    REGISTER_FOR_SCHOOL_JOIN_ROOM: 'register_for_school_join_room',
    REGISTER_FOR_SCHOOL_LEAVE_ROOM: 'register_for_school_leave_room',
    REGISTER_FOR_TRANSPORT: 'register_for_transport',
    REGISTER_FOR_TRANSPORT_JOIN_ROOM: 'register_for_transport_join_room',
    REGISTER_FOR_TRANSPORT_LEAVE_ROOM: 'register_for_transport_leave_room',
};

export default socketMessages;
