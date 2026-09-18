"use client";

import { FIELD_COMMON_CLASSES, getFieldWidthClass, getVariantClass } from "./fieldStyles";

const COMMON_CLASSES = `${FIELD_COMMON_CLASSES} h-8 py-1`;

function Input({
    type = "text",
    variant = "default",
    icon = null,
    className = "",
    ...props
}) {
    if (type === "checkbox" || type === "radio") {
        return (
            <input
                type={type}
                className={`size-4 shrink-0 accent-brand ${className}`}
                {...props}
            />
        );
    }

    const variantClass = getVariantClass(variant);
    const widthClass = getFieldWidthClass(className);
    const input = (
        <input
            type={type}
            className={`${COMMON_CLASSES} ${widthClass} ${variantClass} ${icon ? "pl-7" : ""} ${className}`}
            {...props}
        />
    );

    if (!icon) return input;

    return (
        <div className={`relative inline-flex w-full ${widthClass}`}>
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted">
                {icon}
            </span>
            {input}
        </div>
    );
}

export default Input;
