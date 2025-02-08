import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoute from "./routes/user.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import courseRouter from "./routes/course.route.js";
import paymentRouter from "./routes/payment.route.js";
import miscRouter from "./routes/miscellaneous.route.js";
import { config } from "dotenv";

const app= express();
config();

app.use(express.json());
app.use(cors({
    origin: "https://lms-client-henna.vercel.app",
    credentials: true
}));
app.use(cookieParser());
app.use(morgan("dev")); // logger middleware 
app.use(express.urlencoded({ extended: true }));

app.use("/ping", function(req, res){
    res.send("Pong");
})

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payments", paymentRouter);
app.use('/api/v1', miscRouter);

app.all("*", function(req, res){
    res.status(404).send("OOPS!! 404 page not found");
})

app.use(errorMiddleware);

export default app;
