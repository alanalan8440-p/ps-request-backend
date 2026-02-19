const router = require("express").Router();
const controller = require("./auth.controller");
const authMiddleware = require("../../common/middleware/auth.middleware");

router.post("/student/login", controller.studentLogin);
router.put("/student/change-password", authMiddleware, controller.changeStudentPassword);

module.exports = router;
