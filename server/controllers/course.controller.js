import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"

const getAllCourses = async (req, res, next) => {
    const courses= await Course.find({}).select("-lectures");

    if(courses.length === 0){
        res.status(200).json({
            success: true,
            message: "No available courses",
        });
    } else{
        res.status(200).json({
            success: true,
            message: "All courses",
            courses,
        });
    }
}

const getLecturesByCourseId = async (req, res, next) => {
    try{
        const { id }= req.params;
        const course= await Course.findById(id);

        res.status(200).json({
            success: true,
            message: "Course lectures fetched succesfully",
            lectures: course.lectures
        })
    } catch(err){
        return next(new AppError(err.message, 500));
    }
}

const createCourse = async (req, res, next) => {
    try{
        const { title, description, category, createdBy }= req.body;
        if(!title || !description || !category || !createdBy) return next(new AppError("All fields are mandatory", 400));

        const course= await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: "Dummy",
                secure_url: "Dummy"
            }
        });
        if(!course) return next(new AppError("Course could not be created, please try again", 500));

        if(req.file){
            try{
                const result= await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "LMS",
                    width: 250,
                    height: 250,
                    crop: "fill"
                })

                if(result){
                    course.thumbnail.public_id= result.public_id;
                    course.thumbnail.secure_url= result.secure_url;
                }

                // Remove file from server
                // fs.rm(`uploads/${req.file.filename}`);
            } catch(err){
                return next(new AppError(err.message || "File not uploaded, please try again", 500));
            }
        }

        await course.save();
        res.status(200).json({
            success: true,
            message: "Course created successfully",
            course
        });
    } catch(err) {
        return next(new AppError(err.message, 400));
    }
}

const updateCourse = async (req, res, next) => {
    try{
        const { id }= req.params;
        const course= await Course.findByIdAndUpdate(
            id, {$set: req.body}, {runValidators: true}
        );

        if(!course) return next(new AppError("Course with given id does not exist", 500));

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        })
    } catch(err){
        return next(new AppError(err.message, 500));
    }
}

const removeCourse = async (req, res, next) => {
    const { id }= req.params;
    const course= await Course.findById(id);
    if(!course) return next(new AppError("Course with given id does not exist", 500));

    await Course.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Course deleted successfully"
    });
}       

const addLecturesByCourseId = async (req, res, next) => {
    const { title, description }= req.body;
    const { id }= req.params;

    const course= await Course.findById(id);
    if(!course) return next(new AppError("Course with given id does not exist", 500));

    const lectureData= {
        title,
        description,
        lecture: {
            public_id: "Dummy",
            secure_url: "Dummy"
        }
    }

    if(req.file){
        try{
            const result= await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "LMS",
                resource_type: "video"
            })

            if(result){
                lectureData.lecture.public_id= result.public_id;
                lectureData.lecture.secure_url= result.secure_url;
            }

            // Remove file from server
            fs.rm(`uploads/${req.file.filename}`);
        } catch(err){
            return next(new AppError(err.message || "File not uploaded, please try again", 500));
        }
    }

    course.lectures.push(lectureData);
    course.numberOfLectures= course.lectures.length;
    await course.save();

    res.status(200).json({
        success: true, 
        message: "Lecture added successfully",
        lectures: course.lectures
    });
}

const removeLectureFromCourse = async (req, res, next) => {
    // Grabbing the courseId and lectureId from req.query
    const { courseId, lectureId } = req.query;

    console.log(courseId);

    // Checking if both courseId and lectureId are present
    if (!courseId) {
        return next(new AppError('Course ID is required', 400));
    }

    if (!lectureId) {
        return next(new AppError('Lecture ID is required', 400));
    }

    // Find the course uding the courseId
    const course = await Course.findById(courseId);

    // If no course send custom message
    if (!course) {
        return next(new AppError('Invalid ID or Course does not exist.', 404));
    }

    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
    );

    // If returned index is -1 then send error as mentioned below
    if (lectureIndex === -1) {
        return next(new AppError('Lecture does not exist.', 404));
    }

    // Delete the lecture from cloudinary
    await cloudinary.v2.uploader.destroy(
        course.lectures[lectureIndex].lecture.public_id,
        {
        resource_type: 'video',
        }
    );

    // Remove the lecture from the array
    course.lectures.splice(lectureIndex, 1);

    // update the number of lectures based on lectres array length
    course.numberOfLectures = course.lectures.length;

    // Save the course object
    await course.save();

    // Return response
    res.status(200).json({
        success: true,
        message: 'Course lecture removed successfully',
    })
}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLecturesByCourseId,
    removeLectureFromCourse
}