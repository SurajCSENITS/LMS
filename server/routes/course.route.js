import { Router } from "express";
import { addLecturesByCourseId, createCourse, getAllCourses, getLecturesByCourseId, removeCourse, removeLectureFromCourse, updateCourse } from "../controllers/course.controller.js";
import { isLoggedIn, authorizeRoles, authorizeSubscriber } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const courseRouter= Router();

courseRouter.route("/")
    .get(getAllCourses)
    .post(isLoggedIn, authorizeRoles("ADMIN"), upload.single("thumbnail"), createCourse)
    .delete(isLoggedIn, authorizeRoles("ADMIN"), removeLectureFromCourse);
    
courseRouter.route("/:id")
    .get(isLoggedIn, authorizeSubscriber, getLecturesByCourseId)
    .put(isLoggedIn, authorizeRoles("ADMIN"), updateCourse)
    .delete(isLoggedIn, authorizeRoles("ADMIN"), removeCourse)
    .post(isLoggedIn, authorizeRoles("ADMIN"), upload.single("lecture"), addLecturesByCourseId);

export default courseRouter;
