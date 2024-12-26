export const QUEUE_NAME = {
  //returnUserData -- template
  requestUserDetails: "USER_DETAILS_REQUEST",
  responseUserDetails: "USER_DETAILS_RESPONSE",

  //request sendmail
  requestSendMail: "NOTIFICATIONS",

  //consume return ChildDetailsByParentIdAndChildId
  responseQueueGetChildDetailsByParentIdAndChildId:
    "CHILD_DETAILS_BY_PARENTID_AND_CHILDID_RESPONSE",
  requestQueueGetChildDetailsByParentIdAndChildId:
    "CHILD_DETAILS_BY_PARENTID_AND_CHILDID_REQUEST",

  // send to get Academy request
  requestQueueGetAcademy: "GET_ACADEMY_REQUEST",
  responseQueueGetAcademy: "GET_ACADEMY_RESPONSE",

  //request socketNotifyUsers
  requestSocketNotifications: "SOCKET_NOTIFICATIONS",

  //request UpdateAcademyById
  requestQueueUpdateAcademy: "UPDATE_ACADEMY_REQUEST",

  //paymentUpdateInUserService
  requestPaymentUpdateInUserService: "PAYMENT_UPDATE_IN_USER_SERVICE",

  //request socketPaymentUpdate
  requestSocketPaymentUpdate: "SOCKET_PAYMENT_UPDATE",

  //request realtime attendance
  socketAttendance: "SOCKET_ ATTENDANCE",
  //request realtime register for school
  socketRegisterForSchool: "SOCKET_ REGISTER_FOR_SCHOOL",
  //request realtime register for school
  socketRegisterForTransport: "SOCKET_ REGISTER_FOR_TRANSPORT",
};
