import { error } from "console";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";

const getRazorpayApiKey = (req, res, next) => {
    try{
        res.status(200).json({
            success: true,
            message: "Razorpay API key",
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch(err){
        return next(new AppError(err.message, 400));
    }
}

const buySubscription = async (req, res, next) => {  
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (!user) return next(new AppError("Unauthorized, please login", 500));
        if (user.role === "ADMIN") return next(new AppError("Admin cannot purchase a subscription", 400));

        // Step 1: Create Subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID, 
            customer_notify: 1,
            total_count: 12,
        });

        // Step 2: Create an Order for the Subscription
        const order = await razorpay.orders.create({
            amount: 100,  // Amount in paise (₹1)
            currency: "INR",
            receipt: `receipt_${subscription.id}`, // Unique receipt tied to subscription
            notes: {
                subscription_id: subscription.id, // Store subscription ID in order notes
            }
        });

        // Step 3: Store Subscription Data in User Model
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();

        // Step 4: Send Response with Subscription and Order Details
        res.status(200).json({
            success: true,
            message: "Subscribed successfully, verification pending",
            subscription_id: subscription.id,
            order_id: order.id // Sending order_id along with subscription_id
        });

    } catch (err) {
        return next(new AppError(err.message, 400));
    }
}

const verifySubscription = async (req, res, next) => { // after re-direction verify the payment
    try{
        const { id }= req.user;
        const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id }= req.body;
        // For unsuccessful payments: Razorpay may still generate a razorpay_payment_id for the payment attempt, but it will not represent a successful transaction.
        // For unsuccessful payments: Razorpay does not generate a signature for failed payments. The razorpay_signature will be undefined or not sent in the response.
        
        const user= await User.findById(id);
        if(!user) return next(new AppError("Unauthorized, please login", 500));

        const subscriptionId= user.subscription.id;

        const generatedSignature= crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${subscriptionId}`)
            .digest("hex")
        ;

        if(generatedSignature !== razorpay_signature)
            return next(new AppError("Payment not verified, please try again", 500));
        
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });

        user.subscription.status= "active";
        await user.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });
    } catch(err){
        return next(new AppError(err.message, 400));
    }
}

const cancelSubscription = async (req, res, next) => {
    try{
        const { id }= req.user;
        const user= await User.findById(id);

        if(!user) return next(new AppError("Unauthorized, please login", 500));
        if(user.role === "ADMIN") return next(new AppError("Admin cannot unsubscribe", 400));

        const subscriptionId= user.subscription.id;

        const subscription= await razorpay.subscriptions.cancel(
            subscriptionId
        );

        user.subscription.status= subscription.status;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Unsubscribed successfully"
        })
    } catch(err){
        return next(new AppError(err.message, 500));
    }
}

const allPayments = async (req, res, next) => {
    const { count, skip }= req.query;

    // Find all subscriptions from razorpay
    const allPayments= await razorpay.subscriptions.all({
        count: count || 10, // If count is sent then use that else default to 10
        skip: skip || 0, // // If skip is sent then use that else default to 0
    });

    const monthNames= [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const finalMonths= {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    };

    const monthlyWisePayments= allPayments.items.map((payment) => {
        // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
        const date= new Date(payment.start_at * 1000);

        return monthNames[date.getMonth()];
    });

    monthlyWisePayments.map((month) => {
        Object.keys(finalMonths).forEach((objMonth) => {
            if(month === objMonth) {
                finalMonths[month]+= 1;
            }
        });
    });

    const monthlySalesRecord= [];

    Object.keys(finalMonths).forEach((monthName) => {
        monthlySalesRecord.push(finalMonths[monthName]);
    });

    res.status(200).json({
        success: true,
        message: 'All payments',
        allPayments,
        finalMonths,
        monthlySalesRecord,
    });
}

export {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
}