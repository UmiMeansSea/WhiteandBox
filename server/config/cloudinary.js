import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary using streams.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {String} folder - The Cloudinary folder to upload to.
 * @param {String} resourceType - 'image', 'video', or 'raw'.
 * @returns {Promise<Object>} Cloudinary upload result.
 */
export const uploadFromBuffer = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: resourceType },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default cloudinary;
