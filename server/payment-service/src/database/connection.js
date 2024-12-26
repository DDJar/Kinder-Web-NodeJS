import mongoose from "mongoose";
import config from "../config/config.js";
import initDatabaseInitBusiness from "../business/initDatabaseInitBusiness.js";

export const connectDB = async () => {
    try {
        console.info("Connecting to database..." + config.MONGO_URI);
        await mongoose.connect(config.MONGO_URI);
        console.info("Database connected");

        await initDatabaseInitBusiness.handleInitDataUser()
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
