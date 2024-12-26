import {Router} from "express";
import {verifyRoles} from "../middleware/index.js";
import curriculumController from "../controllers/curriculumController.js";

const routes = Router();
routes.post("/create-curriculum", verifyRoles(["STAFF"]), curriculumController.createCurriculum)
routes.get("/getAllCurriculum", verifyRoles(["STAFF"]), curriculumController.getAllCurriculum)

export default routes;