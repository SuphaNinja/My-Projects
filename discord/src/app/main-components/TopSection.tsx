import { Link } from "@nextui-org/react";
import { useAtom } from "jotai";
import { theme } from "@/app/ThemeState";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";



export default function TopSection() {
    const [appTheme, setAppTheme] = useAtom(theme);

    return (
        <div className="flex w-full flex-col items-center bg-slate-400 dark:bg-gradient-to-b from-slate-900 p-4 to-slate-700 relative">
            <div className="absolute right-4 top-4 animate-pulse items-center justify-center">
                <button onClick={() => setAppTheme(!appTheme)}>{appTheme ?
                    <MoonIcon width={50} /> :
                    <SunIcon width={50} />}
                </button>
            </div>
            <div className="flex w-full">
                <div className="flex flex-col gap-2 mx-auto justify-center items-center max-w-60">
                    <Link href="/"><img alt="discord logo" src="https://seeklogo.com/images/D/discord-color-logo-E5E6DFEF80-seeklogo.com.png" className="w-24" /></Link>
                    <Link className="dark:text-white text-black text-2xl hover:underline" href={"/"}>Discord</Link>
                </div>
            </div>
        </div>
    );
}