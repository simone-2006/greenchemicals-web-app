"use client";

import { useState } from "react";

const SWITCH_ON_CLASSES = {
    default: "bg-brand",
    primary: "bg-brand",
    superPrimary: "bg-brand",
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning",
};

function Switch({
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    variant = "default",
    className = "",
    ...props
}) {
    const [internal, setInternal] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : internal;
    const onClass = SWITCH_ON_CLASSES[variant] || SWITCH_ON_CLASSES.default;

    function handleToggle() {
        const next = !isOn;
        if (!isControlled) setInternal(next);
        onChange?.(next);
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isOn}
            disabled={disabled}
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:bg-background-secondary ${isOn ? onClass : "bg-background-secondary"} ${className}`}
            {...props}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md transition-transform duration-150 ease-out ${isOn ? "translate-x-[22px]" : "translate-x-0.5"}`}
            />
        </button>
    );
}

export default Switch;
