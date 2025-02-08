import { useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword } from "../../Redux/Slices/AuthSlice";

const ChangePassword = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const [userData, setUserData]= useState({
        oldPassword: "",
        newPassword: ""
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
        if(!userData.oldPassword || !userData.newPassword) {
            toast.error("Please enter all the fields");
            return;
        }

        const res= await dispatch(changePassword(userData));
        if(res?.payload?.success) {
            setUserData({
                oldPassword: "",
                newPassword: ""
            });
            navigate(-1);
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form onSubmit={(e) => handleSubmit(e)} noValidate className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Change Password</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="oldPassword" className="font-semibold">Old Password</label>
                        <input 
                            type="password"
                            required
                            id="oldPassword"
                            name="oldPassword"
                            placeholder="Enter your old password..."
                            className="bg-transparent px-2 py-1 border" 
                            value={userData.oldPassword}
                            onChange={(e) => handleInputChange(e)} 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="newPassword" className="font-semibold">New Password</label>
                        <input 
                            type="password"
                            required
                            id="newPassword"
                            name="newPassword"
                            placeholder="Enter your new password..."
                            className="bg-transparent px-2 py-1 border" 
                            value={userData.newPassword}
                            onChange={(e) => handleInputChange(e)} 
                        />
                    </div>
                    <button className="bg-sky-600 hover:bg-sky-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2" type="submit">Confirm</button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default ChangePassword;