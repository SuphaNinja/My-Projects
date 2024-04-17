import NavBar from "../MainComponents/navbar/NavBar";
import SideBar from "./SideBar";
import Footer from "./Footer";
export default function PageStructure({ children }: any) {
    return (
        <div className="">
            <NavBar />
            <div className="grid grid-cols-12 h-full">
                <SideBar />
                <div className="col-span-9 w-full bg-slate-100">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}