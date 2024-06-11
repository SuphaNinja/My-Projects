import { useState } from "react";
import Exercise from "./Exercise"
import Meal from "./Meal"


export default function Day(day) {
   
    const [activeComponent, setActiveComponent] = useState('exercise');

    if (!day) {
        return null
    }
    const renderComponent = () => {
        switch (activeComponent) {
            case 'meal':
                return <Meal meal={day.days?.mealPlans} />;
            case 'exercise':
                return <Exercise exercises={day.days?.exercises} />;

            default:
                return null;
        }
    };

    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    

    return (
        <div className="flex flex-col h-full">
            <div className="flex">
                <p className="text-4xl mb-2 font-semibold text-center mx-auto">{days[day.days?.dayNumber - 1]}</p>
            </div>
            <div className="w-full h-full flex justify-center gap-24">
                <button
                    onClick={() => setActiveComponent('exercise')}
                    className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'exercise' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                    Exercises
                </button>
                <button
                    onClick={() => setActiveComponent('meal')}
                    className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'meal' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                    Meals
                </button>
            </div>
            <div>
                {renderComponent()}
            </div>
            
        </div>
    )
}   