import { cn } from "clsx-tailwind-merge";




interface PasswordStrengthProps {
    passStrength: number;
};

const PasswordStrength = ({ passStrength }: PasswordStrengthProps) => {
    return (
        <div className="flex gap-4   col-span-2">
            {Array.from({ length: passStrength + 1 }).map((i, index) => (
                <div key={index}
                    className={cn("h-2 w-1/4 rounded-xl", {
                        "bg-red-500": passStrength === 0,
                        "bg-orange-500": passStrength === 1,
                        "bg-yellow-500": passStrength === 2,
                        "bg-green-500": passStrength === 3,
                    })}
                ></div>
            ))}
        </div>
    )
};

export default PasswordStrength