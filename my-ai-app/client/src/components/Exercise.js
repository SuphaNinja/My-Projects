



export default function Exercise(exercises) {


    if (exercises) {
        return (
            <div className="mt-6">
                <div className="w-full ">
                    {exercises?.exercises?.length < 1 ? (
                        <div>
                            <p className="text-center text-xl font-semibold">Get some rest, today is a restday!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5">
                        {exercises?.exercises?.map((exercise, index) => (
                            <div key={index} className="col-span-1 border-x-2 border-slate-200">
                                <p className="text-center border-b-2 pb-1 font-semibold" >{exercise.exerciseName}</p>
                                <div className="flex flex-col gap-2 px-2 pt-2">
                                    <p className="text-sm">Amount: <span>{exercise.time}</span></p>
                                    <p className="text-sm">Calories burned <span>{exercise.burnedCalories}</span></p>
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
}


