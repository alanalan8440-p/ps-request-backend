const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const staffController = require("../controllers/staffController");

router.post("/login", staffController.login);

router.get(
  "/requests",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  staffController.getAllRequests
);

router.put(
  "/request/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  staffController.updateRequestStatus
);

router.delete(
  "/request/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  staffController.softDeleteRequest
);

router.get(
  "/request/:id/history",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  staffController.getRequestHistory
);

module.exports = router;
