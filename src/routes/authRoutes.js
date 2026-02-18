const express = require("express");
const router = express.Router();
const {
  studentLogin,
  changeStudentPassword
} = require("../controllers/authController");

router.post("/student/login", studentLogin);
router.put("/student/change-password", changeStudentPassword);

module.exports = router;