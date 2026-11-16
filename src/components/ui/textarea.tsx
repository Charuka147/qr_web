import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
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

Textarea.displayName = "Textarea";
