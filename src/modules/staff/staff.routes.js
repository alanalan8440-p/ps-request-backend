const router = require("express").Router();
const controller = require("./staff.controller");
const auth = require("../../common/middleware/auth.middleware");
const role = require("../../common/middleware/role.middleware");

router.post("/login", controller.login);
router.get("/requests", auth, role("ADMIN", "OFFICER"), controller.getAllRequests);

module.exports = router;
