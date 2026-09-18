export const FIELD_VARIANT_CLASSES = {
    default:
        "border border-border bg-background-element text-text",
    primary:
        "border border-transparent text-brand bg-background-accent/30 hover:bg-background-accent focus-visible:bg-background-accent",
    superPrimary:
        "border border-transparent text-text-inverted bg-brand hover:bg-brand-dark focus-visible:bg-brand-dark",
    ghost:
        "border border-border bg-transparent text-text hover:bg-background-secondary/60",
    ghostWarning:
        "border border-border bg-transparent text-warning hover:bg-background-secondary/60",
    ghostDanger:
        "border border-border bg-transparent text-danger hover:bg-background-secondary/60",
    ghostSuccess:
        "border border-border bg-transparent text-success hover:bg-background-secondary/60",
    success:
        "border border-transparent text-success bg-success-bg/30 hover:bg-success-bg focus-visible:bg-success-bg",
    danger:
        "border border-transparent text-danger bg-danger-bg/30 hover:bg-danger-bg focus-visible:bg-danger-bg",
    warning:
        "border border-transparent text-warning bg-warning-bg/30 hover:bg-warning-bg focus-visible:bg-warning-bg",
};

export const CONTROL_COMMON_CLASSES =
    "rounded-md px-2 text-xs leading-4 transition-colors duration-150 disabled:border-border disabled:bg-background-secondary disabled:text-muted disabled:pointer-events-none";

export const FIELD_COMMON_CLASSES =
    `${CONTROL_COMMON_CLASSES} w-full font-normal placeholder:text-muted aria-invalid:border-danger`;

export const BUTTON_COMMON_CLASSES =
    `${CONTROL_COMMON_CLASSES} inline-flex h-8 items-center gap-1 py-1 font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus whitespace-nowrap`;

export function getVariantClass(variant) {
    return FIELD_VARIANT_CLASSES[variant] || FIELD_VARIANT_CLASSES.default;
}

export function getFieldWidthClass(className = "") {
    return /\bmax-w-/.test(className) ? "" : "max-w-xs";
}
