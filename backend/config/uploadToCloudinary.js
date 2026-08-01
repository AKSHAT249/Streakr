import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};