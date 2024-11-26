import multer from "multer";
import path from "path";
import fs from "fs";

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./Images";

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Proceed with storing the file in the 'Images' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  },
});

// File filter for only image files
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

// Initialize Multer with the storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export { upload };
