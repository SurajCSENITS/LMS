import { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getResetPasswordUrl } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const [userData, setUserData]= useState({
        email: ""
    });

    const handleInputChange = (e) => {
        const { name, value }= e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!userData.email) {
            toast.error("Please enter your email");
            return;
        }

        const res= await dispatch(getResetPasswordUrl(userData));
        if(res?.payload?.success) {
            setUserData({
                email: ""
            })
            navigate("/login");
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form onSubmit={(e) => handleSubmit(e)} noValidate className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Forgot Password</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input 
                            type="email"
                            required
                            id="email"
                            name="email"
                            placeholder="Enter your email..."
                            className="bg-transparent px-2 py-1 border" 
                            value={userData.email}
                            onChange={(e) => handleInputChange(e)} 
                        />
                    </div>
                    <button className="bg-sky-600 hover:bg-sky-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2" type="submit">Continue</button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default ForgotPassword;