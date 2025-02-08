// run this file as a standalone
// ``node insertCourses.js``

import mongoose from "mongoose";
import Course from "../models/course.model.js";

mongoose.set("strictQuery", false);
const connetionToDB= async () => {
    try{
        const { connection }= await mongoose.connect("mongodb+srv://Suraj:0490Mongo@projectlms.bx1xdzd.mongodb.net/lms");
        if(connection) console.log(`Connected to MongoDB: ${connection.host}`);
    } catch(err){
        console.log(err);
        process.exit(1); // kill the server
    }
}

const insertCourses = async () => {
    try {
        const courses= [
            {
                title: "JavaScript Basics",
                description: "Learn the fundamentals of JavaScript, the most popular programming language.",
                category: "Programming",
                thumbnail: {
                    public_id: "js_basics_thumbnail",
                    secure_url: "https://example.com/js_basics_thumbnail.jpg"
                },
                lectures: [
                    {
                        title: "Introduction to JavaScript",
                        description: "Overview of JavaScript and its features.",
                        lecture: {
                            public_id: "lecture_1",
                            secure_url: "https://example.com/lecture_1.jpg"
                        }
                    },
                    {
                        title: "JavaScript Variables",
                        description: "Learn about variables and data types in JavaScript.",
                        lecture: {
                            public_id: "lecture_2",
                            secure_url: "https://example.com/lecture_2.jpg"
                        }
                    }
                ],
                numberOfLectures: 2,
                createdBy: "Rajesh Paul"
            },
            {
                title: "React for Beginners",
                description: "A beginner's guide to building web applications with React.js.",
                category: "Frontend Development",
                thumbnail: {
                    public_id: "react_thumbnail",
                    secure_url: "https://example.com/react_thumbnail.jpg"
                },
                lectures: [
                    {
                        title: "Introduction to React",
                        description: "Overview of React and its key features.",
                        lecture: {
                            public_id: "react_lecture_1",
                            secure_url: "https://example.com/react_lecture_1.jpg"
                        }
                    }
                ],
                numberOfLectures: 1,
                createdBy: "Pankaj Roy"
            }
        ];

        const result= await Course.insertMany(courses);
        console.log("Courses inserted successfully:", result);
    } catch (error){
        console.error("Error inserting the courses:", error);
    }
};

// make connection to the databse containing the required model
await connetionToDB();
// run the function for insertion
insertCourses();
// Close the connection after insertion
mongoose.connection.close();