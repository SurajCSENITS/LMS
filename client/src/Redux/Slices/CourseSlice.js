import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState= {
    courseData: []
};

export const getAllCourses= createAsyncThunk("/course/get", async () => {
    try{
        const res= axiosInstance.get("/course");
        toast.promise(res, {
            loading: "Loading course data...",
            success: "Courses loaded successfully",
            error: "Failed to load courses"
        });

        return (await res).data.courses;
    } catch(err){
        toast.error(err?.response?.data?.message);
    }
})

export const creatNewCourse= createAsyncThunk("/course/create", async (data) => {
    try {
        let formData= new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("createdBy", data.createdBy);
        formData.append("category", data.category);
        formData.append("thumbnail", data.thumbnail);

        const res= axiosInstance.post("/course", formData);
        toast.promise(res, {
            loading: "Creating new course...",
            success: "Course created successfully",
            error: "Failed to create course"
        });

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const deleteCourse= createAsyncThunk("/course/delete", async (id) => {
    try {
        const res= axiosInstance.delete(`/course/${id}`);
        toast.promise(res, {
            loading: "Deleting course...",
            success: "Course deleted successfully",
            error: "Failed to delete course"
        });

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

const courseSlice= createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllCourses.fulfilled, (state, action) => {
            if(action.payload)
                state.courseData= [...action.payload];
        })
    }
})

export const {}= courseSlice.actions;
export default courseSlice.reducer;