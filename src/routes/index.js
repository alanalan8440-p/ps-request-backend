const router = require("express").Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/students", require("../modules/student/student.routes"));
router.use("/staff", require("../modules/staff/staff.routes"));

module.exports = router;
