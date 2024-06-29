import { Button } from "../ui/button";

export default function ClientInfo({ client, setActiveComponent }) {
    return ( 
        <div className="h-[60vh] md:h-auto mx-12 mt-6 flex flex-col">
            <div className=" flex flex-col-reverse">
                <div className="flex justify-evenly items-center">
                    <p className="text-5xl font-extrabold">{client.userName}</p>
                    {client.profileImage ? (
                        <img className="size-32" src={client.profileImage} alt="Profile image" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-32">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:gap-56 gap-4 md:flex-row border-t md:mx-auto pt-4">
                <div className="flex flex-col">
                    <p className="text-xl font-bold mb-2">Trainer Information</p>
                    <p><span className="font-semibold">Email:</span> {client.email}</p>
                    <p><span className="font-semibold">Name:</span> {client.firstName} {client.lastName}</p>
                </div>
                <Button
                    size="lg"
                    className="mt-auto"
                    onClick={() => setActiveComponent("chat")}>
                    Contact Client
                </Button>
            </div>
        </div>
    )
}