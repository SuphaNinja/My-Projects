



export default function Meal(meal) {


    if (meal === undefined) {
        return <></>
    }


    return (
        <div className="mt-6">
            <button onClick={() => console.log(meal)}>console meal</button>
            <div className="w-full ">
                {meal?.meal?.length < 1 ? (
                    <div>
                        <p className="text-center text-xl font-semibold">Get some rest, today is a restday!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5">
                    {meal?.meal?.map((meal, index) => (
                            <div key={index} className="col-span-1 border-x-2 border-slate-200">
                                <p className="text-center border-b-2 pb-1 font-semibold" >{meal.mealType}</p>
                                <div className="flex flex-col gap-2 px-2 pt-2">
                                    <p className="text-sm">Amount: <span>{meal.time}</span></p>
                                    <p className="text-sm">Calories burned <span>{meal.burnedCalories}</span></p>
                                    <p></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}