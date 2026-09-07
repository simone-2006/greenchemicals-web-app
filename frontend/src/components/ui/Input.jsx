"use client";

import { Search } from "lucide-react";

const FIELD_CLASSES =
    "h-8 w-full max-w-xs rounded-md border border-border bg-background-element px-2 py-1 text-xs font-semibold leading-4 text-text placeholder:text-muted transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:border-border disabled:bg-background-secondary disabled:text-muted disabled:pointer-events-none aria-invalid:border-danger";

export default function Input({
    type = "text",
    className = "",
    ...props
}) {
    return (
        <input
            type={type}
            className={`${FIELD_CLASSES} ${className}`}
            {...props}
        />
    );
}

