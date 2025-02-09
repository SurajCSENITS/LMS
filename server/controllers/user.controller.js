import User from "../models/user.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions= {
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
    secure: true,
};

const register = async (req, res, next) => {
    try{
        const { fullName, email, password }= req.body;
        if(!fullName || !email || !password) return next(new AppError("All fields are required", 400));

        const userExists= await User.findOne({email});
        if(userExists) return next(new AppError("Email alreday exists", 400));

        const user= await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: "https://example.com"
            }
        })

        if(!user) return next(new AppError("User registration failed, please try again", 400));

        // File upload
        console.log("File Details > ", JSON.stringify(req.file));
        if(req.file){
            try{
                const result= await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "LMS",
                    width: 250,
                    height: 250,
                    gravity: "faces",
                    crop: "fill"
                })

                if(result){
                    user.avatar.public_id= result.public_id;
                    user.avatar.secure_url= result.secure_url;
                }

                // Remove file from server
                fs.rm(`uploads/${req.file.filename}`);
            } catch(err){
                return next(new AppError(err.message || "File not uploaded, please try again", 500));
            }
        }

        await user.save(); // https://chatgpt.com/share/27a62326-5954-4168-a1b0-eb2a79258e50
        user.password= undefined;
        // login karwane ka matlab cookie attach kardo
        const token= await user.generateJWTToken();
        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch(err){
        return next(new AppError(err.message, 400));
    }
}

const login = async (req, res, next) => {
    try{
        const { email, password }= req.body;
        if(!email || !password) return next(new AppError("All fields are required", 400));
    
        const user= await User.findOne({
            email
        }).select("+password");
        if(!user || !(await user.comparePassword(password))) return next(new AppError("Email or password does not match", 400));

        const token= await user.generateJWTToken();
        user.password= undefined;
        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "User logged in succesfully",
            user,
        })
    } catch(err){
        return next(new AppError(err.message, 500));
    }
}

const logout = (req, res) => {
    try{
        res.cookie("token", null, {
            secure: true,
            maxAge: 0,
            httpOnly: true
        });
        res.status(200).json({
            success: true,
            message: "User logged out succesfully"
        })
    } catch(err){
        return next(new AppError(err.message, 400));
    }
}

const getProfile = async (req, res) => {
    try{
        const userId= req.user.id; // cookie k token se information nikal k `req` me dalna hei
        const user= await User.findById(userId);

        console.log(user);       

        res.status(200).json({
            success: true,
            message: "User details",
            user
        })
    } catch(err){
        return next(new AppError("Failed to fetch profile/user details", 500));
    }
}

// Forgot-Password flow
// Email > Validate in Database > Generate new token > Send email with new url containing token+save token with expiry in database
// Get token from url query param > Verify token in database > Update password in database  
const forgotPassword = async (req, res, next) => {
    const { email }= req.body;
    if(!email) return next(new AppError("Email is required", 400));

    const user= await User.findOne({email});
    if(!user) return next(new AppError("Email not registered", 400));

    const resetToken= await user.generatePasswordResetToken();
    await user.save();

    const resetPasswordURL= `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    const subject= "Reset Password";
    const message= `You can reset your password by clicking ${resetPasswordURL}`;
    
    try{
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to your email id ${email}`
        })  
        // log
        console.log("Reset password url > ", resetPasswordURL);
    } catch(err){
        user.forgotPasswordToken= undefined;
        user.forgotPasswordExpiry= undefined;
        await user.save();
        return next(new AppError(err.message, 500));
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { resetToken }= req.params;
        const { password }= req.body;

        const forgotPasswordToken= crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")
        ;
        const user= await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry: { $gt: Date.now() }
        })
        if(!user) return next(new AppError("Token is invalid or expired, please try again", 400));

        user.password= password;
        user.forgotPasswordToken= undefined;
        user.forgotPasswordExpiry= undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch(err) {
        return next(new AppError(err.message, 500));
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword }= req.body;
        const { id }= req.user;
        if(!oldPassword || !newPassword) return next(new AppError("All fields are mandatory", 400));

        const user= await User.findById(id).select("+password");
        if(!user) return next(new AppError("User does not exist", 400));

        const isPasswordValid= await user.comparePassword(oldPassword);
        if(!isPasswordValid) return next(new AppError("Invalid old password", 400));

        user.password= newPassword
        await user.save();
        user.password= undefined;
        
        res.status(200).json({
            success: true,
            message: "Password changed succesfully"
        })
    } catch(err) {
        return next(new AppError(err.message, 500));
    }
}

const updateUser = async (req, res, next) => {
    const { fullName }= req.body;
    const { id }= req.user;
    
    const user= await User.findById(id);
    if(!user) return next(new AppError("User does not exist", 400));

    // update 
    if(fullName) user.fullName= fullName;
    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id); // delete old profile pic
        try{
            const result= await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "LMS",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: "fill"
            })

            if(result){
                user.avatar.public_id= result.public_id;
                user.avatar.secure_url= result.secure_url;
            }

            // Remove file from server
            fs.rm(`uploads/${req.file.filename}`);
        } catch(err){
            return next(new AppError(err.message || "File not uploaded, please try again", 500));
        }
    }

    await user.save(); // save changes
    res.status(200).json({
        success: true,
        message: "User details updated successfully"
    })
}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}