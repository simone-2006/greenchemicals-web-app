"use client";

const VARIANT_CLASSES = {
    default:
        "border-border bg-background-element text-text",
    primary:
        "text-brand bg-background-accent/30 hover:bg-background-accent",
    ghost:
        "border border-border bg-transparent text-text hover:bg-background",
    success:
        "text-success bg-success-bg/30 hover:bg-success-bg",
    danger:
        "text-danger bg-danger-bg/30 hover:bg-danger-bg",
    warning:
        "text-warning bg-warning-bg/30 hover:bg-warning-bg",
};

const COMMON_CLASSES =
    "flex h-8 items-center gap-1 rounded-md  px-2 py-1 text-xs font-semibold leading-4 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:border-border disabled:bg-background-secondary disabled:text-muted disabled:pointer-events-none";

function Button({
    children,
    onClick,
    type = "button",
    variant = "default",
    className = "",
    ...props
}) {
    const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;
    return (
        <button
            type={type}
            className={`${COMMON_CLASSES} ${variantClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
