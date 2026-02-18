const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/* STUDENT LOGIN */
router.post("/student/login", authController.loginStudent);

/* SET PASSWORD (FIRST LOGIN) */
router.post("/student/set-password", authController.setStudentPassword);

module.exports = router;