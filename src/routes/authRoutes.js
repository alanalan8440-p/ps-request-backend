const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/student/register", authController.registerStudent);
router.post("/student/login", authController.loginStudent);
router.put("/student/change-password", authController.changePassword);
module.exports = router;
