import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRazorpayId, purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorpaySlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { BiRupee } from "react-icons/bi";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Checkout = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const razorpayKey= useSelector((state) => state?.razorpay?.key);
    const subscription_id= useSelector((state) => state?.razorpay?.subscription_id);
    const order_id= useSelector((state) => state.razorpay.order_id);
    const userData= useSelector((state) => state?.auth?.data);
    const paymentDetails= {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    };

    const load = async () => {
        const toastId= toast.loading("Loading...");
        await dispatch(getRazorpayId());
        await dispatch(purchaseCourseBundle());
        toast.dismiss(toastId);
    }

    const handleSubscription = async (e) => {
        e.preventDefault();
        if(!razorpayKey || !subscription_id) {
            toast.error("Something went wrong");
            return;
        }

        const options= {
            key: razorpayKey,
            subscription_id: subscription_id,
            order_id: order_id,
            name: "LMS Pvt. Ltd.",
            description: "Subscription",
            theme: {
                color: "#F37254"
            },
            prefill: {
                email: userData.email,
                name: userData.fullName
            },
            handler: async function (response) { // handler func will execute after the payment
                paymentDetails.razorpay_payment_id= response.razorpay_payment_id;
                paymentDetails.razorpay_subscription_id= response.razorpay_subscription_id;
                paymentDetails.razorpay_signature= response.razorpay_signature;

                // toast.success("Payment successfull");

                const verificationResponse= await dispatch(verifyUserPayment(paymentDetails));
                verificationResponse?.payload?.success ? navigate("/checkout/success") : navigate("/checkout/fail");
            }
        };

        const paymentObject= new window.Razorpay(options);
        paymentObject.open();
    }

    useEffect(() => {
        load();
    }, [])

    return (
        <HomeLayout>
            <form onSubmit={(e) => handleSubscription(e)} className="min-h-[90vh] flex items-center justify-center text-white">
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
                        Subscription Bundle
                    </h1>
                    <div className="px-4 space-y-5 text-center">
                        <p className="tetx-[17px]">
                            This purchase will allow you to access all available courses
                            of our platform for {" "}
                            <span className="text-yellow-500 font-bold">
                                <br />
                                1 Year duration
                            </span> {" "}
                            All existing and new launched courses will be also abvailable
                        </p>

                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                            <BiRupee /> <span>499/-</span> only
                        </p>
                        <div className="text-gray-200">
                            <p>100% refund on cancellation</p>
                            <p className="text-sm">* Terms and Condtions applied *</p>
                        </div>
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 left-0 w-full text-xl font-bold rounded-bl-lg rounded-br-lg py-2 cursor-pointer">
                            Buy Now
                        </button>
                    </div>
                </div>
            </form>
        </HomeLayout>
    )
}

export default Checkout;