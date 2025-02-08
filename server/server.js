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

const PORT= process.env.PORT;
app.listen(PORT, async () => {
    await connetionToDB();
    console.log(`App is runnig at http://localhost:${PORT}`);
})