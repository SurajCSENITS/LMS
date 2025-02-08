import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../Redux/Slices/AuthSlice";

const Login = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();

    const [loginData, setLoginData]= useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value }= e.target;
        setLoginData({
            ...loginData, 
            [name]: value // passing variable as a key in an object using `[]`
        });
    }

    const onLogin = async (e) => {
        e.preventDefault();
        if(!loginData.email || !loginData.password){
            toast.error("Please fill all the details");
            return;
        }

        // disptach create account action
        // thunk returns an action object with a payload property containing the result of the asynchronous operation.
        const response= await dispatch(login(loginData));
        console.log(response); // log the response
        if(response?.payload?.success){
            navigate("/");
            setLoginData({
                email: "",
                password: ""
            });
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form onSubmit={(e) => onLogin(e)} noValidate className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Login here</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input 
                            type="email"
                            required
                            id="email"
                            name="email"
                            placeholder="Enter your email..."
                            className="bg-transparent px-2 py-1 border" 
                            value={loginData.email}
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
                            value={loginData.password}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <p className="text-left">
                        <Link to="/forgot-password" className="link text-accent no-underline cursor-pointer">Forgot Password ?</Link>
                    </p>

                    <button className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2" type="submit">Login</button>

                    <p className="text-center">
                        Donot have an account ? <Link to="/signup" className="link text-accent cursor-pointer">Signup</Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    )
}

export default Login;