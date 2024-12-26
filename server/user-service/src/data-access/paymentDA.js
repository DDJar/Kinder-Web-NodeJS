import {Payment} from "../database/index.js";
import {ApiError} from "../utils/index.js";

const createPayment = async (_data) => {
    try {
        return await Payment.create(_data)
    } catch (error) {
        throw new ApiError(500, error.message)
    }
}
export {
    createPayment,
}