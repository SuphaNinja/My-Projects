import Footer from "@/app/MainComponents/Footer";
import NavBar from "@/app/MainComponents/navbar/NavBar";
import TopBanner from "./aboutComponents/TopBanner";
import FlagWithText from "./aboutComponents/FlagWithText";
import InfoCard from "./aboutComponents/InfoCard";
import { ArrowsRightLeftIcon, BriefcaseIcon, CakeIcon, CalendarDaysIcon, ComputerDesktopIcon, CurrencyDollarIcon, DevicePhoneMobileIcon, GlobeAltIcon, HandThumbUpIcon, KeyIcon, LanguageIcon, MagnifyingGlassIcon, PaperAirplaneIcon, PhoneArrowDownLeftIcon, RectangleGroupIcon, ShieldCheckIcon, TruckIcon, WalletIcon, WifiIcon } from "@heroicons/react/24/outline";
import { BanknotesIcon } from "@heroicons/react/16/solid";

export default function Page() {

    return (
        <div className="max-w-screen">
            <NavBar />
            <div className="w-auto">
                <TopBanner />
            </div>
            <div className="md:w-3/3 h-[20rem] w-full mx-auto items-center justify-between flex flex-wrap md:flex-row py-6">
                <FlagWithText
                    countryCode="US"
                    title="United States"
                    text="Discover the latest innovations and trends from the United States, where our store has products from renowned American brands. From modern technology to trendy styles, experience the essence of the American lifestyle only through ElectroBuy."
                />
                <FlagWithText
                    countryCode="GB_ENG"
                    title="United Kingdom"
                    text="Welcome the elegance of British craftsmanship and style! Our UK store’s product collection has the intricacy and classic charm associated with British brands. Explore the best of British culture with ElectroBuy."
                />
                <FlagWithText
                    countryCode="CN"
                    title="China"
                    text="Get the best of innovation with our China store. Travel across a world of technological wonders, fashion-forward designs, and traditional artistry. ElectroBuy's China store provides access to the Chinese brands' dynamic and evolving landscape."
                />
                <FlagWithText
                    countryCode="KR"
                    title="Korea"
                    text="Explore the trendsetting world of Korean beauty and technology. ElectroBuy's Korea store brings you the best of Korean creativity, from skincare essentials to the latest gadgets, supplying a glance into the futuristic lifestyle of Korea."
                />
                <FlagWithText
                    countryCode="JP"
                    title="Japan"
                    text="Experience the perfect mix of tradition and modernity with our Japanese store. From stunning handiwork to advanced tech, ElectroBuy's Japan store brings you the essence of Japanese culture and ingenuity delivered to your doorstep."
                />
            </div>
            <hr className="md:w-2/3 w-auto mx-auto" />
            <div className="md:w-full flex-col w-full mx-auto mt-12 flex gap-12">
                <div className="flex md:flex-row  flex-col items-center gap-12">
                    <div className="flex flex-col">
                        <h2 className="text-3xl text-center mb-4 md:mb-12">Who We Are</h2>
                        <p className="md:w-2/3 text-center md:text-left mx-auto text-lg text-pretty ">
                            We are your global shopping companions and have been so since our inception in 2012. Today, we've become a cross-border shopping paradise connecting customers in over 180 countries with limitless possibilities. We operate online stores in 180+ countries with products from the US, the UK, China, Japan, Hong Kong, Korea, and Turkey. Some of our primary features include:
                        </p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <InfoCard
                            icon={<GlobeAltIcon width={50} />}
                            title="Global Presence"
                            text="We've stamped our mark in 180+ countries and counting, making us your go-to international marketplace."
                        />
                        <InfoCard
                            icon={<WalletIcon width={50} />}
                            title="Curated Payment Methods"
                            text="We make your shopping experience convenient and secure with global payment methods like Stripe, Knet, and Paypal, along with local methods depending on your region."
                        />
                    </div>
                    <div className="flex flex-col md:mt-24 gap-8">
                        <InfoCard
                            icon={<RectangleGroupIcon width={50} />}
                            title="Wide Product Range"
                            text="Over 300 million products are waiting for you, picked from the top global fashion, electronics, beauty, and more brands."
                        />
                        <InfoCard
                            icon={<PhoneArrowDownLeftIcon width={50} />}
                            title="Customer Support"
                            text="Our reliable customer support team is here for you always for a seamless shopping experience. We also offer local language support in Arabic, Hindi and English!"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 md:ml-12 mt-8">
                    <div className="col-span-3 flex flex-col items-center gap-4 md:grid md:grid-cols-3">
                        <div className="col-span-1 mt-2">
                            <h2 className="text-3xl text-center md:text-left font-semibold">How We Work</h2>
                            <p className="mt-4 text-xl text-center md:text-left md:mr-12">At ElectroBuy, simplicity is our forte. We have a straightforward approach to sweeten your shopping experience.</p>
                        </div>
                        <div className="col-span-1">
                            <InfoCard
                                icon={<ComputerDesktopIcon width={50} />}
                                title="Account"
                                text="Create your account to let us offer you a personalised shopping journey."
                            />
                        </div>
                        <div className="col-span-1">
                            <InfoCard
                                icon={<LanguageIcon width={50} />}
                                title="Language"
                                text="We offer services in English and local languages for your convenient and pleasant shopping experience."
                            />
                        </div>
                    </div>
                    <div className="col-span-3 grid grid-cols-3  mt-6">
                        <div className="col-span-3 flex flex-col items-center gap-6 md:grid md:grid-cols-3">
                            <div className="col-span-1">
                                <InfoCard
                                    icon={<RectangleGroupIcon width={50} />}
                                    title="Explore"
                                    text="Use our global search engine to find products and categories effortlessly."
                                />
                            </div>
                            <div className="col-span-1">
                                <InfoCard
                                    icon={<MagnifyingGlassIcon width={50} />}
                                    title="Search"
                                    text="Discover over 300 million brand-new, unique products from the best international brands with a click."
                                />
                            </div>
                            <div className="col-span-1">
                                <InfoCard
                                    icon={<TruckIcon width={50} />}
                                    title="Delivery"
                                    text="Discover over 300 million brand-new, unique products from the best international brands with a click."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 mt-12">
                    <div className="col-span-3 flex flex-col items-center gap-6 md:grid md:grid-cols-3">
                        <div className="col-span-1 mt-6">
                            <h1 className="text-4xl text-center md:text-left md:font-semibold mb-4">Why Our Customers Trust Us</h1>
                            <p className="text-xl text-center md:text-left text-pretty">There are hundreds of reasons why our customers love and trust us. Some of the reasons why are:</p>
                        </div>
                        <div className="col-span-1 md:mt-24">
                            <InfoCard
                                icon={<HandThumbUpIcon width={50} />}
                                title="Genuine Products"
                                text="When you shop with ElectroBuy, every product you purchase is 100% genuine. We source our merchandise from authentic suppliers and brands, so you receive only high-quality items. We understand how important trust is in online shopping. Our delivery of genuine products is a cornerstone of that trust."
                            />
                        </div>
                        <div className="col-span-1">
                            <InfoCard
                                icon={<CurrencyDollarIcon width={50} />}
                                title="Money Back Guarantee"
                                text="ElectroBuy offers a 100% money-back guarantee on your purchases to show our confidence. We stand by the quality of our products, and your satisfaction is our priority. If you're unsatisfied with your order, we promise to make it right. This guarantee reflects our commitment to customer satisfaction to let you shop with peace of mind, knowing your investment is protected."
                            />
                        </div>
                    </div>
                    <div className="col-span-3 flex flex-col items-center gap-6 md:grid md:grid-cols-3 mt-12">
                        <div className="col-span-1 md:-mt-44">
                            <InfoCard
                                icon={<ArrowsRightLeftIcon width={50} />}
                                title="Top Logistics Partners"
                                text="Transparency creates trust, and at ElectroBuy, we prioritise clear communication and reliable service. Whether tracking your order, understanding product details, or resolving an issue, we provide you with the support you need for a transparent and trustworthy shopping experience."
                            />
                        </div>
                        <div className="col-span-1 ">
                            <InfoCard
                                icon={<ShieldCheckIcon width={50} />}
                                title="Transparent and Reliable"
                                text="Transparency creates trust, and at ElectroBuy, we prioritise clear communication and reliable service. Whether tracking your order, understanding product details, or resolving an issue, we provide you with the support you need for a transparent and trustworthy shopping experience."
                            />
                        </div>
                        <div className="col-span-1 mx-auto">
                            <img className="md:rounded-xl" src="https://media.istockphoto.com/id/1419539600/photo/business-presentation-and-man-on-a-laptop-in-a-corporate-conference-or-office-collaboration.jpg?s=612x612&w=0&k=20&c=viDl-Gtp68kqaCeh0WbnqM0EERvGec4i5C_Vk84VHKE=" />
                        </div>
                    </div>
                </div>
                <div className="mt-12">
                    <h2 className="text-4xl text-center font-semibold mb-6">What We Deliver</h2>
                    <p className="text-xl text-center">Our shelves are stocked with products that bring joy and utility to your life. From the latest tech gadgets to trendy fashion pieces, beauty essentials, and much more, Ubuy brings you a world of quality and variety. Our categories include:</p>
                </div>
                <div className="flex md:flex-col gap-6">
                    <div className="md:flex justify-center gap-16">
                        <div className="flex gap-2">
                            <BriefcaseIcon width={30} />
                            <p className="text-xl">Clothing</p>
                        </div>
                        <div className="flex gap-2 ">
                            <WalletIcon width={30} />
                            <p className="text-xl">Jewelery</p>
                        </div>
                        <div className="flex gap-2 ">
                            <BanknotesIcon width={30} />
                            <p className="text-xl">Designer</p>
                        </div>
                    </div>
                    <div className="md:flex justify-center gap-16">
                        <div className="flex gap-2">
                            <WifiIcon width={30} />
                            <p className="text-xl">Mobile Services</p>
                        </div>
                        <div className="flex gap-2">
                            <DevicePhoneMobileIcon width={30} />
                            <p className="text-xl">Electronics</p>
                        </div>
                        <div className="flex gap-2">
                            <KeyIcon width={30} />
                            <p className="text-xl">Accessories</p>
                        </div>
                    </div>
                    <div className="md:flex justify-center gap-16">
                        <div className="flex gap-2 rounded-lg">
                            <CakeIcon width={30} />
                            <p className="text-xl">Food</p>
                        </div>
                        <div className="flex  gap-2 rounded-lg">
                            <PaperAirplaneIcon width={30} />
                            <p className="text-xl">Recipies</p>
                        </div>
                        <div className="flex  gap-2 ">
                            <CalendarDaysIcon width={30} />
                            <p className="text-xl">Coaching</p>
                        </div>
                    </div>
                </div>
                <p className="text-xl text-center my-6 font-semibold">Join us on this journey to explore the world with Ubuy, and let us deliver happiness to your doorstep.</p>
            </div>
            <Footer />
        </div>
    )
}