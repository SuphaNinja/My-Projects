"use client";
import { useQuery } from "@tanstack/react-query";
import GetCartItem from "./CartComponents/GetCartItem";
import api from "@/lib/axios";
import NavBar from "@/app/MainComponents/navbar/NavBar";
import Link from "next/link";
import TotalCartPrice from "./CartComponents/TotalCartPrice";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import Footer from "@/app/MainComponents/Footer";
import RecommendedProducts from "./CartComponents/RecommendedProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => api.getCurrentUser(),
    });

    const products = useQuery({
        queryKey: ["products"],
        queryFn: () => api.getAllProducts()
    });

    const handleUpdateCart = () => {
        user.refetch();
        if (!toast.isActive("UpdateCart")) {
            toast.success("Cart has been updated!", {
                toastId: "UpdateCart"
            });
        };
    };

    return (
        <div className="w-full">
            <NavBar />
            <div className="pl-4 w-full border-b mb-2 py-2 ">
                <Button asChild variant="link">
                    <Link href={"/"}>{"< Continue Shopping"}</Link>
                </Button>
            </div>
            <div className="grid grid-cols-12">
                <div className="flex flex-col col-span-12 md:col-span-8 md:p-6 border-b border-r rounded-md">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-semibold">Shopping Cart <span className="font-light text-xl">({user.data?.carts.length} items)</span></h2>
                        <Button onClick={handleUpdateCart}>Update Shopping Cart</Button>
                    </div>
                    <p className="w-full ml-5 my-2 ">Est. delivery: Friday, April 19</p>
                    <div className="w-full flex flex-col gap-6 overflow-y-auto no-scrollbar md:max-h-[650px]">
                    {!user.isLoading ? (
                        user.data?.carts.map((cartItem: any, index: any) => (
                            <div key={index} className={`flex w-full gap-4 md:border-x border-y md:rounded-md`}>
                                <GetCartItem quantity={cartItem.quantity} itemId={cartItem.productId} />
                            </div>
                        ))
                    ): (
                        Array.from({ length: 9 }).map((_, index) => (
                            <div key={index} className="h-[350px] w-full md:w-auto space-y-2">
                                <Skeleton className="h-1/2 md:h-[100px] w-full rounded-xl" />
                                <div className="space-y-2 h-1/2">
                                    <Skeleton className="h-4 md:h-8 w-full"/>
                                    <Skeleton className="h-4 md:h-8  w-full"/>
                                </div>
                            </div>
                        ))
                    )}
                    </div>
                    {/* this is checkout on small devices */}
                    <div className="py-6 md:hidden flex flex-col">
                        <div className="w-full flex px-4 flex-col gap-2">
                            <h2 className="text-2xl">Order Summary</h2>
                            <div className="flex justify-between">Subtotal: <div className="flex font-normal"><TotalCartPrice cartItems={user.data?.carts} />.00 $</div></div>
                            <p className="flex justify-between">Shipping Fee: <span className="flex font-normal">Calculating at checkout</span></p>
                            <p className="flex justify-between">Customs: <span className="flex font-normal">Calculating at checkout</span></p>
                        </div>
                        <Button asChild className="mx-auto mt-2">
                            <Link href={"#"}>
                                <LockClosedIcon width={20} /> Proceed To Checkout
                            </Link>
                        </Button>
                        <div className="flex flex-col gap-1 mt-4 mx-4">
                            <p className="text-xl ">Discount Codes</p>
                            <p className="font-light">Enter your coupon code if you have one.</p>
                            <Input type="text" className="outline-none px-2 rounded-lg py-1" />
                            <Button className="mt-2">
                                Apply Discount
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 hidden max-h-[350px] max-w-[400px] ml-6 mt-6 md:flex flex-col">
                    <div className="w-full flex px-4 flex-col gap-2">
                        <h2 className="text-2xl">Order Summary</h2>
                        <div className="flex justify-between">Subtotal: <div className="flex font-normal"><TotalCartPrice cartItems={user.data?.carts} />.00 $</div></div>
                        <p className="flex justify-between">Shipping Fee: <span className="flex font-normal">Calculating at checkout</span></p>
                        <p className="flex justify-between">Customs: <span className="flex font-normal">Calculating at checkout</span></p>
                    </div>
                    <Button asChild className="mx-auto mt-2">
                        <Link href={"#"}>
                            <LockClosedIcon width={20} /> Proceed To Checkout
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-1 mt-4 mx-4">
                        <p className="text-xl ">Discount Codes</p>
                        <p className="font-light">Enter your coupon code if you have one.</p>
                        <Input type="text" className="outline-none px-2 rounded-lg py-1" />
                        <Button className="mt-2">
                            Apply Discount
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col mt-12 gap-2 mb-12">
                    <p className="mx-auto font-semibold text-xl">Recommended for you...</p>
                {!products.isLoading ? (
                    <div className="w-full flex">
                        {/* small devices */}
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true
                            }}
                            orientation="vertical"
                            className="md:hidden w-full mt-12">
                            <CarouselContent className="h-[600px]">
                                {products.data?.products?.map((product: any, index: any) => (
                                    <CarouselItem key={index} className="basis-1/1">
                                        <RecommendedProducts product={product} />
                                    </CarouselItem >
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        {/* md or higher sized devices */}
                        <Carousel 
                            opts={{
                            align: "start",
                            loop: true
                        }}
                        className="md:w-[90%] hidden md:block md:max-w-[90%] max-w-sm md:mx-auto md:p-4 rounded-md">
                            <CarouselContent>
                                {products.data?.products?.map((product: any, index: any) => (
                                    <CarouselItem key={index} className="md:basis-1/12 basis-1/1 lg:basis-1/4">
                                        <RecommendedProducts product={product} />
                                    </CarouselItem >
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                ) : (
                    <div className="w-full flex">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true
                            }}
                                className="md:w-[90%] md:max-w-[90%] max-w-sm  mx-auto p-4 rounded-md"
                        >
                            <CarouselContent>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <div className="flex flex-col space-y-2">
                                                        <Skeleton className="lg:w-[300px] md:w-[200px] md:h-32"/>
                                                        <Skeleton className="w-full lg:h-12 md:h-8" />
                                                        <Skeleton className="w-full lg:h-12 md:h-8" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
};