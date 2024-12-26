import {listen_consumeUpdateAcademy} from "./consume/listen_consumeUpdateAcademy.js";
import {listen_getAcademyById_response} from "./consumeToReturnData/listen_getAcademyById_response.js";

export const consumeForRequests = async () => {
    await listen_consumeUpdateAcademy()
    await listen_getAcademyById_response()
}