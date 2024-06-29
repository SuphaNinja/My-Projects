



export default function ClientExercise(exercises) {
    if (exercises) {
        return (
            <div className="w-full mt-6 overflow-y-auto">
                {exercises?.exercises?.length < 1 ? (
                    <p className="text-center text-xl font-semibold">Get some rest, today is a restday!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5">
                        {exercises?.exercises?.map((exercise, index) => (
                            <div key={index} className="col-span-1 md:border-x">
                                <p className="text-center border-b font-semibold" >{exercise.exerciseName}</p>
                                <div className="flex flex-col gap-2 px-2 pt-2">
                                    <p className="text-sm">Amount: <span>{exercise.time}</span></p>
                                    <p className="text-sm">Calories burned: <span>{exercise.burnedCalories}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
}


