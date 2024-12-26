import { Router } from "express";
import { verifyRoles } from "../middleware/index.js";
import transportationController from "../controllers/transportationController.js";
const transportationRouter = Router();

transportationRouter.post(
  "/create-transportation-service",
  verifyRoles(["STAFF"]),
  transportationController.createTransportationService
);
transportationRouter.get(
  "/get-transportation-service",
  verifyRoles(["STAFF", "DRIVER"]),
  transportationController.getTransportationService
);
transportationRouter.get(
  "/search-transportation-service",
  verifyRoles(["STAFF", "DRIVER"]),
  transportationController.searchTransportationService
);
transportationRouter.put(
  "/update-transportation-service/:id?",
  verifyRoles(["STAFF"]),
  transportationController.updateTransportationServiceById
);
transportationRouter.get(
  "/get-wait-child-transportation-service",
  verifyRoles(["STAFF"]),
  transportationController.getChildWaitTransportation
);
transportationRouter.get(
  "/get-transport-id",
  verifyRoles(["USER"]),
  transportationController.GetTransportationById
);
transportationRouter.get(
  "/get-driver-id",
  verifyRoles(["USER"]),
  transportationController.GetDriverById
);
transportationRouter.get(
  "/search-wait-child-transportation-service",
  verifyRoles(["STAFF"]),
  transportationController.searchChildWaitTransportation
);
transportationRouter.post(
  "/arrange-child-transportation-service",
  verifyRoles(["STAFF"]),
  transportationController.arrangeChildTransportation
);
transportationRouter.get(
  "/get-child-by-transportation",
  verifyRoles(["DRIVER"]),
  transportationController.getChildrenByAttendanceTransportId
);
transportationRouter.post(
  "/check-in-child-in-transportation",
  verifyRoles(["DRIVER"]),
  transportationController.checkInTransportChild
);
transportationRouter.post(
  "/check-out-child-in-transportation",
  verifyRoles(["DRIVER"]),
  transportationController.checkOutTransportChild
);
transportationRouter.get(
  "/get-child-in-transportation",
  verifyRoles(["STAFF"]),
  transportationController.getChildTransportation
);
export default transportationRouter;
