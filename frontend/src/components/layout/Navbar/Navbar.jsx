"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarButton from "./NavbarButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/customer", label: "Customer" },
  { href: "/map", label: "Map" },
  { href: "/visits", label: "Visits" },
  { href: "/reminders", label: "Reminders" },
  { href: "/quotationTable", label: "Quotation Table" },
  { href: "/containers", label: "Containers" },
  { href: "/warehouse", label: "Warehouse" },
  { href: "/noli", label: "Noli" },
  { href: "/formulas", label: "Formulas" },
  { href: "/productResearch", label: "Product Research" },
  // { href: "/exhibitions", label: "Exhibitions" },
  // { href: "/contacts", label: "Contacts" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
      <nav className="flex items-center bg-background-element rounded-xl p-2 border border-border justify-between">
        {/* Left: Navigation Links */}
        <div className="flex items-center gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              <NavbarButton
                isActive={pathname === href ? true : false}
              >{label}</NavbarButton>
            </Link>
          ))}
        </div>

        {/* Right: User Info, Settings Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Info (hidden on mobile) */}
          <div className="hidden md:flex flex-col text-right border-r border-border pr-3 min-w-0">
            <span className="text-sm font-bold text-text leading-tight truncate">
              SIMO
            </span>
            <span className="text-[10px] text-text-secondary uppercase tracking-tight truncate">
              Simone Penza
            </span>
            <span className="text-[10px] text-text-secondary tracking-tight truncate">
              penza@greenchemicals.green
            </span>
          </div>

          {/* Settings Button */}
          <button
            id="settingsButton"
            onClick={() => {
              // (Add settings handler here)
            }}
            className="p-2 text-text-secondary cursor-pointer rounded-md flex items-center justify-center"
            type="button"
            aria-label="Open settings"
          >
            <span role="img" aria-label="settings" className="text-lg">
              ⚙️
            </span>
          </button>

        </div>
      </nav>
  );
}