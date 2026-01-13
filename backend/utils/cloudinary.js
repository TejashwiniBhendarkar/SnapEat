import dotenv from "dotenv"
dotenv.config()

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// ✅ Configure ONCE (not per request)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "shops",
    });

    // ✅ delete local file ONLY if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // ✅ safe cleanup
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error; // 🔥 IMPORTANT: let controller handle error
  }
};

export default uploadOnCloudinary;

// import { v2 as cloudinary } from 'cloudinary'
// import fs from "fs"
// const uploadOnCloudinary = async (file) => {
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     });
//     try {
//         const result = await cloudinary.uploader.upload(file)
//         fs.unlinkSync(file)  //to delete from public folder
//         return result.secure_url
//     } catch (error) {
//         fs.unlinkSync(file)
//         console.log(error)
//     }
// }

// export default uploadOnCloudinary