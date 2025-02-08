import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../Layouts/HomeLayout";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale , LinearScale, Title, BarElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getStatsData } from "../../Redux/Slices/StatsSlice"; 
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { BsPlayFill, BsTrash } from "react-icons/bs";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip);

const AdminDashboard = () => {
    const dispatch= useDispatch();
    const navigate= useNavigate();

    const { allUsersCount, subscribersCount }= useSelector((state) => state?.stats);
    const { allPayments, finalMonths, monthlySalesRecord }= useSelector((state) => state?.razorpay);

    const userData= {
        labels: ["Registered Users", "Enrolled Users"],
        fontColor: "white",
        datasets: [
            {
                label: "User Details",
                data: [allUsersCount, subscribersCount],
                backgroundColor: ["yellow", "green"],
                borderWidth: 1,
                borderColor: ["yellow", "green"]
            }
        ]
    };

    const salesData= {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Sales / Month",
                data: monthlySalesRecord,
                backgroundColor: ["rgb(255, 99, 132)"],
                borderColor: ["white"],
                borderWidth: 2
            }
        ]
    };

    const myCourses= useSelector((state) => state?.course?.courseData);

    async function handleCourseDelete(id) {
        if(window.confirm("Are you sure you want to delete the course ?")) {
            const res= await dispatch(deleteCourse(id));
            if(res?.payload?.success) {
                await dispatch(getAllCourses());
            }
        }
    }

    useEffect(() => {
        (
            async () => {
                await dispatch(getAllCourses());
                await dispatch(getStatsData());
                await dispatch(getPaymentRecord());
            }
        )()
        ;
    }, [])

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
                <h1 className="text-center text-5xl font-semibold text-yellow-500">
                    Admin Dashboard
                </h1>

                <div className="grid grid-cols-2 gap-5 m-auto mx-10">
                    <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                        <div className="w-80 h-80">
                            <Pie data={userData} />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold ">Registerd Users</p>
                                    <h3 className="text-4xl font-bold">{allUsersCount}</h3>
                                </div>
                                <FaUsers className="text-yellow-500 text-5xl" />
                            </div>
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold ">Subscribed Users</p>
                                    <h3 className="text-4xl font-bold">{subscribersCount}</h3>
                                </div>
                                <FaUsers className="text-green-500 text-5xl" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                        <div className="h-80 w-full relative">
                            <Bar data={salesData} className="absolute bottom-0 h-80 w-full" />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold ">Subscrition Count</p>
                                    <h3 className="text-4xl font-bold">{allPayments?.count}</h3>
                                </div>
                                <FaUsers className="text-yellow-500 text-5xl" />
                            </div>
                            <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold ">Total Revenue</p>
                                    <h3 className="text-4xl font-bold">{allPayments?.count * 499}</h3>
                                </div>
                                <GiMoneyStack className="text-green-500 text-5xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="m-[10%] w-[90%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-center text-3xl font-semibold">
                            Courses Overview
                        </h1>
                        <button 
                            onClick={() => navigate("/course/create")}
                            className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 px-4 font-semibold text-lg cursor-pointer">
                            Create new course
                        </button>
                    </div>

                    <table className="table overflow-x-scroll">
                        <thead>
                            <tr>
                                <th>S No</th>
                                <th>Course Title</th>
                                <th>Course Category</th>
                                <th>Instructor</th>
                                <th>Total Lectures</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myCourses?.map((course, idx) => {
                                return (
                                    <tr key={course._id}>
                                        <td>{idx+1}</td>
                                        <td>
                                            <span className="inline-block w-40 h-auto bg-transparent">
                                                {course?.title}
                                            </span>
                                        </td>
                                        <td>{course?.category}</td>
                                        <td>{course?.createdBy}</td>
                                        <td>{course?.numberOfLectures}</td>
                                        <td className="max-w-60 text-ellipsis">
                                            <span className="inline-block overflow-y-scroll bg-transparent h-10 scrollbar-none">
                                                {course?.description}
                                            </span>
                                        </td>
                                        <td className="flex items-center gap-4">
                                            <button 
                                                className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-semibold"
                                                onClick={() => navigate("/course/displaylectures", {state: {...course}})}
                                            >
                                                <BsPlayFill />
                                            </button>
                                            <button 
                                                className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-semibold"
                                                onClick={() => handleCourseDelete(course?._id)}
                                            >
                                                <BsTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )}
                             )}                          
                        </tbody>
                    </table>
                </div>
            </div>
        </HomeLayout>
    )
}

export default AdminDashboard;