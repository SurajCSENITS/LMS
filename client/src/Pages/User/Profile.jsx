import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

const Profile = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const userData= useSelector((state) => state?.auth?.data);

    const handleCancellation = async () => {
        await dispatch(cancelCourseBundle());
        await dispatch(getUserData());
        navigate("/");
    }

    return (
        <HomeLayout>
            <div className="min-h-[90vh] flex items-center justify-center">
                <div className="my-10 flex flex-col gap-4 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <img
                        src={userData?.avatar.secure_url}
                        className="w-40 m-auto rounded-full border border-black"
                    />
                    <h3 className="text-xl font-semibold text-center capitalize">
                        {userData?.fullName}
                    </h3>
                    <div className="grid grid-cols-2">
                        <p>Email: </p><p>{userData?.email}</p>
                        <p>Role: </p><p>{userData?.role}</p>
                        <p>Subscription: </p><p>{userData?.subscription?.status === "active" ? "ACTIVE" : "INACTIVE"}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Link to="/user/change-password" className="w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                            <span>Change Password</span>
                        </Link>
                        <Link to="/user/editprofile" className="w-1/2 bg-purple-600 hover:bg-purple-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                            <span>Edit Profile</span>
                        </Link>
                    </div>
                    {userData?.subscription?.status === "active" && (
                        <button onClick={handleCancellation} className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center">
                            Cancel Subscription
                        </button>
                    )}
                </div>
            </div>
        </HomeLayout>
    )
}

export default Profile;