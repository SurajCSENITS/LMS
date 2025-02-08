import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import toast from "react-hot-toast";
import axiosInstance from "../Helpers/axiosInstance";
import { isValidEmail } from "../Helpers/regexMatcher";

const Contact = () => {
    const [userInput, setUserInput]= useState({
        name: "",
        email: "",
        message: ""
    });

    function handleInputChange(e) {
        const { name, value }= e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if(!userInput.name || !userInput.email) {
            toast.error("All fields are mandatory");
            return;
        }

        if(!isValidEmail(userInput.email)) {
            console.log(userInput.email);
            
            toast.error("invalid email")
            return;
        }

        try{
            const res= axiosInstance.post("/contact", userInput);
            toast.promise(res, {
                loading: "Submitting your form...",
                success: "Form submitted successfully",
                error: "Failed to submit form"
            })

            const resolvedRes= await res;
            if(resolvedRes?.data?.success) {
                setUserInput({
                    name: "",
                    email: "",
                    message: ""
                });
            }
        } catch(err){
            toast.error("Operation failed");
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form 
                    noValidate
                    onSubmit={(e) => onFormSubmit(e)}
                    className="flex flex-col items-center justify-center gap-2 rounded-md text-white shadow-[0_0_10px_black] w-[22rem] p-2" >
                    <h1 className="text-3xl font-semibold">
                        Contact Form
                    </h1>

                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="name" className="text-xl font-semibold">
                            Name
                        </label>
                        <input 
                            type="text"
                            className="bg-transparent border px-2 py-1 rounded-sm"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={userInput.name}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="name" className="text-xl font-semibold">
                            Email
                        </label>
                        <input 
                            type="email"
                            className="bg-transparent border px-2 py-1 rounded-sm"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={userInput.email}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor="message" className="text-xl font-semibold">
                            Message
                        </label>
                        <textarea 
                            className="bg-transparent border px-2 py-1 rounded-sm resize-none h-40"
                            id="message"
                            name="message"
                            placeholder="Enter your message"
                            value={userInput.message}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>

                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-lg">
                        Submit
                    </button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default Contact;