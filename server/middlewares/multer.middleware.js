import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads", // Cloudinary folder name
        allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4"], // Allowed formats
        public_id: (_req, file) => file.originalname.split(".")[0], // Use original filename
    },
});

// Initialize Multer with Cloudinary Storage
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase();
        if (![".jpg", ".jpeg", ".webp", ".png", ".mp4"].includes(ext)) {
            return cb(new Error(`Unsupported file type! ${ext}`));
        }
        cb(null, true);
    },
});

export default upload;
