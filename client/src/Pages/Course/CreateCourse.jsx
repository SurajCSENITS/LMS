import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { creatNewCourse } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineArrowLeft } from "react-icons/ai";

const CreateCourse = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();

    const [courseDetails, setCourseDetails]= useState({
        title: "",
        category: "",
        description: "",
        createdBy: "",
        thumbnail: null,
        previewImage: ""
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadedImage= e.target.files[0];
        if(uploadedImage) {
            const fileReader= new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function() {
                setCourseDetails({
                    ...courseDetails,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                })
            })
        }
    }

    const handleUserInput = (e) => {
        const { name, value }= e.target;
        setCourseDetails({
            ...courseDetails,
            [name]: value
        });
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if(!courseDetails.title || !courseDetails.description || !courseDetails.category || !courseDetails.createdBy || !courseDetails.thumbnail) {
            toast.error("All fields are mandatory");
            return;
        }

        const res= await dispatch(creatNewCourse(courseDetails));
        if(res?.payload?.success) {
            setCourseDetails({
                title: "",
                category: "",
                description: "",
                createdBy: "",
                thumbnail: null,
                previewImage: ""
            });
            navigate("/courses");
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form 
                    onSubmit={(e) => onFormSubmit(e)}
                    noValidate
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"    
                >
                    <Link className="absolute top-8 text-2xl link text-accent cursor-pointer" onClick={() => navigate(-1)}>
                        <AiOutlineArrowLeft />
                    </Link>

                    <h1 className="text-center text-2xl font-bold">
                        Create New Course
                    </h1>

                    <main className="grid grid-cols-2 gap-x-10">
                        <div className="gap-y-6">
                            <div>
                                <label htmlFor="image_uploads" className="cursor-pointer">
                                    {courseDetails.previewImage.length>0 ? (
                                        <img
                                            className="w-full h-44 m-auto border"
                                            src={courseDetails.previewImage}
                                        />
                                    ) : (
                                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                                            <h1 className="font-bold text-lg">Upload your course thumbnail</h1>
                                        </div>
                                    )}
                                </label>
                                <input 
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    name="image_uploads"
                                    onChange={(e) => handleImageUpload(e)}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="text-lg font-semibold">
                                    Course title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter your course title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={courseDetails.title}
                                    onChange={(e) => handleUserInput(e)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="createdBy" className="text-lg font-semibold">
                                    Course instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border"
                                    value={courseDetails.createdBy}
                                    onChange={(e) => handleUserInput(e)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="category" className="text-lg font-semibold">
                                    Course category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border"
                                    value={courseDetails.category}
                                    onChange={(e) => handleUserInput(e)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="description" className="text-lg font-semibold">
                                    Course description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1 border h-24 overflow-y-scroll resize-none"
                                    value={courseDetails.description}
                                    onChange={(e) => handleUserInput(e)}
                                />
                            </div>
                        </div>
                    </main>

                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all duration-300 ease-in-out py-2 rounded-sm font-semibold text-xl cursor-pointer">
                        Create course
                    </button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default CreateCourse;