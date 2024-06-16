import { useState } from "react";
import Day from "./Day";
import { useMutation, useQueryClient} from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify"

export default function Guide(guide) {
    const queryClient = useQueryClient();
    const [selectedDay, setSelectedDay] = useState(0);

    const days = [
        'Day 1: Monday',
        'Day 2: Tuesday',
        'Day 3: Wednesday',
        'Day 4: Thursday',
        'Day 5: Friday',
        'Day 6: Saturday',
        'Day 7: Sunday'
    ];

    const deleteGuide = useMutation({
        mutationFn: () => axiosInstance.post("/delete-guide", guide.guide),
        onSuccess: () => {
            queryClient.invalidateQueries(["currentUser"])
            toast("Guide has been deleted successfully!")
        }
    });


    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };
    if (!guide) {
        return (
            <div>No guide on this account!</div>
        )
    } else {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between md:mx-6">
                    <button
                        onClick={deleteGuide.mutate}
                        className="bg-red-500 mt-2 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Delete guide
                    </button>
                    <div className="ml-auto mt-4 mr-2">
                        <select className="bg-slate-500 text-black rounded-md" onChange={handleDayChange}>
                            <option value="0">-- Select a Day --</option>
                            {days.map((day, index) => (
                                <option key={index} value={index}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {selectedDay !== null && (
                    <div className="h-full ">    
                        <Day days={guide?.guide?.days[selectedDay]} />
                    </div>
                )}
            </div>
        )
}
}