



export default function ClientInfo({ client, setActiveComponent }) {



    return ( 
        <div className="flex mt-4 md:mx-24 p-6 flex-col bg-gradient-to-b from-slate-80000 to-slate-600 md:rounded-xl">
            <div className="flex justify-between border-b-2">
                <p className="text-2xl text-center mx-auto semibold my-auto">{client.userName}</p>
                <div className=" flex items-center">
                    {client.profileImage ? (
                        <div className="size-full">
                            <img src={client.profileImage} />
                        </div>
                    ) : (
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                    )}
                </div>
                
            </div>
            <div className="grid mt-4 grid-cols-4">
                <div className="col-span-2 gap-2 flex flex-col">
                    <p className="text-lg">Email: <span>{client.email}</span></p>
                    <p className="text-lg">Name: <span>{client.firstName} {client.lastName}</span></p>
                </div>
                <div className="col-span-2">
                    <div className="md:col-span-1 col-span-3 flex  items-center justify-center">
                        <button
                            onClick={() => setActiveComponent("chat")}
                            className="bg-gradient-to-r  from-emerald-500 to-emerald-700 text-white font-bold py-2 px-4 rounded-full shadow-md hover:from-emerald-600 hover:to-emerald-800 transition duration-300 ease-in-out transform hover:scale-110">
                            Contact client
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}