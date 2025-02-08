import mongoose from "mongoose";

const courseSchema= new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title id required"],
        minLength: [4, "Title must be atleast of 4 characters"],
        maxLength: [40, "Title must be atmost of 40 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [20, "Description must be atleast of 20 characters"],
        maxLength: [1000, "Description must be atmost of 1000 characters"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures: [
        { // sice lectures is an array, each "lecture" will contain an _id in db
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Course= mongoose.model("Course", courseSchema);
export default Course;