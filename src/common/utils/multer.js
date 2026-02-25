const multer = require("multer");
const path = require("path");

/* ================= STORAGE ================= */

const storage = multer.memoryStorage();

/* ================= EXCEL UPLOAD ================= */

const uploadExcel = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files allowed"), false);
    }
  },
});

/* ================= IMAGE UPLOAD ================= */

const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

module.exports = {
  uploadExcel,
  uploadImage,
};