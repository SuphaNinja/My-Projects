import { SectionProps } from "@/lib/types";
import { Fragment } from "react";
export default function MiddleSection({ children, className }: SectionProps) {
  return (
    <div
      className={
        "col-span-6 border-x-1 mb-12 border-slate-500 overflow-y-scroll snap-always no-scrollbar"
      }
    >
      {children}
    </div>
  );
};
