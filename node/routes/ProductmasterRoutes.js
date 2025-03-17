const express = require("express"); //keeping the master routes together
const router = express.Router();
const masterController = require("../controller/ProductmasterController.js");

router.post("/Productinsert", masterController.Productinsert);
router.get("/getProduct", masterController.getProduct);
router.put("/ProductUpdate", masterController.ProductUpdate);
module.exports = router;
