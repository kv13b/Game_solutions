const express = require("express"); //keeping the master routes together
const router = express.Router();
const masterController = require("../controller/masterController.js");
router.post("/master", masterController.Clientinsert);
router.get("/", masterController.getCustomer);
router.put("/updatemaster", masterController.ClientUpdate);
module.exports = router;
