import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600",
            className
          )}
          {...props}
        />
        {error ? <p className="text-xs text-red-500 mt-1 font-medium">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";
