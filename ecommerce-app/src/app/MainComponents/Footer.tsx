import { BoltIcon, BoltSlashIcon, CurrencyDollarIcon, CursorArrowRippleIcon, EnvelopeIcon, ExclamationCircleIcon, PhoneArrowUpRightIcon } from "@heroicons/react/20/solid";

import Link from "next/link";
import { Mastercard, Visa, Paypal, Amex, Maestro } from "react-payment-logos/dist/flat";

export default function Footer() {
    return (
        <footer className="bg-slate-200">
            <div className="flex items-center bg-slate-300 w-11/12 mx-auto rounded-xl h-24 mt-4 px-4">
                <div className="flex justify-between w-full">
                    <EnvelopeIcon className="animate-bounce" color="green" width={30} />
                    <div className="flex flex-col md:flex-row gap-6 items-center border-x-8 px-6 border-sky-600">
                        <p className="text-4xl">Stay Connected</p>
                        <div className="flex h-full rounded-full overflow-hidden bg-slate-50">
                            <input
                                className="outline-none h-full px-6 bg-slate-50"
                                placeholder="Get the latest news and offers"
                            />
                            <button className="rounded-full hover:underline text-center py-2 px-6 bg-emerald-400">Subscribe</button>
                        </div>
                    </div>
                    <EnvelopeIcon className="animate-bounce" color="green" width={30} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 text-slate-800 mt-6 mx-4 md:mx-12">
                <div className="border-2 border-slate-400 p-4">
                    <div className="flex w-full items-center">
                        <ExclamationCircleIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Quick Links</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="/pages/about" className="hover:underline hover:font-bold transition-all">About Us</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Contact Us</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Corporate Enquiries</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Track Order</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Shipping Policy</Link>
                    </div>
                </div>
                <div className="border-2 border-slate-400 p-4">
                    <div className="flex w-full items-center">
                        <CurrencyDollarIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Customer Service</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline hover:font-bold transition-all">My Account</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">FAQ</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Terms of Use</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Privacy Policy</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Refund Policy</Link>
                    </div>
                </div>
                <div className="border-2 border-slate-400 p-4">
                    <div className="flex w-full items-center">
                        <BoltSlashIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Categories</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Electronics</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Fashion</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Sports & Outdoor</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Home & Furniture</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Beauty & Personal Care</Link>
                    </div>
                </div>
                <div className="border-2 border-slate-400 p-4">
                    <div className="flex w-full items-center">
                        <BoltIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Top Brands</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Apple</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Samsung</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Nike</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Adidas</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Sony</Link>
                    </div>
                </div>
                <div className="border-2 border-slate-400 p-4">
                    <div className="flex w-full items-center">
                        <PhoneArrowUpRightIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Contact Us</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <p className="hover:underline hover:font-bold transition-all">Phone: +123 456 7890</p>
                        <p className="hover:underline hover:font-bold transition-all">Email: support@example.com</p>
                        <p className="hover:underline hover:font-bold transition-all">Address: 123 Main St, City, Country</p>
                    </div>
                </div>
                <div className="border-2 border-slate-400 p-4">
                    <div className="flex w-full items-center">
                        <CursorArrowRippleIcon width={30} />
                        <h2 className="text-2xl font-semibold text-center">Follow Us</h2>
                    </div>
                    <hr />
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Facebook</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Twitter</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">Instagram</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">LinkedIn</Link>
                        <Link href="#" className="hover:underline hover:font-bold transition-all">YouTube</Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center mt-6 gap-4">
                <p className="font-semibold">Accepted Payment Methods:</p>
                <Mastercard />
                <Visa />
                <Paypal />
                <Amex />
                <Maestro />
            </div>
            <div className="flex items-center justify-center mt-6">
                <p className="text-sm">&copy; 2023 Your Company. All rights reserved.</p>
            </div>
        </footer>
    );
}
