






export default function ClientGoal({ guide }) {

    if (guide) {
        return (
            <div className="my-4">
                <h2 className="text-lg md:text-xl text-center font-semibold mb-2">Tips to reach your goal!</h2>
                <div className="md:mx-12 bg-slate-800 overflow-y-auto md:rounded-lg p-2 md:h-[320px] no-scrollbar md:p-4 shadow-md">

                    <p className="text-pretty md:text-lg ">
                        {guide.tipsToReachGoal}
                    </p>
                </div>

            </div>
        )
    } 
}