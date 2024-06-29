"use client"
import { useState } from 'react'
import Flag from 'react-world-flags'

export default function FlagWithText({ countryCode, title, text }: any) {
    const [showText, setShowText] = useState(false)

    return (
        <div className='relative'>
            <div className={`h-12 w-16 md:mb-4 rounded-xl ${showText ? "mx-auto " : ""}`}>
                <button onClick={() => setShowText(!showText)} className='h-full w-full'>
                    <Flag
                        code={countryCode}
                        className={`h-full m-auto hover:w-full transition-all cursor-pointer rounded-full w-2/3 ${showText ? "w-full " : ""}`}
                    />
                </button>
            </div>
            <hr />
            {showText &&
                <div className='mx-auto'>
                    <h1 className='text-center md:text-2xl'>{title}</h1>
                    <p className='text-center mt-2'>{text}</p>
                </div>
            }
        </div>
    )
}