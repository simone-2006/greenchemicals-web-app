"use client";

const FIELD_CLASSES =
    "min-h-20 w-full resize-y rounded-md border border-border bg-background-element px-2 py-1.5 text-xs font-semibold leading-4 text-text placeholder:text-muted transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:border-border disabled:bg-background-secondary disabled:text-muted disabled:pointer-events-none aria-invalid:border-danger";

function Textarea({
    rows = 4,
    className = "",
    ...props
}) {
    return (
        <textarea
            rows={rows}
            className={`${FIELD_CLASSES} ${className}`}
            {...props}
        />
    );
}

export default Textarea;
