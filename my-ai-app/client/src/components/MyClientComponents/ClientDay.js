import { useState } from "react";
import ClientExercise from "./ClientExercise";
import ClientMeal from "./ClientMeal";
import { Button } from "../ui/button";


export default function ClientDay(day) {

    const [activeComponent, setActiveComponent] = useState('exercise');

    if (!day) {
        return null
    }
    const renderComponent = () => {
        switch (activeComponent) {
            case 'meal':
                return <ClientMeal meal={day.days?.mealPlans} />;
            case 'exercise':
                return <ClientExercise exercises={day.days?.exercises} />;

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
                <Button
                    variant="link"
                    onClick={() => setActiveComponent('exercise')}
                    className={` ${activeComponent === 'exercise' && "underline"}`}>
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