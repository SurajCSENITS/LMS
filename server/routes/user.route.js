import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/user.controller.js";
import { isLoggedIn }from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter= Router();

userRouter.post("/register", upload.single("avatar"), register); // "upload" : check karega agar req form-data k form me h and `avatar` key me binary data h to use image file me convert karke de dega | We can give any name to this `avatar` key, it is different from the "avatar" parameter in our schema
userRouter.post("/login", login);
userRouter.get("/logout", isLoggedIn, logout);
userRouter.get("/me", isLoggedIn, getProfile);
userRouter.post("/reset", forgotPassword);
userRouter.post("/reset/:resetToken", resetPassword);
userRouter.post("/change-password", isLoggedIn, changePassword);
userRouter.put("/update", isLoggedIn, upload.single("avatar"), updateUser)
 
export default userRouter;