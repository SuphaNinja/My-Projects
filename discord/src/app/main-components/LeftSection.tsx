import { SectionProps } from "@/lib/types";
import { Fragment } from "react";


export default function LeftSection({ children, className }: SectionProps ) {
    
    return (
        <Fragment>
            {children && (
                <div className={className ? className : "h-full w-full col-span-2 overflow-y-scroll snap-always no-scrollbar"}>
                    {children}
                </div>
            )}
        </Fragment>
    )
}