const express = require("express");
const router = express.Router();
const controller = require("../controller/controller.js");

router.post("/Login", controller.Login);
router.post("/Register", controller.Register);
router.post("/GetCode", controller.getcode);
router.post("/reset-password", controller.resetpassword);
module.exports = router;
