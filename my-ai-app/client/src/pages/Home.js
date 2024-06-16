
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useState, useRef,useEffect } from "react";
import {Link} from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from "react-toastify";



export default function Home() {


    const scrollRef = useRef(0); // Explicitly define the type of scrollRef



    const scrollLeft = () => {
        if (scrollRef.current) {
            (scrollRef.current).scrollBy({
                left: -290, // Adjust the scroll distance as needed
                behavior: 'smooth', // Use smooth scrolling behavior
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            (scrollRef.current).scrollBy({
                left: 200, // Adjust the scroll distance as needed
                behavior: 'smooth', // Use smooth scrolling behavior
            });
        }
    };
    const [activeComponent, setActiveComponent ] = useState("guide")



    const allTrainer = useQuery({
        queryKey: ["trainers"],
        queryFn: () => axiosInstance.get("/get-all-trainers")
    });

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = currentUser?.data?.data?.success;

    const allProducts = useQuery({
        queryKey: ["allProducts"],
        queryFn: () => axiosInstance.get("/get-all-products")
    });

    const products = allProducts?.data?.data?.products


    const renderComponent = () => {
        switch (activeComponent) {
            case 'guide':
                return <GuideText user={user} />;
            case "trainers":
                return <OurTrainers trainers={allTrainer} />

            default:
                return null;
        }   
    };

    const [containerWidth, setContainerWidth] = useState(null);
    useEffect(() => {
        // Calculate total width of all items
        if (scrollRef.current) {
            const totalWidth = scrollRef.current.scrollWidth;
            setContainerWidth(totalWidth);
        }
    }, [products?.specialProducts]);
    


    return (
        <div className="flex bg-slate-950 w-screen text-white flex-col">
            <div className="w-full mt-16  md:mt-0 relative flex">
                <img className="w-full" src="https://t3.ftcdn.net/jpg/03/50/81/90/360_F_350819076_VYSOrEOhrEFYiRLTEX4QPzYWyFKHOKgj.jpg"/>
                <div className="md:w-1/2 w-full  h-full absolute z-10 left-0">
                    <div className="flex  justify-center w-full  p-4 rounded-lg shadow-lg">
                        <p className="relative text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-500 animate-gradient">
                            Unleash your inner beast!
                            <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-75 blur-lg"></span>
                        </p>
                    </div>
                    <div className="md:mt-4">
                       <div className="flex justify-center gap-12 text-xl md:gap-24">
                            <button
                                onClick={() => setActiveComponent('guide')}
                                className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'guide' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                Guide
                            </button>
                            <button
                                onClick={() => setActiveComponent('trainers')}
                                className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'trainers' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                Our trainers
                            </button>
                       </div>
                        {renderComponent()}
                    </div>
                </div>
            </div>
            <div className="md:h-24 h-12 mt-80 md:mt-0 flex items-center  justify-center gap-4 text-xl md:text-4xl bg-slate-800">
                <div className="hidden md:block">{"-<-<-<-<-<-<-<-<-<"}</div>
                    <div className="flex gap-6 font-bold">
                    <p>Our</p>
                    <Link to="/shop" className="hover:underline transition-all text-blue-500 hover:text-slate-300">Shop!</Link>
                    </div>
                <div className="hidden md:block">{">->->->->->->->->-"}</div>
            </div>
            <div className="h-full">
                <div className="w-full h-auto  flex md:mx-auto">
                    <button
                        className="m-auto hidden md:block bg-slate-200 px-4 py-2 font-semibold text-center ml-2 transition-all hover:bg-slate-300 text-xl rounded-full"
                        onClick={scrollLeft}>{"<"}
                    </button>
                    <div
                        style={{ scrollBehavior: 'smooth', maxWidth: containerWidth }}
                        ref={scrollRef}
                        className="flex flex-col md:flex-row md:overflow-x-scroll md:mt-2 z-10 md:h-[410px] sm:overflow-y-scroll no-scrollbar justify-center w-full items-center  py-4 gap-4 border-slate-300 ">
                        {products?.specialProducts?.map((product, index) => (
                            <div key={index} className="flex md:w-[300px] border-t-2 md:border-t-0 w-full md:h-full p-2 md:border-2 md:rounded-xl ">
                                <RecommendedProducts product={product} user={user}/>
                            </div>
                        ))}
                    </div>
                    <button
                        className="m-auto hidden md:block bg-slate-200 px-4 py-2 font-semibold text-center mr-2 transition-all hover:bg-slate-300 text-xl rounded-full"
                        onClick={scrollRight}> {">"}
                    </button>
                </div>
            </div>
        </div>
    )
}

const GuideText = (user) => {

    return (
        <div className="">
            <div className="flex flex-col mt-6 ">
                <h2 className="text-center text-xl mb-2">Your Personalized Path to Success!</h2>
                <div className="md:mx-12 mx-2 flex flex-col justify-between">
                    <p className="text-pretty">
                        Your personalized guide to success, where every step is crafted to match your specific goals.
                    </p>
                    <p className="text-pretty mt-2">
                       Whether it's shedding pounds, building muscle, or boosting overall fitness.
                    </p>
                    <p className="text-pretty mt-2">
                        We have the perfect guide for you!
                    </p>
                    <p className="text-pretty mt-2">
                        With a personal trainer to guide you along the way, we'll make sure you reach your goals in no time!
                    </p>
                    {user.user && (
                        <Link
                            to="/newclient"
                            className="bg-gradient-to-r mt-6 text-center rounded-full from-emerald-700 to-emerald-600 font-semibold text-xl py-2 w-2/3 mx-auto hover:from-emerald-600 hover:to-emerald-500 transition-all hover:scale-110 px-4"
                        >
                            Start your journey!
                        </Link>
                    )}
                </div>
            </div>
            
        </div>
    )
}

const OurTrainers = ({trainers}) => {

    return (
        <div className="">
            <div className="md:mx-12">
                <h2 className="text-center mt-4 text-xl font-semibold ">The assistants you need to to reach you goals!</h2>
                <div className="flex flex-col items-center mt-6 md:mt-4 gap-2 w-full overflow-y-auto h-[200px] ">
                    {Object.values(trainers.data.data.success).map((trainer, index) => (
                        <div key={index} className="grid grid-cols-6 border-2 w-10/12 rounded-xl py-2 px-4">
                            <div className="col-span-2 flex items-center ">
                                {trainer.profileImage ? (
                                    <div className="size-full">
                                        <img src={trainer.profileImage}/>
                                    </div>
                                ) : (
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </div>
                                )}
                                <p className="mx-auto">{trainer.userName}</p>
                            </div >
                            <div className="flex pl-2 border-x-2 flex-col col-span-3">
                                <p className="flex gap-2 text-sm">Email: <span> {trainer.email}</span></p>
                                <p className="flex gap-2 text-sm">Name: <span> {trainer.firstName}  {trainer.lastName}</span></p>
                            </div>
                            <div className="col-span-1 flex flex-col items-center">
                                <p>{trainer.clients.length}</p>
                                <p>Clients</p>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
}


const RecommendedProducts = ({ product, user }) => {

    const queryClient = useQueryClient();

    const addToCart = useMutation({
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id })
    });

    const handleAddToCart = () => {
        addToCart.mutate()
        toast("Item added to cart.")
        queryClient.invalidateQueries(["currentUser"])
    };


    if (product) {
        return (
            <div className='md:h-[300px] md:w-[260px] h-full w-full flex flex-col'>
                <div className='h-2/3 md:1/2 w-full flex items-center'>
                    
                    <img
                        src={product.imageUrl}
                        alt={`Image of ${product.title}`}
                        className={`object-cover rounded-xl size-full }`}
                    />

                </div>
                <div className='flex flex-col justify-between h-1/3 md:1/2 w-full item'>
                    <div className='flex flex-col gap-2 mt-2 '>
                        <div className='flex justify-between'>
                            <StarRating rating={product.rating} />
                            <p>Price: <span>{product.price} $</span></p>
                        </div>
                        <hr />
                        <p className='text-center first-letter:uppercase text-lg font-semibold'>{product.title}</p>
                        <p className="text-sm ml-auto mr-2 mb-2">{product.quantity}</p>
                    </div>
                    <div className="flex w-full justify-between">
                        <Link
                            className='text-center mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 rounded-xl'
                            to={"/productpage/" + product.id}>View
                        </Link>
                        {user?.email ? (
                            <button
                                onClick={handleAddToCart}
                                className='text-center w-auto mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 rounded-xl'
                                >
                                Add to cart
                            </button>
                        ):(
                            <Link
                                className='text-center w-auto mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 rounded-xl'
                                to="/login">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        )
    };
};



const StarRating = ({ rating }) => {
    const renderStars = () => {
        const filledStars = Math.floor(rating); 
        const remainder = rating - filledStars; 
        const stars = [];
        for (let i = 0; i < filledStars; i++) {
            stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
        }

        if (remainder > 0) {
            stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500"></i>);
        }

        const remainingStars = 5 - filledStars - (remainder > 0 ? 1 : 0);

        for (let i = 0; i < remainingStars; i++) {
            stars.push(<i key={filledStars + i} className="far fa-star text-yellow-500"></i>);
        }

        return stars;
    };

    return <div className="text-sm">{renderStars()}</div>;
};