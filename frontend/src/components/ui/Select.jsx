"use client";

import { ChevronDown } from "lucide-react";

const FIELD_CLASSES =
    "h-8 w-full appearance-none rounded-md border border-border bg-background-element px-2 py-1 pr-7 text-xs font-semibold leading-4 text-text transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:border-border disabled:bg-background-secondary disabled:text-muted disabled:pointer-events-none aria-invalid:border-danger";

function Select({
    children,
    className = "",
    ...props
}) {
    return (
        <div className="relative inline-block w-full">
            <select
                className={`${FIELD_CLASSES} ${className}`}
                {...props}
            >
                {children}
            </select>
            <ChevronDown
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
            />
        </div>
    );
}

export default Select;
