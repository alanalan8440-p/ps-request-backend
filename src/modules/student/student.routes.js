const router = require("express").Router();
const controller = require("./student.controller");
const authMiddleware = require("../../common/middleware/auth.middleware");
const role = require("../../common/middleware/role.middleware");

// ✅ Import specific upload middlewares
const { uploadExcel, uploadImage } = require("../../common/utils/multer");

/* =========================================================
   STUDENT ROUTES
========================================================= */

// Get Profile
router.get(
  "/profile",
  authMiddleware,
  role("student"),
  controller.getProfile
);

// Get My Requests
router.get(
  "/my-requests",
  authMiddleware,
  role("student"),
  controller.myRequests
);

// Submit OD / LEAVE (Image proof)
router.post(
  "/submit",
  authMiddleware,
  role("student"),
  uploadImage.single("proof"),   // ✅ Image only
  controller.submitRequest
);

/* =========================================================
   BULK UPLOAD (STAFF ONLY - Excel)
========================================================= */

router.post(
  "/bulk-upload",
  authMiddleware,
  role("staff", "admin"),
  uploadExcel.single("file"),   // ✅ Excel only
  controller.bulkUploadStudents
);

module.exports = router;