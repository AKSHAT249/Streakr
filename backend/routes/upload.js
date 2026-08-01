import express from 'express';
import upload from '../config/upload.js';
import cloudinary from '../config/cloudinary.js';

const uploadRouter = express.Router();

// uploadRouter.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
//     if (!userId) {
//       return res.status(400).json({ error: 'userId is required' });
//     }

//     // Convert buffer to base64 string
//     const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

//     // Build a unique filename: timestamp + original name (without extension issues)
//     const timestamp = Date.now();
//     const originalName = req.file.originalname.split('.')[0]; // strip extension
//     const uniqueFileName = `${timestamp}-${originalName}`;

//     // Upload into a folder named after the user
//     const result = await cloudinary.uploader.upload(base64Image, {
//       folder: `uploads/${userId}`,
//       public_id: uniqueFileName,
//     });

//     res.status(200).json({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Upload failed' });
//   }
// });

export {uploadRouter};