import { useState } from 'react';
import  Link from 'next/link';

const HoverableLink = ({ className, icon, text, href }: { icon?: JSX.Element, text?: React.ReactNode, href: string, className?: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className='relative'>
        <Link 
            className="hover:cursor-pointer hover:brightness-75 relative" 
            href={href}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            {icon}
            
        </Link>
        {isHovered ? (
            <div 
            className={`text-xl p-2 bg-slate-900 rounded-md text-white absolute bottom-0 left-full mt-2 ml-1${className}`}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            >
                {text}
            </div>
        ): null}
        </div>
    );
};

export default HoverableLink;