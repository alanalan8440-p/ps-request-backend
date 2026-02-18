const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/student/login", authController.loginStudent);

router.put(
  "/student/change-password",
  authController.changeStudentPassword
);

module.exports = router;