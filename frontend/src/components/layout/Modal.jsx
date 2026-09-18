"use client"
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Modal({ title = "modal title", children, show = false, onClose }) {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
    }, [show]);

    if (!visible) return null;

    return (
        <div className="absolute top-0 left-0 min-h-screen min-w-screen flex items-center justify-center backdrop-blur-sm bg-overlay z-99999">
            <div className="flex flex-col text-xl text-text-inverted font-bold w-3/4 h-3/4">
                <div className="bg-brand p-4 rounded-t-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">{title}</div>
                    <button
                        className="cursor-pointer"
                        aria-label="Close"
                        onClick={() => { setVisible(false); if (onClose) onClose(); }}
                    >
                        <X />
                    </button>
                </div>
                <div className="bg-background p-4 min-w-10 min-h-10 rounded-b-xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
