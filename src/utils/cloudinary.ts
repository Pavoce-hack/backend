import multer from "multer";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud_name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

const storage = multer.memoryStorage();

const fileFilter = (req: Request | any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });

export const cloudinaryMiddleware = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "businessLogo", maxCount: 1 },
]);

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "my-uploads" },
      (error, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null); // Signal the end of the stream

    readableStream.pipe(stream);
  });
};
