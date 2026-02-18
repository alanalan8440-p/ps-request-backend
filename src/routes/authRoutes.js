const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// STUDENT LOGIN
router.post("/student/login", authController.loginStudent);

// CHANGE PASSWORD
router.put("/student/change-password", authController.changePassword);

module.exports = router;