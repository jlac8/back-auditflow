// src/middlewares/upload.middleware.ts
import multer from "multer";
import path from "path";

// Configuración de multer para guardar archivos en la carpeta "uploads"
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Conservar la extensión original
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });
