"use client";

import { FIELD_COMMON_CLASSES, getFieldWidthClass, getVariantClass } from "./fieldStyles";

const COMMON_CLASSES = `${FIELD_COMMON_CLASSES} min-h-20 resize-y py-1.5`;

function Textarea({
    rows = 4,
    variant = "default",
    className = "",
    ...props
}) {
    return (
        <textarea
            rows={rows}
            className={`${COMMON_CLASSES} ${getFieldWidthClass(className)} ${getVariantClass(variant)} ${className}`}
            {...props}
        />
    );
}

export default Textarea;
