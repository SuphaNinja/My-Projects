import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "../../lib/utils";

export function CustomSelect({ name, value, onChange, className, children, required, disabled }) {
  const handleOptionClick = (event, optionValue) => {
    event.preventDefault();
    onChange(optionValue);
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        disabled={disabled}
      >
        <SelectValue>{value ? children.find(option => option.props.value === value)?.props.children : "Choose an option"}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className={cn(
          "w-full mt-1 rounded-md border border-input bg-background text-sm shadow-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <SelectGroup>
          {React.Children.map(children, (child) => {
            if (child.type === "option") {
              return (
                <option
                  value={child.props.value}
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => console.log(child.props)}
                >
                  {child.props.children}
                </option>
              );
            }
            return null;
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
