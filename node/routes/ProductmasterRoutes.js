import express from "express"; //keeping the master routes together
const router = express.Router();
import masterController from "../controller/ProductmasterController.js";
router.post("/Productinsert", masterController.Productinsert);
router.get("/getProduct", masterController.getProduct);
router.put("/ProductUpdate", masterController.ProductUpdate);
export default router;