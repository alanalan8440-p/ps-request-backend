const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===============================
   ENSURE UPLOADS FOLDER EXISTS
=============================== */

const uploadDir = path.join(__dirname, "../../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===============================
   DISK STORAGE CONFIG
=============================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

/* ===============================
   EXCEL FILTER
=============================== */

const excelFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

/* ===============================
   IMAGE FILTER
=============================== */

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/* ===============================
   EXPORTS
=============================== */

const uploadExcel = multer({
  storage,
  fileFilter: excelFilter,
});

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
});

module.exports = {
  uploadExcel,
  uploadImage,
};