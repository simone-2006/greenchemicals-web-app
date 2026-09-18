"use client";

import { ChevronDown } from "lucide-react";
import { FIELD_COMMON_CLASSES, getFieldWidthClass, getVariantClass } from "./fieldStyles";

const COMMON_CLASSES = `${FIELD_COMMON_CLASSES} h-8 appearance-none py-1 pr-7 cursor-pointer`;

function Select({
    children,
    variant = "default",
    className = "",
    ...props
}) {
    const variantClass = getVariantClass(variant);
    const widthClass = getFieldWidthClass(className);

    return (
        <div className={`relative w-full ${widthClass}`}>
            <select
                className={`${COMMON_CLASSES} max-w-none ${variantClass} ${className}`}
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
