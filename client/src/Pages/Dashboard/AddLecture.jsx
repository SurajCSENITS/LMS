import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

const AddLecture = () => {
    const courseDetails= useLocation()?.state;
    const dispatch= useDispatch();
    const navigate= useNavigate();

    const [userInput, setUserInput]= useState({
        id: courseDetails._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: ""
    });

    const handleInputChange = (e) => {
        const { name, value }= e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    const handleVideoUpload = (e) => {
        const video= e.target.files[0];
        const source= window.URL.createObjectURL(video);
        setUserInput({
            ...userInput,
            lecture: video,
            videoSrc: source
        })
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if(!userInput.lecture || !userInput.title || !userInput.description) {
            toast.error("All fields are mandatory");
            return;
        }

        const response= await dispatch(addCourseLectures(userInput));
        if(response?.payload?.success) {
            navigate(-1, {state: courseDetails});
            setUserInput({
                id: courseDetails._id,
                lecture: undefined,
                title: "",
                description: "",
                videoSrc: ""
            })
        }
    }

    useEffect(() => {
        if(!courseDetails) navigate("/courses");
    }, [])

    return (
        <HomeLayout>
            <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
                <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
                    <header className="flex items-center justify-center relative">
                        <button className="absolute left-2 text-xl text-green-500 hover:text-green-800 transition-all duration-100 cursor-pointer" onClick={() => navigate(-1)}>
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className="text-xl text-yellow-500 font-semibold">
                            Add new lecture
                        </h1>
                    </header>
                    <form onSubmit={(e) => onFormSubmit(e)} className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            name="title"
                            placeholder="Enter the title of the lecture"
                            onChange={(e) => handleInputChange(e)}
                            className="bg-transparent px-3 py-1 border"
                            value={userInput.title}
                        />
                        <textarea 
                            name="description"
                            placeholder="Enter the description of the lecture"
                            onChange={(e) => handleInputChange(e)}
                            className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
                            value={userInput.description}
                        />

                        {userInput.videoSrc ? (
                            <video
                                src={userInput.videoSrc}
                                muted
                                controls
                                controlsList="nodownload nofullscreen"
                                disablePictureInPicture
                                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                            />
                        ) : (
                            <div className="h-48 border">
                                <label htmlFor="lecture" className="w-full h-full flex items-center justify-center font-semibold text-xl cursor-pointer">Choose your video</label>
                                <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleVideoUpload} accept="video/mp4 video/x-mp4 video/*" />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-xl">
                            Add new lecture
                        </button>
                    </form>
                </div>
            </div>
        </HomeLayout>
    )
}

export default AddLecture;