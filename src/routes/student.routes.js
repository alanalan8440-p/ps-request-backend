const express = require("express");
const router = express.Router();

const prisma = require("../config/prisma");
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/*
|--------------------------------------------------------------------------
| GET MY REQUESTS
|--------------------------------------------------------------------------
*/
router.get(
  "/my-requests",
  authMiddleware,
  studentController.myRequests
);

/*
|--------------------------------------------------------------------------
| SUBMIT REQUEST (STUDENT ONLY)
|--------------------------------------------------------------------------
*/
router.post(
  "/submit",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.submitRequest
);

/*
|--------------------------------------------------------------------------
| GET STUDENT PROFILE
|--------------------------------------------------------------------------
*/
router.get(
  "/profile",
  authMiddleware,
  studentController.getProfile
);

/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS (TEST)
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

module.exports = router;
