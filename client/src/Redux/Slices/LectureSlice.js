import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState= {
    lectures: []
};

export const getCourseLectures = createAsyncThunk("/course/lectures/get", async (course_id) => {
    try {
        const res= axiosInstance.get(`/course/${course_id}`);
        toast.promise(res, {
            loading: "Fetching course lectures",
            success: "Lectures fetched successfully",
            error: "Failed to load the lectures"
        })

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const addCourseLectures = createAsyncThunk("/course/lectures/add", async (data) => {
    try {
        const formData= new FormData();
        formData.append("lecture", data.lecture);
        formData.append("title", data.title);
        formData.append("description", data.description);

        const res= axiosInstance.post(`/course/${data.id}`, formData);
        toast.promise(res, {
            loading: "Adding lecture to the course",
            success: "Lecture added successfully",
            error: "Failed to add the lecture"
        })

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

export const deleteCourseLectures = createAsyncThunk("/course/lectures/delete", async (data) => {
    try {
        const res= axiosInstance.delete(`/course?courseId=${data.courseId}&lectureId=${data.lectureId}`);
        toast.promise(res, {
            loading: "Deleting course lecture",
            success: "Lecture deleted successfully",
            error: "Failed to delete the lecture"
        })

        return (await res).data;
    } catch(err) {
        toast.error(err?.response?.data?.message);
    }
})

const lectureSlice= createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getCourseLectures.fulfilled, (state, action) => {
            state.lectures= action?.payload?.lectures;
        }) 
        .addCase(addCourseLectures.fulfilled, (state, action) => {
            state.lectures= action?.payload?.lectures;
        })
    }
})

export default lectureSlice.reducer;