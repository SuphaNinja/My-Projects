import classNames from "classnames";
import { Link } from "react-router-dom";


export default function SubmitButton({ apiInfo }) {
    const buttonClass = classNames(
        'col-span-4 w-full md:w-1/2 py-2 rounded-lg mx-auto bg-slate-950 dark:bg-slate-200 text-white dark:text-black hover:bg-slate-900 font-semibold transition-all',
        {
            'dark:bg-slate-200 hover:bg-slate-800 hover:underline': !apiInfo.isPending && !apiInfo.isSuccess,
            'bg-cyan-700 hover:bg-cyan-800 cursor-not-allowed': apiInfo.isPending,
            'cursor-not-allowed': apiInfo.isPending || (apiInfo.isSuccess && !apiInfo?.data?.data?.error),
            'opacity-50': apiInfo.isPending
        }
    );

    return (
        apiInfo.isSuccess && !apiInfo?.data?.data?.error ? (
            <Link 
                to="/myjourney" 
                className="col-span-4 w-full md:w-1/2 py-2 text-center hover:underline rounded-lg mx-auto dark:bg-green-400 dark:text-black text-white bg-green-800 hover:bg-green-800 font-semibold transition-all">
                    View guide
            </Link>
        ):(
            <button
                type="submit"
                className={buttonClass}
                disabled={apiInfo.isPending || (apiInfo.isSuccess && !apiInfo?.data?.data?.error)}
            >
                {apiInfo.isPending ? 'Creating guide... (this might take a minute or two)' : 'Start your journey!'}
            </button> 
        )
    
    );
}