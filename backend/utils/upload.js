import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const uploadsRoot = path.resolve("uploads");
ensureDir(uploadsRoot);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let sub = "files";
        if (file.fieldname === "images") sub = "images";
        const dest = path.join(uploadsRoot, sub);
        ensureDir(dest);
        cb(null, dest);
    },
    // filename: (req, file, cb) => {
    //     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //     const ext = path.extname(file.originalname);
    //     cb(null, unique + ext);
    // },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "_");
        cb(null, safeName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedDocs = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const allowedImages = ["image/jpeg", "image/png", "image/webp"]; // 4 images

    if (file.fieldname === "file") {
        if (allowedDocs.includes(file.mimetype)) return cb(null, true);
        return cb(new Error("Unsupported document type"));
    }
    if (file.fieldname === "images") {
        if (allowedImages.includes(file.mimetype)) return cb(null, true);
        return cb(new Error("Unsupported image type"));
    }
    return cb(new Error("Invalid field"));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });
