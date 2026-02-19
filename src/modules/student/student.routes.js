const router = require("express").Router();
const controller = require("./student.controller");
const authMiddleware = require("../../common/middleware/auth.middleware");

router.get("/profile", authMiddleware, controller.getProfile);
router.get("/my-requests", authMiddleware, controller.myRequests);
router.post("/submit", authMiddleware, controller.submitRequest);

module.exports = router;
