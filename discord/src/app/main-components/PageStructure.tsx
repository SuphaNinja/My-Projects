"use client"
import SideBarNavigation from "@/app/main-components/SideBarNavigation";
import { useQuery } from "@tanstack/react-query";
import { SectionProps } from "@/lib/types";
import BottomBar from "./BottomBar";
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import RightSection from "./RightSection";
import TopSection from "./TopSection";
import api from "@/lib/axios";
import { theme } from "../ThemeState";
import { useAtom } from "jotai";

const PageStructure = ({ left, middle, right, children, className }: SectionProps) => {
    const [currentTheme] = useAtom(theme)
    const user = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    })

    
    if (user.isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center text-center">
                <div className="text-6xl mx-auto my-auto font-bold">Loading...</div>
            </div>
        )
    }
    if (user.isError) {
        location.href = "/auth/signin"
    }
    if (!user) {
        location.href = "/auth/signin"
    }

    return (
        <div
            className={currentTheme ?
                "dark flex bg-slate-950 justify-center items-center md:pt-[19px] md:pb-4 md:px-12" :
                "light bg-slate-200 justify-center items-center md:pt-[19px] md:pb-4 md:px-12"
            }
        >
            <div className="dark:bg-slate-700 bg-slate-300 flex flex-col w-full text-black dark:text-white overflow-hidden rounded-xl relative h-[57rem]">
                <TopSection />
                <div className="grid grid-cols-12 h-full border-t-1 border-neutral-200">
                    <SideBarNavigation />
                    <LeftSection>{left}</LeftSection>
                    <MiddleSection>{middle}</MiddleSection>
                    <RightSection />
                </div>
                <BottomBar />
            </div>
        </div>
    )

}

export default PageStructure;