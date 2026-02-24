const multer = require("multer");

/* ================= STORAGE ================= */

const storage = multer.memoryStorage();

/* ================= EXCEL FILTER ================= */

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("sheet") ||
    file.mimetype.includes("excel")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

/* ================= IMAGE FILTER ================= */

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/* ================= EXPORTS ================= */

exports.uploadExcel = multer({
  storage,
  fileFilter: excelFilter,
});

exports.uploadImage = multer({
  storage,
  fileFilter: imageFilter,
});