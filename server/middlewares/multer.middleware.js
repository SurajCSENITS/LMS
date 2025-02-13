import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let ext = path.extname(file.originalname).toLowerCase();
        let resource_type = "image"; // Default to image
        if ([".mp4"].includes(ext)) {
            resource_type = "video"; // Set to video for mp4 files
        }
        return {
            folder: "uploads", // Cloudinary folder name
            format: ext.slice(1), // Use file extension as format
            public_id: file.originalname.split(".")[0], // Use original filename
            resource_type: resource_type, // Set resource type
        };
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
