import { ToggleTheme } from "@/components/ui/ToggleTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BoltIcon, BoltSlashIcon, CurrencyDollarIcon, CursorArrowRippleIcon, EnvelopeIcon, ExclamationCircleIcon, PhoneArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Mastercard, Visa, Paypal, Amex, Maestro } from "react-payment-logos/dist/flat";

export default function Footer() {
    return (
        <footer className="border-t-2 pb-4">
            <div className="flex sm:flex-row flex-col justify-center items-center md:h-24 border-b p-4">
                <div className="flex flex-col w-2/3 justify-evenly md:flex-row gap-6 items-center">
                    <p className="text-4xl text-nowrap">Stay Connected</p>
                    <Input type="text" placeholder="Get the latest news and offers! Enter your email:"/>
                    <Button className="w-full md:w-auto">Subscribe</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-6 mx-4 md:mx-12">
                <div className="border p-4">
                    <div className="flex pb-2 border-b">
                        <ExclamationCircleIcon width={30} />
                        <h2 className="text-xl text-center">Quick Links</h2>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Button asChild variant="link">
                            <Link href="/pages/about" >About Us</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Contact Us</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#" >Corporate Enquiries</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Track Order</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Shipping Policy</Link>
                        </Button>
                    </div>
                </div>
                <div className="border p-4">
                    <div className="flex pb-2 border-b">
                        <CurrencyDollarIcon width={30} />
                        <h2 className="text-xl text-center">Customer Service</h2>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Button asChild variant="link">
                            <Link href="#" >My Account</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#" >FAQ</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#" >Terms of Use</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Privacy Policy</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#" >Refund Policy</Link>
                        </Button>
                    </div>
                </div>
                <div className="border p-4">
                    <div className="flex border-b pb-2">
                        <BoltSlashIcon width={30} />
                        <h2 className="text-xl text-center">Categories</h2>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Button asChild variant="link">
                            <Link href="#">Electronics</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Fashion</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Sports & Outdoor</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Home & Furniture</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Beauty & Personal Care</Link>
                        </Button>
                    </div>
                </div>
                <div className="border p-4">
                    <div className="flex border-b pb-2">
                        <BoltIcon width={30} />
                        <h2 className="text-xl text-center">Top Brands</h2>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Button asChild variant="link">
                            <Link href="#">Apple</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Samsung</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Nike</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Adidas</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Sony</Link>
                        </Button>
                    </div>
                </div>
                <div className="border p-4">
                    <div className="flex border-b pb-2">
                        <PhoneArrowUpRightIcon width={30} />
                        <h2 className="text-xl text-center">Contact Us</h2>
                    </div>
                    <div className="flex flex-col gap-2 items-start mt-4">
                        <Button asChild variant="link">
                            <Link href="#">Phone:<br/> +123 456 7890</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Email:<br/> support@example.com</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Address:<br/>  123 Main St, City, Country</Link>
                        </Button>
                    </div>
                </div>
                <div className="border p-4">
                    <div className="flex border-b pb-2">
                        <CursorArrowRippleIcon width={30} />
                        <h2 className="text-xl text-center">Follow Us</h2>
                    </div>
                    <div className="flex flex-col gap items-start">
                        <Button asChild variant="link">
                            <Link href="#">Facebook</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Twitter</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Twitter</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Instagram</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">LinkedIn</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">YouTube</Link>
                        </Button>
                        <Button asChild variant="link">
                            <Link href="#">Instagram</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex sm:flex-row flex-col items-center justify-center mt-6 gap-4">
                <p className="font-semibold">Accepted Payment Methods:</p>
                <div className="flex gap-4">
                    <Mastercard />
                    <Visa />
                    <Paypal />
                    <Amex />
                    <Maestro />
                </div>
            </div>
            <p className="text-sm text-center mt-4">&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
    );
}
