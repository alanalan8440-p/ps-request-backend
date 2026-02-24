const router = require("express").Router();
const controller = require("./auth.controller");

/* =========================================================
   STUDENT AUTH
========================================================= */

// Student Login
router.post("/student/login", controller.studentLogin);

// Student Change Password (NO TOKEN REQUIRED for first login)
router.put(
  "/student/change-password",
  controller.changeStudentPassword
);

/* =========================================================
   STAFF AUTH
========================================================= */

// Staff Login
router.post("/staff/login", controller.staffLogin);

// Staff Change Password (NO TOKEN REQUIRED for first login)
router.put(
  "/staff/change-password",
  controller.changeStaffPassword
);

module.exports = router;