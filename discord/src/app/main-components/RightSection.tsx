import { SectionProps } from "@/lib/types";
import { Fragment } from "react";
import SearchUsers from "../components/SearchUsers";

export default function RightSection({ children, className }: SectionProps) {
  return (
    <Fragment>
        <div className={className ? className : "h-full col-span-3 overflow-y-scroll snap-always no-scrollbar"}>
          {<SearchUsers />}
        </div>
    </Fragment>
  );
}
