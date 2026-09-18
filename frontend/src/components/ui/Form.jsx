"use client";

import { isValidElement, useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import Switch from "./Switch";
import Button from "./Button";

const INPUT_TYPES = new Set([
    "text",
    "email",
    "password",
    "number",
    "tel",
    "url",
    "date",
    "time",
    "datetime-local",
    "search",
]);

function FieldLabel({ htmlFor, label, required }) {
    if (!label) return null;
    return (
        <label
            htmlFor={htmlFor}
            className="text-xs font-semibold leading-4 text-text"
        >
            {label}
            {required ? <span className="text-danger"> *</span> : null}
        </label>
    );
}

function renderControl(field, value, onFieldChange) {
    const {
        name,
        type = "text",
        render,
        options = [],
        placeholder,
        disabled,
        required,
        variant = "default",
        className = "",
        props = {},
    } = field;
    const id = field.id || name;

    if (typeof render === "function") {
        return render({
            id,
            name,
            value,
            onChange: (next) => onFieldChange(name, next),
            field,
        });
    }

    if (type === "select") {
        return (
            <Select
                id={id}
                name={name}
                value={value ?? ""}
                disabled={disabled}
                required={required}
                variant={variant}
                className={`max-w-none ${className}`}
                onChange={(e) => onFieldChange(name, e.target.value)}
                {...props}
            >
                {placeholder ? (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                ) : null}
                {options.map((opt) => {
                    const optValue = typeof opt === "object" ? opt.value : opt;
                    const optLabel = typeof opt === "object" ? opt.label : opt;
                    return (
                        <option key={String(optValue)} value={optValue}>
                            {optLabel}
                        </option>
                    );
                })}
            </Select>
        );
    }

    if (type === "textarea") {
        return (
            <Textarea
                id={id}
                name={name}
                value={value ?? ""}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                variant={variant}
                className={`max-w-none ${className}`}
                onChange={(e) => onFieldChange(name, e.target.value)}
                {...props}
            />
        );
    }

    if (type === "switch") {
        return (
            <div className="flex h-8 items-center">
                <Switch
                    id={id}
                    name={name}
                    checked={Boolean(value)}
                    disabled={disabled}
                    variant={variant}
                    className={className}
                    onChange={(next) => onFieldChange(name, next)}
                    {...props}
                />
            </div>
        );
    }

    return (
        <Input
            id={id}
            name={name}
            type={INPUT_TYPES.has(type) ? type : "text"}
            value={value ?? ""}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            variant={variant}
            className={`max-w-none ${className}`}
            onChange={(e) => onFieldChange(name, e.target.value)}
            {...props}
        />
    );
}

export default function Form({
    fields = [],
    values,
    defaultValues = {},
    onChange,
    onSubmit,
    onCancel,
    submitLabel = "Salva",
    cancelLabel = "Annulla",
    showCancel = false,
    hideActions = false,
    className = "",
    footer,
    ...formProps
}) {
    const isControlled = values !== undefined;
    const [internal, setInternal] = useState(defaultValues);
    const current = isControlled ? values : internal;

    function setField(name, nextValue) {
        const next = { ...current, [name]: nextValue };
        if (!isControlled) setInternal(next);
        onChange?.(next, name, nextValue);
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit?.(current, event);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex w-full flex-col gap-4 ${className}`}
            {...formProps}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {fields.map((field, index) => {
                    if (field == null) return null;

                    if (isValidElement(field)) {
                        return (
                            <div key={field.key ?? index} className="md:col-span-2">
                                {field}
                            </div>
                        );
                    }

                    const key = field.name || field.id || index;
                    const spanClass = field.colSpan === 2 ? "md:col-span-2" : "";

                    return (
                        <div
                            key={key}
                            className={`flex min-w-0 flex-col gap-1 ${spanClass} ${field.wrapperClassName || ""}`}
                        >
                            <FieldLabel
                                htmlFor={field.id || field.name}
                                label={field.label}
                                required={field.required}
                            />
                            {field.description ? (
                                <p className="text-xs text-muted">{field.description}</p>
                            ) : null}
                            {renderControl(field, current[field.name], setField)}
                            {field.error ? (
                                <p className="text-xs text-danger">{field.error}</p>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {footer !== undefined ? (
                footer
            ) : hideActions ? null : (
                <div className="flex items-center justify-end gap-2">
                    {showCancel || onCancel ? (
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            {cancelLabel}
                        </Button>
                    ) : null}
                    <Button type="submit" variant="primary">
                        {submitLabel}
                    </Button>
                </div>
            )}
        </form>
    );
}
