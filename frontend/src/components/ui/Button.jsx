"use client";

import { BUTTON_COMMON_CLASSES, getVariantClass } from "./fieldStyles";

function Button({
    children,
    onClick,
    type = "button",
    variant = "default",
    className = "",
    ref,
    ...props
}) {
    return (
        <button
            ref={ref}
            type={type}
            className={`${BUTTON_COMMON_CLASSES} ${getVariantClass(variant)} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
