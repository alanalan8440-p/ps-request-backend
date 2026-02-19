const express = require("express");
const router = express.Router();

const {
  studentLogin,
  changeStudentPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/student/login", studentLogin);
router.put("/student/change-password", authMiddleware, changeStudentPassword);

module.exports = router;
