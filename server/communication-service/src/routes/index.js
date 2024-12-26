import { Router } from "express";
import Controller from "../controllers/index.js";
import { authMiddleware, verifyAdmin } from "../middleware/index.js";

const routes = Router();

routes.post("/", authMiddleware, verifyAdmin, Controller.createProposal);
//proposal
routes.post("/proposal", authMiddleware, Controller.createProposal);
routes.put("/updateproposal", authMiddleware, Controller.updateProposal);
routes.get("/get-proposal", Controller.getProposal);
routes.get("/getproposalbyId",authMiddleware, Controller.getProposalById);
routes.delete('/deletebyId', authMiddleware,verifyAdmin, Controller.deleteProposal);
//vote
routes.get("/get-vote", Controller.getVote)
routes.post("/vote", authMiddleware, Controller.createVote);
//annoucement
routes.get("/get-annoucement", Controller.getAnnoucement)
routes.get("/getannoucebyId",authMiddleware, Controller.getAnnoucementById);
routes.post("/annoucement", authMiddleware, Controller.createAnnoucement);
routes.put("/updateannoucement", authMiddleware, Controller.updateAnnoucement);


export default routes;
