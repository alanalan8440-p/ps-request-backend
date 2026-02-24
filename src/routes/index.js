const router = require("express").Router();

/* =========================================================
   AUTH ROUTES
   /api/auth/...
========================================================= */
router.use("/auth", require("../modules/auth/auth.routes"));

/* =========================================================
   STUDENT ROUTES
   /api/students/...
========================================================= */
router.use("/students", require("../modules/student/student.routes"));

/* =========================================================
   STAFF ROUTES
   /api/staff/...
========================================================= */
router.use("/staff", require("../modules/staff/staff.routes"));

module.exports = router;