import HomeLayout from "../Layouts/HomeLayout";
import aboutMainImage from "../Assets/Images/aboutMainImage.png";
import apj from "../Assets/Images/apj.png";
import billGates from "../Assets/Images/billGates.png";
import einstein from "../Assets/Images/einstein.png";
import nelsonMandela from "../Assets/Images/nelsonMandela.png";
import steveJobs from "../Assets/Images/steveJobs.png";

const AboutUs = () => {
    const slides= [apj, billGates, einstein, nelsonMandela, steveJobs];
    const quotes= [
        "Failure will never overtake me if my determination to succeed is strong enough.",
        "It's fine to celebrate success, but it is more important to heed the lessons of failure.",
        "Imagination is more important than knowledge. Knowledge is limited; imagination encircles the world.",
        "Education is the most powerful weapon which you can use to change the world.",
        "We're here to put a dent in the universe. Otherwise why else even be here?"
    ];

    return (
        <HomeLayout>
            <div className="pl-20 pt-20 flex flex-col text-white">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl text-yellow-500 font-semibold">
                            Affordable and quality education
                        </h1>
                        <p className="text-xl text-gray-200">
                            At our institution, we believe that education should be accessible to everyone, regardless of
                            their background or financial situation. Our mission is to provide high-quality education at
                            an affordable price, ensuring that all students have the opportunity to succeed. We offer a
                            wide range of courses and programs designed to meet the needs of today's learners, with flexible
                            scheduling and personalized support. Join us and take the first step towards a brighter future with
                            an education that empowers you to achieve your goals and make a positive impact in the world.
                        </p>
                    </section>

                    <div className="w-1/2">
                        <img src={aboutMainImage} alt="about-main-image" id="test1" style={{ filter: "drop-shadow(0px 10px 10px rgb(0, 0, 0))" }} className="drop-shadow-2xl" />
                    </div>
                </div>

                <div className="carousel rounded-box w-64 self-center mt-20 mb-10 space-x-5 drop-shadow-2xl">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`carousel-item w-full flex flex-col items-center text-center`}
                        >
                            <img src={slide} className="w-full" alt={`Slide ${index + 1}`} />
                            <p>{quotes[index]}</p>
                            <div className="flex w-full justify-center gap-2 py-2 mb-10">
                                <span className="btn btn-xs cursor-default">{index+1}/{slides.length}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </HomeLayout>
    );
};

export default AboutUs;