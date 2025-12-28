import { ENV } from "./env.js";
import { v2 as cloudinary } from "cloudinary";

const requiredVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredVars.forEach((varName) => {
  if (!ENV[varName]) {
    console.error(`Error: Missing required environment variable ${varName}`);
    process.exit(1);
  }
});

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;
