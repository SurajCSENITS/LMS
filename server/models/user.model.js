import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema= new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        minLength: [5, "Name must be at least 5 charcters"],
        maxLength: [50, "Name must be atmost 50 characters"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: {
            type: String,
            default: "inactive"
        }
    }
}, { timestamps: true });

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password, 10);
})

userSchema.methods= {
    generateJWTToken: async function(){
        return await jwt.sign(
            {id: this._id, email: this.email, subscription: this.subscription, role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    },
    comparePassword: async function(givenPassword){
        return await bcrypt.compare(givenPassword, this.password);
    },
    generatePasswordResetToken: async function(){
        const resetToken= crypto.randomBytes(20).toString("hex");
        this.forgotPasswordToken= crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")
        ; // database mei important info encrypt karke rakhte hei
        this.forgotPasswordExpiry= Date.now() + 15*60*1000; // 15 mins from now
        return resetToken;
    }
}

const User= mongoose.model("User", userSchema);
export default User;