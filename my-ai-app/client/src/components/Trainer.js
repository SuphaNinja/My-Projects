


export default function Trainer({trainer, setActiveComponent}) {



    return (
        <div className=" md:border-2  border-slate-300 h-[60vh] md:h-auto md:rounded-xl bg-gradient-to-t mt-8 md:bg-gradient-to-r from-gray-800 via-gray-900 to-black overflow-hidden flex flex-col">
            <div className=" md:grid flex flex-col-reverse bg-gradient-to-t border-slate-300 md:bg-gradient-to-r from-gray-800 border-b via-gray-900 to-black md:grid-cols-8">
                <div className="col-span-5 ">
                    <div className="flex items-center justify-center w-full h-full p-4 rounded-lg shadow-lg">
                        <p className="relative text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient">
                            {trainer.userName}
                            <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-100 blur-xl"></span>
                        </p>
                    </div>
                </div>
                <div className="col-span-3 ">
                    {trainer.profileImage ? (
                        <div className="flex items-center w-full justify-center">
                            <img className="size-32" src={trainer.profileImage} alt="Profile image"/>
                        </div>
                    ): (
                        <div className="flex items-center w-full justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-32">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:grid md:grid-cols-3 flex flex-col py-4 md:px-8">
                <div className="md:col-span-2 col-span-3 flex flex-col mx-auto mt-12 md:mt-0 md:mx-0 mb-4 md:mb-0 text-white">
                    <p className="text-xl font-bold mb-2">Trainer Information</p>
                    <p className="mb-1"><span className="font-semibold">Email:</span> {trainer.email}</p>
                    <p className="mb-1"><span className="font-semibold">Name:</span> {trainer.firstName} {trainer.lastName}</p>
                    <p className="mb-1"><span className="font-semibold">Number of Clients:</span> {trainer.clients.length}</p>
                </div>
                <div className="md:col-span-1 col-span-3 flex items-center justify-center">
                    <button 
                        onClick={() => setActiveComponent("chat")}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:from-emerald-600 hover:to-emerald-800 transition duration-300 ease-in-out transform hover:scale-110">
                        Contact Trainer
                    </button>
                </div>
            </div>
        </div>
    )
}