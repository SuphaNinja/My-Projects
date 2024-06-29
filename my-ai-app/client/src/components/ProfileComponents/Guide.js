import { useState, useEffect } from "react";
import Day from "./Day";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "sonner"
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function Guide(guide) {
    const queryClient = useQueryClient();
    const [ selectedDay, setSelectedDay ] = useState(0);

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
        onSuccess: (data) => {
            queryClient.invalidateQueries(["currentUser"])
            if (data.data.success) {toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    useEffect(() => {
        const today = new Date();
        const currentDayIndex = today.getDay();
        setSelectedDay(currentDayIndex - 1);
    }, []);

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    if (!guide) {
        return (
            <div className="flex flex-col mt-12 items-center justify-center">
                <p className="text-lg">There is no guide on this account. Would you like to create one?</p>
                <Button className="text-xl" asChild variant="link">
                    <Link to="/newclient">Create guide</Link>
                </Button>
            </div>
        )
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between md:mx-6 mt-4">
                <Button variant="destructive" onClick={deleteGuide.mutate} >
                    Delete guide
                </Button>
                <div className="ml-auto mr-2">
                    <select onChange={handleDayChange}>
                        {days.map((day, index) => (
                            <option key={index} value={index}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedDay !== null && (
                <div className="h-full">
                    <Day days={guide?.guide?.days[selectedDay]} />
                </div>
            )}
        </div>
    )
}
