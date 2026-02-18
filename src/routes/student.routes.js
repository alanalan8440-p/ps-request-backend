const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, studentController.getProfile);
router.get("/my-requests", authMiddleware, studentController.myRequests);
router.post("/submit", authMiddleware, studentController.submitRequest);

module.exports = router;
