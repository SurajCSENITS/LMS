import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/AuthSlice.js";
import courseSliceReducer from "./Slices/CourseSlice.js";
import razorpaySliceReducer from "./Slices/RazorpaySlice.js";
import lectureSliceReducer from "./Slices/LectureSlice.js";
import statsSliceReducer from "./Slices/StatsSlice.js";

const store= configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stats: statsSliceReducer
    },
    devTools: true
});

// The `reducer` property is an object where you define the slices of state and their corresponding reducers. In this case, the `auth` slice is managed by `authSliceReducer`.
// This means that the state managed by `authSliceReducer` will be available under the auth key in the Redux state.

export default store;