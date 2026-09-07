"use client";

import { useEffect, useRef, useState } from "react";
import Title from "@/components/layout/Title";
import { BriefcaseBusiness, Funnel, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import SearchInput from "@/components/ui/SearchInput";
import VisitCard from "@/components/ui/VisitCard";

const AGENTS = [
  "SIMONE",
  "SIMONE1",
  "SIMONE2",
  "SIMONE3",
  "SIMONE4",
  "SIMONE6",
  "SIMONE8",
  "SIMONE00",
  "SIMONE80",
];

const today = new Date().toISOString().slice(0, 10);

export default function page() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [agent, setAgent] = useState("");
  const filterRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!filterRef.current?.contains(event.target)) {
        setFilterOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setFilterOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function applyVisitFilters() {
    setFilterOpen(false);
  }

  function resetVisitFilters() {
    setDateFrom("");
    setDateTo("");
    setAgent("");
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Title
          icon={<BriefcaseBusiness size={20} />}
          subtitle="Here you can view and add commercial visits"
        >
          Visits
        </Title>



        <div className="flex items-center gap-2">
          <Button variant="primary">
            <BriefcaseBusiness size={16} />
            <Plus size={12} />
            Add visit
          </Button>
          <div ref={filterRef} className="relative">
            <Button
              variant="ghost"
              onClick={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              aria-controls="filterMenu"
            >
              <Funnel size={16} />
              Filter
            </Button>

            {filterOpen && (
              <div
                id="filterMenu"
                className="absolute right-0 top-full z-30 mt-2 w-[min(calc(100vw-1rem),18rem)] rounded-md border border-border bg-background-element p-4 shadow-xl sm:w-72"
              >
                <div className="mb-3">
                  <label
                    htmlFor="visit_filterDateFrom"
                    className="mb-1 block text-xs font-semibold text-text"
                  >
                    Date from
                  </label>
                  <Input
                    type="date"
                    id="visit_filterDateFrom"
                    className="max-w-none"
                    max={today}
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="visit_filterDateTo"
                    className="mb-1 block text-xs font-semibold text-text"
                  >
                    Date to
                  </label>
                  <Input
                    type="date"
                    id="visit_filterDateTo"
                    className="max-w-none"
                    max={today}
                    min={dateFrom || undefined}
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="visit_filterAgent"
                    className="mb-1 block text-xs font-semibold text-text"
                  >
                    Agent
                  </label>
                  <Select
                    id="visit_filterAgent"
                    value={agent}
                    onChange={(event) => setAgent(event.target.value)}
                  >
                    <option value="">*All agents</option>
                    {AGENTS.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="primary" onClick={applyVisitFilters}>
                    Apply
                  </Button>
                  <Button variant="ghost" onClick={resetVisitFilters}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>

          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customer"
          />
        </div>

      </div>
      <div className="mt-4">
        <VisitCard></VisitCard>
      </div>
    </div>
  );
}
