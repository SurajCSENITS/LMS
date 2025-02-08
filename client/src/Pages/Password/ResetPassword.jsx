import { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const { token }= useParams();

    const [userData, setUserData]= useState({
        password: ""
    });

    function handleInputChange(e) {
        const { name, value }= e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(!userData.password) {
            toast.error("Please enter your new password");
            return;
        }

        const res= await dispatch(resetPassword({token: token, data: userData}));
        if(res?.payload?.success) {
            setUserData({
                password: ""
            });
            navigate("/login");
        } else {
            toast.error("Please try again...");
            navigate("/forgot-password");
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form onSubmit={(e) => handleSubmit(e)} noValidate className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Reset Password</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input 
                            type="password"
                            required
                            id="password"
                            name="password"
                            placeholder="Enter your new password..."
                            className="bg-transparent px-2 py-1 border" 
                            value={userData.password}
                            onChange={(e) => handleInputChange(e)} 
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2" type="submit">Confirm</button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default ResetPassword;