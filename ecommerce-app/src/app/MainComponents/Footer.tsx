

import { PhoneArrowUpRightIcon } from "@heroicons/react/16/solid";
import { CursorArrowRippleIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import { BoltIcon, BoltSlashIcon, CurrencyDollarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Mastercard, Visa, Paypal, Amex, Maestro, } from 'react-payment-logos/dist/flat';



export default function Footer() {
    return (
        <footer className="col-span-12 pt-6 bg-slate-200">
            <div className="flex items-center bg-slate-300 w-5/6  mx-auto rounded-xl h-24">
                <div className="flex justify-between w-full ml-24">
                    <EnvelopeIcon className="animate-bounce" color="green " width={30} />
                    <div className="flex gap-12 items-center border-x-8 px-6 border-sky-600 ">
                        <p className=" text-4xl"> Stay Connected</p>
                        <div className="flex  h-full rounded-full overflow-hidden bg-slate-50">
                            <input
                                className="outline-none h-full px-6 bg-slate-50"
                                placeholder="Get the latest news and offers"
                            />
                            <button className="rounded-full hover:underline  my-auto text-center py-2 px-6 bg-emerald-400">Subscribe</button>
                        </div>
                    </div>
                    <EnvelopeIcon className="animate-bounce mr-24" color="green " width={30} />
                </div>
            </div>
            <div className="grid md:grid-cols-6 grid-cols-1 md:mx-12 text-slate-800 mt-6">
                <div className="border-l-4 border-r-2 border-b-2 border-slate-400 w-full px-4">
                    <div className="flex w-full">
                        <ExclamationCircleIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Quick Links</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href={process.env.NEXT_PUBLIC_URL + "/pages/about"} className="hover:underline hover:font-bold transition-all">About Us</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Contact Us</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Corporate Enquiries</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Track Order</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Shipping Policy</Link>
                    </div>
                </div>
                <div className="border-x-2 border-b-2 border-slate-400 w-full px-4">
                    <div className="flex w-full">
                        <BoltIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">ElectroBuy</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Download App</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Brands List</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Customer Reviews</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Return Policy</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">FAQ</Link>
                    </div>
                </div >
                <div className="border-x-2 border-b-2 border-slate-400 w-full px-4">
                    <div className="flex w-full">
                        <CurrencyDollarIcon width={35} />
                        <h2 className="text-2xl font-semibold text-center">Payment</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-1 mt-4">
                        <Link href="#" className="hover:underline flex gap-2 items-center hover:font-bold transition-all"><span><Paypal /></span>PayPal</Link>
                        <Link href="#" className="hover:underline flex gap-2 items-center hover:font-bold transition-all"><span><Amex /></span>Amex</Link>
                        <Link href="#" className="hover:underline flex gap-2 items-center hover:font-bold transition-all"><span><Visa /></span>Visa</Link>
                        <Link href="#" className="hover:underline flex gap-2 items-center hover:font-bold transition-all"><span><Mastercard /></span>MasterCard</Link>
                        <Link href="#" className="hover:underline flex gap-2 items-center hover:font-bold transition-all"><span><Maestro /></span>Maestro</Link>
                    </div>
                </div>
                <div className="border-x-2 border-b-2 border-slate-400 w-full px-4">
                    <div className="flex w-full">
                        <ExclamationCircleIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Shipping</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline text-nowrap font-semibold flex gap-2 items-center hover:font-bold transition-all">
                            <span><BoltIcon width={20} /></span>
                            Express Shipping 
                            <span className="ml-auto font-light">Fast Delivery</span>
                        </Link>
                        <Link href="#" className="hover:underline font-semibold flex gap-2 items-center hover:font-bold transition-all">
                            <span><BoltSlashIcon width={20} /></span>
                            Standard Shipping 
                            <span className="font-light"> 10-15 Days</span>
                        </Link>
                    </div>
                </div>
                <div className="border-x-2 border-b-2 border-slate-400 w-full px-4">
                    <div className="flex w-full">
                        <CurrencyDollarIcon width={35} />
                        <h2 className="text-2xl font-semibold text-center">Countries Covered</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Sweden</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Japan</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Korea</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Greece</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">France</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">USA</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Spain</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Poland</Link>

                    </div>
                </div>
                <div className="border-r-4 border-l-2 border-b-2 border-slate-400 w-full px-4">
                    <div className="flex w-full">
                        <ExclamationCircleIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">24/7 Support</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="w-11/12 mx-auto flex p-2 border-2 border-slate-300 rounded-md">
                            <div className="flex flex-col gap-2">
                                <div className="flex hover:underline cursor-pointer gap-2 font-semibold"><PhoneArrowUpRightIcon width={20} /><p>24/7 Customer Support</p></div>
                                <p className="text-sm hover:underline cursor-pointer text-pretty">Get Your Texts/Emails Answered In Your Native Language</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 ">
                            <p>Customer Services</p>
                            <p>+46 00 000 00 00</p>
                            <div className="flex flex-col">
                                <p className="font-semibold">Download Our App!</p>
                                <div className="flex gap-2 mt-2 mx-auto">
                                    <div className="flex text-white p-2 rounded-md items-center justify-center bg-slate-900">
                                        <CursorArrowRippleIcon width={30}/>
                                        <div className="flex flex-col justify-center">
                                            <p className="text-tiny">Download On</p>
                                            <p className="text-sm">App Store</p>
                                        </div>
                                    </div>
                                    <div className="flex text-white p-2 rounded-md items-center justify-center bg-slate-900">
                                        <CursorArrowRippleIcon width={30} />
                                        <div className="flex flex-col justify-center">
                                            <p className="text-tiny">Download On</p>
                                            <p className="text-sm">Google Play</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-3/4 mt-8 mx-auto flex flex-col">
                <p className="text-2xl font-semibold">ElectroBuy Popular Stores</p>
                <hr className="w-full h-1 bg-slate-400 rounded-full"/>
                <div className="flex justify-between my-2 w-full">
                    <p className="font-medium cursor-pointer hover:underline transition-all text-lg">Imported Goods From USA</p>
                    <p className="font-medium cursor-pointer hover:underline transition-all text-lg">Imported Goods From UK</p>
                    <p className="font-medium cursor-pointer hover:underline transition-all text-lg">Imported Goods From Japan</p>
                    <p className="font-medium cursor-pointer hover:underline transition-all text-lg" >Imported Goods From Hong Kong</p>
                    <p className="font-medium cursor-pointer hover:underline transition-all text-lg">Imported Goods From Korea</p>
                    <p className="font-medium cursor-pointer hover:underline transition-all text-lg">Imported Goods From China</p>
                </div>
                <hr className="w-full h-1 bg-slate-400 rounded-full"/>
                <div className="flex py-12 w-full items-center justify-between">
                    <p>Copyright &#169; 2024 ElectroBuy Co. All rights reserved.</p>
                    <div className="flex gap-2 text-sm font-medium">
                        <Link className="hover:underline hover:font-bold transition-all" href={"#"}>Terms & Conditions</Link>
                        <p>-</p>
                        <Link className="hover:underline hover:font-bold transition-all" href={"#"}>Privacy Policy</Link>
                        <p>-</p>
                        <Link className="hover:underline hover:font-bold transition-all" href={process.env.NEXT_PUBLIC_URL + "/pages/about"}>About Us</Link>
                        <p>-</p>
                        <Link className="hover:underline hover:font-bold transition-all" href={"#"}>Contact Us</Link> 
                    </div>
                    <div className="flex gap-4">
                        <p className="font-bold">Follow us:</p>
                        <Link href={"#"}>
                            {/* <!-- Facebook --> */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                style={{ color: "#1877f2" }}
                                viewBox="0 0 24 24"
                            >
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </Link>
                        <Link href={"#"}>
                            {/* <!-- Instagram --> */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                style={{ color: "#c13584" }}
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </Link>
                        <Link href={"#"}>
                            {/* <!-- Twitter --> */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                style={{ color: "#1da1f2" }}
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </Link>
                        <Link href={"#"}>
                            {/* <!-- Google --> */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                style={{ color: "#ea4335" }}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}