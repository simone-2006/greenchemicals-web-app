"use client"
import { Search } from "lucide-react";
import Input from "./Input";

export default function SearchInput({ className = "", ...props }) {
    return (
        <div className={`relative max-w-xs flex items-center gap-2 ${className}`}>
            <span className="absolute left-2">
                <Search size={16} className="text-muted" />
            </span>
            <Input
                type="search"
                className="pl-7 w-full"
                autoComplete="off"
                {...props}
            />
        </div>
    );
}
