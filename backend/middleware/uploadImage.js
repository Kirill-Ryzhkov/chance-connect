const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("This file is not an image"), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});

module.exports = upload;