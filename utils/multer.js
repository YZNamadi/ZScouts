const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); 

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ZScouts", 
        allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi"],
        resource_type: "auto", // Automatically detect if the file is an image or video
    },
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file format. Only images and videos are allowed."), false);
    }
};

// File upload limits (5MB per file)
const limits = {
    fileSize: 1024 * 1024 * 5, 
};

// Set up multer with Cloudinary storage
const upload = multer({
    storage,
    fileFilter,
    limits,
});

module.exports = upload;
