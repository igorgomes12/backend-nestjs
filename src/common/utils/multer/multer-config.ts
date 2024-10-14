import { diskStorage } from "multer";
import { extname } from "path";
import * as crypto from "crypto";
import { ValidationError } from "zod-validation-error";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png|gif)$/)) {
    return callback(
      new ValidationError("Only jpeg, jpg, png, gif files are allowed!"),
      false
    );
  }
  callback(null, true);
};

export const multerConfig = {
  dest: "./uploads",
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}${extname(file.originalname)}`;
      callback(null, fileName);
    },
  }),
  fileFilter: imageFileFilter,
};
