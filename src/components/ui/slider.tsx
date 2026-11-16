import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue?: string | number;
  onChange: (value: number) => void;
}

export function Slider({
  className,
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
  ...props
}: SliderProps) {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label ? (
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-slate-500 font-mono">
            {displayValue !== undefined ? displayValue : value}
          </span>
        </div>
      ) : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
        {...props}
      />
    </div>
  );
}
