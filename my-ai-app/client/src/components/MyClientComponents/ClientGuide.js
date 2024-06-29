import { useState, useEffect } from "react";
import ClientDay from "./ClientDay";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ClientGuide(guide) {
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
        onSuccess: (data) => {
            queryClient.invalidateQueries(["currentUser"]);
            if (data.data.succes) {toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    useEffect(() => {
        const today = new Date();
        const currentDayIndex = today.getDay(); 
        setSelectedDay(currentDayIndex -1);
    }, []);

    const handleDayChange = (event) => {
        const value = event.target.value;
        setSelectedDay(value);
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
                    <ClientDay days={guide?.guide?.days[selectedDay]} />
                </div>
            )}
        </div>
    )
    
}