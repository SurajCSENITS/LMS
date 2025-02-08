import { Router } from "express";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/payment.controller.js";

const paymentRouter= Router();

paymentRouter
    .route("/razorpay-key")
    .get(isLoggedIn, getRazorpayApiKey);

paymentRouter
    .route("/subscribe")
    .post(isLoggedIn, buySubscription);

paymentRouter
    .route("/verify")
    .post(isLoggedIn, verifySubscription);

paymentRouter
    .route("/unsubscribe")
    .post(isLoggedIn, cancelSubscription);

paymentRouter
    .route("/")
    .get(isLoggedIn, authorizeRoles("ADMIN"), allPayments);

export default paymentRouter;