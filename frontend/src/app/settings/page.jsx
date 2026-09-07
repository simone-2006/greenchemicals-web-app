"use client";

import { useState } from "react";
import Title from "@/components/layout/Title";
import Button from "@/components/ui/Button";
import { Settings, User, Sliders, Mail, LogOut, RotateCcwKey } from "lucide-react";

const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "general", label: "General", icon: Sliders },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account");

    return (
        <div>
            <Title icon={<Settings size={20} />} subtitle="Customize your settings">
                Settings
            </Title>

            <div className="mt-4 flex w-full sm:w-auto">
                <div
                    className="flex w-full items-center gap-1 rounded-md border border-border p-1 sm:w-auto"
                    role="tablist"
                    aria-label="Settings sections"
                >
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <Button
                            key={id}
                            variant={activeTab === id ? "primary" : "ghost"}
                            className="flex-1 justify-center sm:flex-none"
                            onClick={() => setActiveTab(id)}
                            aria-pressed={activeTab === id}
                            role="tab"
                        >
                            <Icon size={14} />
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="mt-4 rounded-md border border-border bg-background-element p-4">
                {activeTab === "account" && (
                    <div>
                        <h2 className="mb-2 text-lg font-bold text-text">
                            Account
                        </h2>
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <div className="min-w-16 min-h-16 max-w-16 max-h-16 w-16 h-16 resize-none  bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                SP
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-semibold text-text ">
                                    SIMO
                                </h4>
                                <h3 className="text-text">
                                    Simone Penza
                                </h3>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Mail size={16}></Mail>
                                    <p className="text-sm break-all">
                                        penza@greenchemicals.green
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="primary" className="mt-2">
                                <RotateCcwKey size={16} />
                                Change yout password
                            </Button>
                            <Button variant="danger" className="mt-2">
                                <LogOut size={16} />
                                Log out
                            </Button>
                        </div>

                    </div>
                )}
                {activeTab === "general" && (
                    <div>
                        <h2 className="mb-2 text-lg font-bold text-text">
                            Impostazioni Generali
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}
