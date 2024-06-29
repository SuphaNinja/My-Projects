import { useState } from "react";
import Exercise from "./Exercise"
import Meal from "./Meal"
import { Button } from "../ui/button";


export default function Day(day) {
    const [activeComponent, setActiveComponent] = useState('exercise');

    if (!day) {
        return null;
    };

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
                <p className="text-4xl font-semibold text-center mx-auto">{days[day.days?.dayNumber - 1]}</p>
            </div>
            <div className="flex justify-center gap-24">
                <Button
                    variant="link"
                    onClick={() => setActiveComponent('exercise')}
                    className={`${activeComponent === 'exercise' && "underline"}`}>
                    Exercises
                </Button>
                <Button
                    variant="link"
                    onClick={() => setActiveComponent('meal')}
                    className={` ${activeComponent === 'meal' && "underline"}`}>
                    Meals
                </Button>
            </div>
            <div>
                {renderComponent()}
            </div>
        </div>
    )
}   