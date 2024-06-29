export default function TopBanner() {
    return (
        <div className="flex flex-col w-full">
            <div className="mt-12">
                <h1 className="text-center mb-4 font-light text-4xl">Delivering Happiness</h1>
                <p className="text-center font-bold text-5xl mb-6 text-emerald-600">Worldwide!</p>
            </div>
            <div className="bg-transparent mx-auto max-h-[600px] max-w-[1200px]">
                <img className="bg-transparent rounded-md" src="https://i.gyazo.com/b4d141e3d3af6ac982c604bb381d1eb6.png" />
            </div>
        </div>
    )
};