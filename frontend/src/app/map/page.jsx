"use client";

import { useEffect, useRef, useState } from "react";
import Title from "@/components/layout/Title";
import { Map, Satellite } from "lucide-react";
import Switch from "@/components/ui/Switch";
import Input from "@/components/ui/Input";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";

const CustomerMap = dynamic(() => import("@/components/ui/CustomerMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-background-secondary" />,
});

function ClientCustomerMap(props) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <CustomerMap {...props} />
      </div>
    </div>
  );
}

function parseBounds(boundingbox) {
  if (!Array.isArray(boundingbox) || boundingbox.length < 4) return null;
  const [south, north, west, east] = boundingbox.map(Number);
  if ([south, north, west, east].some((n) => Number.isNaN(n))) return null;
  return [
    [south, west],
    [north, east],
  ];
}

export default function page() {
  const [layer, setLayer] = useState("street");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=0&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) return;
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function selectResult(item) {
    setPlace({
      lat: Number(item.lat),
      lon: Number(item.lon),
      label: item.display_name,
      bounds: parseBounds(item.boundingbox),
    });
    setQuery(item.display_name);
    setOpen(false);
  }

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col gap-2 text-text">
      <div className="flex items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-2">
          <Title
            icon={<Map />}
            subtitle="Visual overview of your customers"
          >
            Customer map
          </Title>
          <div className="flex items-center gap-2 rounded-md border border-border p-1">
            Mine
            <Switch />
            All
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border p-1">
            <label className="flex items-center gap-1">
              <Input type="checkbox" />
              Cluster
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            <Button
              variant={layer === "street" ? "primary" : "ghost"}
              onClick={() => setLayer("street")}
              aria-pressed={layer === "street"}
            >
              <Map size={14} />
              Street
            </Button>
            <Button
              variant={layer === "satellite" ? "primary" : "ghost"}
              onClick={() => setLayer("satellite")}
              aria-pressed={layer === "satellite"}
            >
              <Satellite size={14} />
              Satellite
            </Button>
          </div>

          <div ref={searchRef} className="relative">
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="Search a place / customer"
            />
            {open && results.length > 0 && (
              <ul className="absolute right-0 z-20 mt-1 max-h-56 w-72 overflow-auto rounded-md border border-border bg-background-element">
                {results.map((item) => (
                  <li key={item.place_id}>
                    <button
                      type="button"
                      className="w-full px-2 py-1.5 text-left text-xs font-semibold text-text hover:bg-background-accent"
                      onClick={() => selectResult(item)}
                    >
                      {item.display_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border">
        <ClientCustomerMap layer={layer} place={place} />
      </div>
    </div>
  );
}
