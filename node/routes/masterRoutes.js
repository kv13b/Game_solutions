import express from "express"; //keeping the master routes together
const router = express.Router();
import masterController from "../controller/masterController.js";
router.post("/master", masterController.Clientinsert);
router.get("/", masterController.getCustomer);
router.put("/updatemaster", masterController.ClientUpdate);
export default router;
