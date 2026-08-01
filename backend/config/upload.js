import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
import { getAuth } from "@clerk/express"; // adjust to your actual Clerk package

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const { userId } = getAuth(req);

    const originalName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "-");

    const timestamp = Date.now();
    const publicId = `${originalName}-${timestamp}`;

    return {
      folder: `tasktly/${userId}`,
      public_id: publicId,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{
        width: 1200,       // bump up a bit if proofs need more detail
        height: 1200,
        crop: "limit",
        quality: "auto:good", // smart compression, keeps visual quality high
        fetch_format: "auto", // serves WebP/AVIF automatically when supported
      },],
    };
  },
});

const upload = multer({ storage });

export default upload;