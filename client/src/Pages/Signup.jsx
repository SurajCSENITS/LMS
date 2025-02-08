import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createAccount } from "../Redux/Slices/AuthSlice.js";
import { isValidEmail, isValidPassword } from "../Helpers/regexMatcher.js";

const Signup = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();

    const [previewImage, setPreviewImage]= useState("");
    const [signupData, setSignupData]= useState({
        fullName: "",
        email: "",
        password: "",
        avatar: null
    });

    const handleInputChange = (e) => {
        const { name, value }= e.target;
        setSignupData({
            ...signupData, 
            [name]: value // passing variable as a key in an object using `[]`
        });
    }

    const getImage = (e) => {
        e.preventDefault();
        const uploadedImage= e.target.files[0];
        if(uploadedImage){
            setSignupData({
                ...signupData,
                avatar: uploadedImage
            });

            const fileReader= new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function(){
                setPreviewImage(this.result);
            });
        }
    }

    const createNewAccount = async (e) => {
        e.preventDefault();
        if(!signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar) {
            toast.error("Please fill all the details");
            return;
        }

        if(signupData.fullName.length<5) {
            toast.error("Name should be atleast of 5 characters");
            return;
        }

        if(!isValidEmail(signupData.email)) {
            toast.error("Invalid email id");
            return;
        }

        if(!isValidPassword(signupData.password)) {
            toast.error("Password should be atleast 8 characters long with atleast a number and special character");
            return;
        }

        const formData= new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);

        // disptach create account action
        // thunk returns an action object with a payload property containing the result of the asynchronous operation.
        const response= await dispatch(createAccount(formData));
        console.log(response);
        if(response?.payload?.success)
            navigate("/");
        
        setSignupData({
            fullName: "",
            email: "",
            password: "",
            avatar: ""
        });
        setPreviewImage("");
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form onSubmit={(e) => createNewAccount(e)} noValidate className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Registration Page</h1>

                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {previewImage.length>0 ? (
                            <img className="w-24 h-24 rounded-full m-auto" src={previewImage} alt="avatar" />
                        ) : (
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                        )}
                    </label>
                    <input 
                        type="file"
                        className="hidden"
                        id="image_uploads"
                        accept=".jpg, .jpeg, .png, .svg"
                        name="image_uploads"
                        onChange={(e) => getImage(e)}
                    />

                    <div className="flex flex-col gap-1">
                        <label htmlFor="fullName" className="font-semibold">Name</label>
                        <input 
                            type="text"
                            name="fullName"
                            required
                            id="fullName"
                            placeholder="Enter your name..."
                            className="bg-transparent px-2 py-1 border"
                            value={signupData.fullName}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input 
                            type="email"
                            required
                            id="email"
                            name="email"
                            placeholder="Enter your email..."
                            className="bg-transparent px-2 py-1 border" 
                            value={signupData.email}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input 
                            type="password"
                            required
                            id="password"
                            name="password"
                            placeholder="Enter your password..."
                            className="bg-transparent px-2 py-1 border" 
                            value={signupData.password}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>

                    <button className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2" type="submit">Create Account</button>

                    <p className="text-center">
                        Already have an account ? <Link to="/login" className="link text-accent cursor-pointer">Login</Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    )
}

export default Signup;