const router = require("express").Router();
const controller = require("./staff.controller");
const authMiddleware = require("../../common/middleware/auth.middleware");
const role = require("../../common/middleware/role.middleware");

/* =========================================================
   STAFF AUTH
========================================================= */

router.post("/login", controller.login);
router.put("/change-password", controller.changePassword);

/* =========================================================
   REQUEST MANAGEMENT (STAFF / ADMIN)
========================================================= */

router.get(
  "/requests",
  authMiddleware,
  role("staff", "admin"),
  controller.getAllRequests
);

router.put(
  "/requests/:id/status",
  authMiddleware,
  role("staff", "admin"),
  controller.updateRequestStatus
);

router.delete(
  "/requests/:id",
  authMiddleware,
  role("staff", "admin"),
  controller.softDeleteRequest
);

router.get(
  "/requests/:id",
  authMiddleware,
  role("staff", "admin"),
  controller.getRequestHistory
);

module.exports = router;