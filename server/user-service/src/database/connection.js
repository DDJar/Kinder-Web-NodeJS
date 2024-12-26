import mongoose from "mongoose";
import config from "../config/config.js";
import authBusiness from "../business/authBusiness.js";
import initDatabaseInitBusiness from "../business/initDatabaseInitBusiness.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.info("Database connected");
        await authBusiness.handleInitAdminAccount();
        await initDatabaseInitBusiness.handleInitDataUser();
    } catch (error) {
        console.error(error);
    } finally {
    }
};
