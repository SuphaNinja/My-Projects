import { useState } from "react";
import Day from "./Day";


export default function Guide(guide) {

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
                <button onClick={() => console.log(guide)}>console the guide </button>
                <div className="ml-auto mr-2">
                    <select className="bg-slate-500 text-black rounded-md" onChange={handleDayChange}>
                        <option value="0">-- Select a Day --</option>
                        {days.map((day, index) => (
                            <option key={index} value={index}>
                                {day}
                            </option>
                        ))}
                    </select>
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