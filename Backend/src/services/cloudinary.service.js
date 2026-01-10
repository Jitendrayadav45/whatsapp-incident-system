const cloudinary = require("cloudinary").v2;

const hasConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

async function uploadImageBase64({ base64, mimeType }) {
  if (!hasConfig || !base64) return null;

  const dataUri = `data:${mimeType || "image/jpeg"};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: process.env.CLOUDINARY_FOLDER || "whatsapp-tickets",
    resource_type: "image"
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    format: result.format
  };
}

module.exports = { uploadImageBase64 };
