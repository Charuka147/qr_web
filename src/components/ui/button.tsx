import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm border border-blue-600",
      secondary:
        "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700",
      outline:
        "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 bg-transparent",
      ghost:
        "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 bg-transparent",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-xs",
      subtle:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/50 dark:border-blue-800/50",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2 h-10 gap-2",
      lg: "text-base px-5 py-2.5 h-12 gap-2.5 font-semibold",
      icon: "w-9 h-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
