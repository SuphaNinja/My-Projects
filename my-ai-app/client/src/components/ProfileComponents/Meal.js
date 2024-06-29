export default function Meal(meal) {
    if (meal === undefined) {
        return null
    };

    return (
        <div className="w-full mt-6">
            <div className="grid grid-cols-1 md:grid-cols-5">
            {meal?.meal?.map((meal, index) => (
                    <div key={index} className="col-span-1 overflow-y-scroll no-scrollbar md:border-x">
                        <p className="text-center border-b pb-1 font-semibold first-letter:uppercase" >{meal.mealType}</p>
                        <div className="flex flex-col gap-4 px-2 pt-2">
                            {meal.ingredients.map((ingredient, index) => (
                                <div className="flex pb-1  flex-col text-sm gap-2" key={index}>
                                    <p className="font-semibold">1. <span>{ingredient.name}</span></p>
                                    <p>Amount: <span>{ingredient.grams}</span></p>
                                    <p>Calories. <span>{ingredient.calories}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}