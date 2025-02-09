import app from "./app.js";
import { config } from "dotenv";
import connetionToDB from "./config/dbConnection.js";
import cloudinary from "cloudinary";
import Razorpay from 'razorpay';

config(); // dotenv configuration
cloudinary.config({ // cloudinary configuration
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const razorpay= new Razorpay({ // razorpay configuration
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})

// Serverless function handler for Vercel
export default async (req, res) => {
    try {
        await connetionToDB(); // Ensure DB connection is successful
        app(req, res); // Forward the request to the Express app
    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ message: "Server error occurred" });
    }
};