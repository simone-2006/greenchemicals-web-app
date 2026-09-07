"use client";

import { useState } from "react";

function Switch({
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    className = "",
    ...props
}) {
    const [internal, setInternal] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : internal;

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
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 ${isOn ? "bg-success" : "bg-background-secondary"} ${className}`}
            {...props}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${isOn ? "translate-x-[22px]" : "translate-x-0.5"}`}
            />
        </button>
    );
}

export default Switch;
