import returnUserData from "./consumeToReturnData/returnUserData.js";
import {returnChildDetailsByParentIdAndChildId} from "./consumeToReturnData/returnChildDetailsByParentIdAndChildId.js";
import listen_GetAcademyById_Response from "./consumeToReturnData/listen_GetAcademyById_response.js";
import {
    listen_requestPaymentUpdateInUserService
} from "./consume/listen_requestPaymentUpdateInUserService.js";

export const consumeForRequests = async () => {
    await returnUserData()
    await returnChildDetailsByParentIdAndChildId()
    await listen_GetAcademyById_Response()
    await listen_requestPaymentUpdateInUserService()
}