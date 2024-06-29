


export default function InfoCard({ title, text, icon }: any) {
    return (
        <div className="rounded-xl flex flex-col p-4 border shadow-xl min-h-[300px] w-[350px]">
            <div className="">
                {icon}
            </div>
            <h2 className="text-xl font-semibold mt-4">{title}</h2>
            <p className="mt-2">{text}</p>
        </div>
    )
}