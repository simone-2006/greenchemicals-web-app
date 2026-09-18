"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    EllipsisVertical,
    MapPin,
    MapPinOff,
    Pencil,
    Trash2,
    Maximize2,
    BriefcaseBusiness,
} from "lucide-react";

import Button from "../Button";

import Table from "@/components/ui/Table";

const MOCK_CUSTOMERS = [
    {
        ID: 1,
        CUSTOMER: "Polymer Solutions SpA",
        AGENT: "simone.penza",
        COUNTRY: "IT",
        TOWN: "Milano",
        Indirizzo: "Via Roma 12",
        latitudine: "45.4642",
        longitudine: "9.1900",
        EMAIL_CONTACTS: "info@polymersolutions.it; sales@polymersolutions.it",
        TELEFONO: "+39 02 1234567",
        FAMILY_CODE: "POL01",
        marker_color: "violet",
        note: "Cliente storico, visita trimestrale",
        arca_COD: "ARCA001",
        IS_CUSTOMER: 1,
        IS_SUPPLIER: 0,
    },
    {
        ID: 2,
        CUSTOMER: "Green Additives GmbH",
        AGENT: "simone.penza/marco.rossi",
        COUNTRY: "DE",
        TOWN: "Munich",
        Indirizzo: "Leopoldstrasse 45",
        latitudine: "48.1374",
        longitudine: "11.5755",
        EMAIL_CONTACTS: "contact@greenadditives.de",
        TELEFONO: "+49 89 987654",
        FAMILY_CODE: "GAD02",
        marker_color: "blue",
        note: "",
        arca_COD: "ARCA002",
        IS_CUSTOMER: 1,
        IS_SUPPLIER: 1,
    },
    {
        ID: 3,
        CUSTOMER: "Nordic Resins AB",
        AGENT: "lucia.bianchi",
        COUNTRY: "SE",
        TOWN: "Stockholm",
        Indirizzo: "Drottninggatan 8",
        latitudine: "",
        longitudine: "",
        EMAIL_CONTACTS: "hello@nordicresins.se",
        TELEFONO: "+46 8 555123",
        FAMILY_CODE: "NRE03",
        marker_color: "green",
        note: "Coordinate da completare",
        arca_COD: "",
        IS_CUSTOMER: 0,
        IS_SUPPLIER: 1,
    },
    {
        ID: 4,
        CUSTOMER: "Iberia Compounds SL",
        AGENT: "simone.penza",
        COUNTRY: "ES",
        TOWN: "Barcelona",
        Indirizzo: "Carrer de Mallorca 200",
        latitudine: "41.3851",
        longitudine: "2.1734",
        EMAIL_CONTACTS: "compras@iberiacompounds.es",
        TELEFONO: "+34 93 111222",
        FAMILY_CODE: "IBC04",
        marker_color: "red",
        note: "Preferisce contatto email",
        arca_COD: "ARCA004",
        IS_CUSTOMER: 1,
        IS_SUPPLIER: 0,
    },
    {
        ID: 5,
        CUSTOMER: "Alpine Masterbatch AG",
        AGENT: "anna.verdi",
        COUNTRY: "CH",
        TOWN: "Zurich",
        Indirizzo: "Bahnhofstrasse 1",
        latitudine: "47.3769",
        longitudine: "8.5417",
        EMAIL_CONTACTS: "office@alpinemasterbatch.ch",
        TELEFONO: "+41 44 333444",
        FAMILY_CODE: "AMB05",
        marker_color: "orange",
        note: "",
        arca_COD: "ARCA005",
        IS_CUSTOMER: 1,
        IS_SUPPLIER: 0,
    },
];

const MARKER_COLORS = {
    violet: "#8b5cf6",
    blue: "#2563eb",
    green: "#22c55e",
    red: "#ef4444",
    orange: "#fbbf24",
    yellow: "#fbbf24",
    grey: "#94a3b8",
    gray: "#94a3b8",
};

function resolveCountryCode(value) {
    const v = (value || "").trim();
    if (!v) return "";
    if (/^[A-Za-z]{2}$/.test(v)) return v.toUpperCase();
    const quickMap = { UK: "GB", UKE: "GB", UAE: "AE", USA: "US" };
    if (quickMap[v.toUpperCase()]) return quickMap[v.toUpperCase()];
    return v.toUpperCase();
}

function CountryCell({ value }) {
    const code = resolveCountryCode(value);
    if (!code) return null;
    const flagCode = code.length === 2 ? code.toLowerCase() : "";

    return (
        <div className="flex items-center gap-2 w-full overflow-hidden">
            {flagCode ? (
                <img
                    src={`https://flagcdn.com/w20/${flagCode}.png`}
                    alt={code}
                    title={code}
                    className="w-5 h-3.5 object-cover border border-border rounded-sm shrink-0"
                />
            ) : null}
            <span className="truncate text-text" title={code}>
                {code}
            </span>
        </div>
    );
}

function EmailsCell({ value }) {
    const emailsRaw = (value || "").trim();
    if (!emailsRaw) return null;

    const emails = emailsRaw
        .split(/[,;/|\s]+/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0 && e.includes("@"));

    if (emails.length === 0) {
        return <span className="text-text">{emailsRaw}</span>;
    }

    return (
        <div className="flex flex-wrap items-center gap-1">
            {emails.map((email) => (
                <a
                    key={email}
                    href={`mailto:${email}`}
                    className="text-brand underline text-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    {email}
                </a>
            ))}
        </div>
    );
}

function MapColorCell({ value, data }) {
    const color = (value || "violet").toLowerCase();
    const hasCoords =
        data?.latitudine &&
        data?.longitudine &&
        data.latitudine !== "" &&
        data.longitudine !== "";
    const fill = MARKER_COLORS[color] || MARKER_COLORS.violet;

    return (
        <div className="flex h-full w-full items-center justify-center">
            {hasCoords ? (
                <MapPin size={18} style={{ color: fill }} title={color} />
            ) : (
                <MapPinOff size={18} className="text-muted" title="No coordinates" />
            )}
        </div>
    );
}

function TypeCell({ data }) {
    const isCustomer =
        data?.IS_CUSTOMER === 1 ||
        data?.IS_CUSTOMER === true ||
        data?.IS_CUSTOMER === "1";
    const isSupplier =
        data?.IS_SUPPLIER === 1 ||
        data?.IS_SUPPLIER === true ||
        data?.IS_SUPPLIER === "1";

    if (!isCustomer && !isSupplier) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 min-h-full">
            {isCustomer ? (
                <span className="rounded bg-background-accent px-1.5 py-0.5 text-xs font-medium text-text">
                    Customer
                </span>
            ) : null}
            {isSupplier ? (
                <span className="rounded bg-background-secondary px-1.5 py-0.5 text-xs font-medium text-text">
                    Supplier
                </span>
            ) : null}
        </div>
    );
}

function ActionsCell(params) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const menuRef = useRef(null);
    const rowId = params?.data?.ID ?? params?.data?.id ?? null;

    const close = useCallback(() => setOpen(false), []);

    // AG Grid ricicla le celle: chiudi il menu se cambia la riga
    useEffect(() => {
        close();
    }, [rowId, close]);

    useEffect(() => {
        if (!open) return undefined;

        const onDocClick = (e) => {
            if (
                menuRef.current?.contains(e.target) ||
                btnRef.current?.contains(e.target)
            ) {
                return;
            }
            close();
        };

        const onScrollOrResize = () => close();

        document.addEventListener("mousedown", onDocClick);
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [open, close]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (open) {
            close();
            return;
        }

        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect) return;

        const menuWidth = 200;
        const menuHeight = 180;
        const gap = 4;
        let top = rect.bottom + gap;
        let left = rect.left;

        if (window.innerHeight - rect.bottom < menuHeight + gap && rect.top > menuHeight) {
            top = rect.top - menuHeight - gap;
        }
        if (left + menuWidth > window.innerWidth) {
            left = Math.max(8, rect.right - menuWidth);
        }
        if (left < 8) left = 8;
        if (top < 8) top = 8;

        setPos({ top, left });
        setOpen(true);
    };

    const items = [
        { icon: Pencil, label: "Edit", variant: "ghost" },
        { icon: Trash2, label: "Delete", variant: "ghostDanger" },
        { icon: Maximize2, label: "Expand details", variant: "ghost" },
        { icon: BriefcaseBusiness, label: "Add visit", variant: "primary" },
    ];

    // Adjusted styles to rely more on @frontend/src/app/globals.css where possible
    const menu = open
        ? createPortal(
            <div
                ref={menuRef}
                // Removed explicit class Tailwind colors/margins that should come from global style
                className="fixed z-99999 min-w-50 rounded-xl bg-background shadow-menu flex flex-col gap-1 p-1 border border-border"
                style={{ top: pos.top, left: pos.left }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label}>
                            {index === 2 ? (
                                // Divider should use a global/GLOBALS.CSS class if available, fallback to specific class
                                <div className="menu-divider" />
                            ) : null}
                            <Button
                                type="button"
                                className="w-full"
                                variant={item.variant}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // UI-only for now — wire handlers later with rowId / params.data
                                    close();
                                }}
                            >
                                <Icon size={18} />
                                <span>
                                    {item.label}
                                </span>
                            </Button>
                        </div>
                    );
                })}
            </div>,
            document.body,
        )
        : null;

    return (
        <div className="relative flex h-10 w-10 items-center justify-center">
            <Button
                ref={btnRef}
                type="button"
                title="Actions"
                variant="ghost"
                className="h-full w-full justify-center"
                onClick={toggleMenu}
            >
                <EllipsisVertical size={20} />
            </Button>
            {menu}
        </div>
    );
}

export default function CustomerTable({ rowData = MOCK_CUSTOMERS }) {
    const columnDefs = useMemo(
        () => [
            { headerName: "ID", field: "ID", hide: true },
            {
                headerName: "",
                colId: "actions",
                resizable: false,
                sortable: false,
                filter: false,
                pinned: "left",
                width: 48,
                maxWidth: 48,
                cellStyle: { padding: 0, display: 0 },
                cellRenderer: ActionsCell,
            },
            {
                headerName: "Customer name",
                field: "CUSTOMER",
                flex: 1.4,
                minWidth: 160,
            },
            {
                headerName: "Agent",
                field: "AGENT",
                flex: 1,
                minWidth: 120,
            },
            {
                headerName: "Location",
                children: [
                    {
                        headerName: "Country",
                        field: "COUNTRY",
                        width: 110,
                        cellRenderer: CountryCell,
                    },
                    {
                        headerName: "Town",
                        field: "TOWN",
                        minWidth: 110,
                    },
                    {
                        headerName: "Address",
                        field: "Indirizzo",
                        minWidth: 140,
                        flex: 1,
                    },
                    { headerName: "Latitude", field: "latitudine", hide: true },
                    { headerName: "Longitude", field: "longitudine", hide: true },
                ],
            },
            {
                headerName: "Email(s)",
                field: "EMAIL_CONTACTS",
                flex: 1.2,
                minWidth: 160,
                cellRenderer: EmailsCell,
            },
            {
                headerName: "Phone",
                field: "TELEFONO",
                minWidth: 120,
            },
            {
                headerName: "Family code",
                field: "FAMILY_CODE",
                minWidth: 110,
            },
            {
                headerName: "Map color",
                field: "marker_color",
                width: 100,
                sortable: false,
                filter: false,
                cellRenderer: MapColorCell,
            },
            {
                headerName: "Notes",
                field: "note",
                flex: 1,
                minWidth: 140,
            },
            {
                headerName: "Cod ARCA",
                field: "arca_COD",
                minWidth: 110,
            },
            {
                headerName: "Type",
                colId: "type",
                minWidth: 160,
                valueGetter: (params) => {
                    const isCustomer =
                        params.data?.IS_CUSTOMER === 1 ||
                        params.data?.IS_CUSTOMER === true ||
                        params.data?.IS_CUSTOMER === "1";
                    const isSupplier =
                        params.data?.IS_SUPPLIER === 1 ||
                        params.data?.IS_SUPPLIER === true ||
                        params.data?.IS_SUPPLIER === "1";
                    const labels = [];
                    if (isCustomer) labels.push("Customer");
                    if (isSupplier) labels.push("Supplier");
                    return labels.join(" ");
                },
                cellRenderer: TypeCell,
            },
        ],
        [],
    );

    return (
        <Table
            rowData={rowData}
            columnDefs={columnDefs}
            localeText={{
                noRowsToShow:
                    "No customer found matching your username, if you want to add a customer click on the button 'Add Customer'",
            }}
        />
    );
}
