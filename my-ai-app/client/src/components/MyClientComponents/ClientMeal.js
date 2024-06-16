



export default function ClientMeal(meal) {


    if (meal === undefined) {
        return <></>
    }


    return (
        <div className="mt-6">
            <div className="w-full ">
                {meal?.meal?.length < 1 ? (
                    <div>
                        <p className="text-center text-xl font-semibold">Get some rest, today is a restday!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5">
                        {meal?.meal?.map((meal, index) => (
                            <div key={index} className="col-span-1 overflow-y-scroll no-scrollbar border-x-2 border-slate-200">
                                <p className="text-center border-b-2 pb-1 font-semibold first-letter:uppercase" >{meal.mealType}</p>
                                <div className="flex flex-col gap-2 px-2 pt-2">
                                    {meal.ingredients.map((ingredient, index) => (
                                        <div className="flex  pb-1 flex-col text-xs gap-2" key={index}>
                                            <p>1. <span>{ingredient.name}</span></p>
                                            <p>Amount: <span>{ingredient.grams}</span></p>
                                            <p>Calories. <span>{ingredient.calories}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}