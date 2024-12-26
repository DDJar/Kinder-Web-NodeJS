import { Router } from "express";
import Controller from "../controllers/academyController.js";
import {
  authMiddleware,
  verifyAdmin,
  verifyRoles,
} from "../middleware/index.js";

const routes = Router();

routes.post("/create", authMiddleware, Controller.createAcademy);
// routes.post("/", Controller.createAcademy);

routes.post("/class", authMiddleware, Controller.createAcademy);
routes.post("/category", authMiddleware, Controller.createCategory);
routes.get("/get-category", Controller.getAllCategory);
routes.get("/get-class", Controller.getClass);
routes.get("/get-skill", Controller.getSkill);
routes.get(
  "/get-adcademy-by-id",
  verifyRoles(["STAFF"]),
  Controller.getAcademyById
);
routes.get("/get-adcademy", verifyRoles(["STAFF"]), Controller.getAcademy);
routes.get(
  "/search-adcademy",
  verifyRoles(["STAFF"]),
  Controller.searchAcademy
);
routes.put(
  "/update-adcademy-by-id/:id?",
  verifyRoles(["STAFF"]),
  Controller.updateAcademyById
);
routes.get(
  "/get-classes-by-teacher",
  verifyRoles(["TEACHER"]),
  Controller.getClassesByTeacher
);
routes.get(
  "/get-skilles-by-teacher",
  verifyRoles(["TEACHER"]),
  Controller.getSkilessByTeacher
);
//routes.get('/get-child-by-classes', authMiddleware, Controller.getChildrenByClassId);
//routes.get("/get-list", Controller.getList);

export default routes;
