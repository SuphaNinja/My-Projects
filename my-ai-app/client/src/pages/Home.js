
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useState, useRef,useEffect } from "react";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from "sonner";
import { Button } from "src/components/ui/button";
import { Skeleton } from "src/components/ui/skeleton";
import StarRating from "src/components/ui/StarRating";


export default function Home() {
    const [activeComponent, setActiveComponent ] = useState("guide");

    const scrollRef = useRef(0); 
    const scrollLeft = () => {
        if (scrollRef.current) {
            (scrollRef.current).scrollBy({
                left: -290, 
                behavior: 'smooth', 
            });
        };
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            (scrollRef.current).scrollBy({
                left: 200, 
                behavior: 'smooth', 
            });
        };
    };
    
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
        };
    };

    const [containerWidth, setContainerWidth] = useState(null);
    useEffect(() => {
        if (scrollRef.current) {
            const totalWidth = scrollRef.current.scrollWidth;
            setContainerWidth(totalWidth);
        };
    }, [products?.specialProducts]);
    
    return (
        <div className="flex w-screen flex-col">
            <div className="w-full mt-24 md:mt-0 relative flex">
                <img className="w-full md:block hidden brightness-150 dark:brightness-100" src="https://t3.ftcdn.net/jpg/03/50/81/90/360_F_350819076_VYSOrEOhrEFYiRLTEX4QPzYWyFKHOKgj.jpg"/>
                <div className="md:w-1/2 w-full h-full absolute z-10 bg-white dark:bg-black left-0">
                    <div className="flex justify-center w-full md:p-8">
                        <p className="relative text-center text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-500 animate-gradient">
                            Unleash your inner beast!
                            <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-75 blur-lg"></span>
                        </p>
                    </div>
                    <div className="md:mt-4">
                       <div className="flex justify-evenly md:text-2xl">
                            <Button
                                variant="link"
                                onClick={() => setActiveComponent('guide')}
                                className={`md:text-2xl transition-all hover:underline ${activeComponent === 'guide' ? "  font-semibold underline" : ""}`}>
                                Guide
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => setActiveComponent('trainers')}
                                className={`md:text-2xl transition-all hover:underline ${activeComponent === 'trainers' ? "  font-semibold underline" : ""}`}>
                                Our trainers
                            </Button>
                       </div>
                        {renderComponent()}
                    </div>
                </div>
            </div>
            <div className="md:h-24 h-12 mt-96 md:mt-0 flex items-center justify-center gap-4 text-xl md:text-4xl bg-white dark:bg-slate-900">
                <div className="hidden md:block">{"-<-<-<-<-<-<-<-<-<"}</div>
                    <div className="flex gap-6 font-bold">
                    <p>Our</p>
                    <Link to="/shop" className="hover:underline transition-all text-blue-500 hover:text-slate-700 dark:hover:text-slate-300">Shop!</Link>
                    </div>
                <div className="hidden md:block">{">->->->->->->->->-"}</div>
            </div>
            <div className="h-full">
                <div className="w-full h-auto flex md:mx-auto">
                    <button
                        className="m-auto hidden md:block text-white dark:text-black bg-slate-800 dark:bg-slate-200  px-4 py-2 font-semibold text-center ml-2 transition-all hover:bg-slate-600 text-xl rounded-full"
                        onClick={scrollLeft}>{"<"}
                    </button>
                    {allProducts.isLoading && (
                        <div className="flex items-center justify-center space-x-3">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex flex-col space-y-3">
                                    <Skeleton className="h-[200px] w-[300px] rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-[250px]" />
                                        <Skeleton className="h-8 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div
                        style={{ scrollBehavior: 'smooth', maxWidth: containerWidth }}
                        ref={scrollRef}
                        className="flex flex-col md:flex-row md:overflow-x-scroll md:h-[410px] no-scrollbar justify-center w-full items-center py-4 gap-4 ">
                        {products?.specialProducts.map((product, index) => (
                            <div key = { index } className = "flex md:w-[300px] border w-full md:h-full p-2 md:rounded-md">
                                <RecommendedProducts product = { product } user = { user } isLoading = {allProducts.isLoading}/>
                            </div>
                        ))}
                    </div>
                    <button
                        className="m-auto hidden md:block text-white dark:text-black bg-slate-800 dark:bg-slate-200 px-4 py-2 font-semibold text-center mr-2 transition-all hover:bg-slate-600 text-xl rounded-full"
                        onClick={scrollRight}> {">"}
                    </button>
                </div>
            </div>
        </div>
    )
}

const GuideText = (user) => {
    return (
        <div className="flex flex-col mt-6">
            <h2 className="text-center text-xl font-semibold mb-2">Your Personalized Path to Success!</h2>
            <div className="md:mx-12 items-center mx-2 flex flex-col gap-2 justify-between">
                <p>Your personalized guide to success, where every step is crafted to match your specific goals.</p>
                <p>Whether it's shedding pounds, building muscle, or boosting overall fitness.</p>
                <p>We have the perfect guide for you!</p>
                <p>With a personal trainer to guide you along the way, we'll make sure you reach your goals in no time!</p>
                {user.user ? (
                    <Button asChild className="md:w-1/2 md:mx-auto">
                        <Link to="/newclient">
                            Start your journey!
                        </Link>
                    </Button>
                ) :(
                    <div className="flex gap-4">
                        <Button asChild size="lg">
                            <Link to="/signup">
                                Sign up!
                            </Link>
                        </Button>
                        <Button asChild size="lg">
                            <Link to="/login">
                                Login!
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

const OurTrainers = ({trainers}) => {
    return (
        <div className="md:mx-12">
            <h2 className="text-center mt-4 text-xl font-semibold">The assistants you need to to reach you goals!</h2>
            <div className="flex flex-col items-center mt-4 gap-2 w-full overflow-y-auto h-[200px] ">
                {Object.values(trainers.data.data.success).map((trainer, index) => (
                    <div key={index} className="grid grid-cols-6 border w-10/12 rounded-xl py-2 px-4">
                        <div className="col-span-2 flex items-center ">
                            {trainer.profileImage ? (
                                <img className="size-12 rounded-full" src={trainer.profileImage}/>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
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
    )
}

const RecommendedProducts = ({ product, user }) => {
    const queryClient = useQueryClient();

    const addToCart = useMutation({
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id, productPrice: product.price }),
        onSuccess: (data) => {
            if (data.data.success) { toast(data.data.success)};
            if (data.data.error) { toast(data.data.error) };
        }
    });

    const handleAddToCart = () => {
        addToCart.mutate()
        queryClient.invalidateQueries(["currentUser"])
    };

    return (
        <div className='md:h-[300px] md:w-[260px] h-full w-full flex flex-col'>
            <div className='h-2/3 md:1/2 w-full flex items-center'>
                <img
                    src={product.imageUrl}
                    alt={`Image of ${product.title}`}
                    className={`object-cover rounded-xl size-full }`}
                />
            </div>
            <div className='flex flex-col justify-between h-1/3 md:1/2 w-full'>
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
                    <Button asChild>
                        <Link to={"/productpage/" + product.id}>
                            View
                        </Link>
                    </Button>
                    {user?.email ? (
                        <Button onClick={handleAddToCart} >
                            Add to cart
                        </Button>
                    ):(
                        <Button asChild>
                            <Link to="/login">
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
};