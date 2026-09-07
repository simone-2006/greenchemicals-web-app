"use client"
import { Calendar, Star, StickyNotePlus } from "lucide-react";
import Button from "@/components/ui/Button";

function Badge({ type }) {
    let colorClass = "";

    switch (type.toLowerCase()) {
        case "customer":
            colorClass = "bg-background-accent text-brand";
            break;
        case "supplier":
            colorClass = "border border-border bg-background-secondary text-text";
            break;
        default:
            colorClass = "border";
            break;
    }

    return (
        <span
            className={
                `
                inline-flex items-center gap-1
                rounded-full 
                px-2 py-0.5
                text-xs leading-4 font-semibold
                ${colorClass}
            `
            }
        >
            {type}
        </span>
    );
}

const IMPORTANCE_COLORS = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
};

function Importance({ level = "GOLD" }) {
    const color = IMPORTANCE_COLORS[level.toLowerCase()] || IMPORTANCE_COLORS.gold;

    return (
        <div className="mt-1 flex items-center gap-2">
            <Star
                size={16}
                fill="currentColor"
                className="shrink-0"
                style={{ color }}
                translate="no"
            />
            <span className="text-sm font-medium text-text">{level}</span>
        </div>
    );
}

const SAMPLE_REPORT = `Lorem df saofnhsuiah nfuisah fui sphfu psfsahufhsa uihsau fsa  usaihishfuisapfi shusa hfusa hf hsfa fhusa hfusa hfusahfuashfusahfip  df saofnhsuiah nfuisah fui sphfu psfsahufhsa uihsau fsa  usaihishfuisapfi shusa hfusa hf hsfa fhusa hfusa hfusahfuashfusahfip  df saofnhsuiah nfuisah fui sphfu psfsahufhsa uihsau fsa  usaihishfuisapfi shusa hfusa hf hsfa fhusa hfusa hfusahfuashfusahfip`;

function Report({ agent, text, date }) {
    return (
        <div className="mb-2 pb-2">
            <p className="whitespace-pre-wrap text-sm text-text">
                <span className="mr-1 rounded-full bg-background-accent px-2 py-0.5 text-sm font-semibold uppercase text-brand">
                    {agent}:
                </span>
                <span>{text}</span>
            </p>
            <div className="mt-1 flex w-full items-center justify-end">
                <span className="text-sm italic text-text-secondary">
                    [Report date: {date}]
                </span>
            </div>
        </div>
    );
}

function ReportSection({ reports }) {
    return (
        <div
            className="min-w-48 max-w-full self-start overflow-auto rounded-lg bg-background p-4 resize-x"
        >
            <div>
                {reports.map((report) => (
                    <Report key={report.date} {...report} />
                ))}
            </div>
            <div className="flex w-full justify-end">
                <Button variant="primary" aria-label="Add report">
                    <StickyNotePlus size={16} />
                </Button>
            </div>
        </div>
    );
}

export default function VisitCard() {

    return (
        <div className="bg-background-element rounded-md shadow-md border border-border mb-6 p-4 flex flex-col gap-2 transition hover:shadow-lg">
            <div className="flex items-center gap-2 text-brand font-semibold">
                <Calendar></Calendar>
                16 Jul 2026
            </div>
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl hover:underline cursor-pointer">SIRMAX SPA</h2>
                <Badge type="Customer" />
            </div>
            <p className="text-sm text-text font-medium">DORIS</p>
            <span className="text-xs text-text-secondary">IT</span>
            <Importance level="GOLD" />
            <ReportSection
                reports={[
                    {
                        agent: "DORIS",
                        text: SAMPLE_REPORT,
                        date: "17 Jul 2026 16:21",
                    },
                ]}
            />
        </div>
    );
}