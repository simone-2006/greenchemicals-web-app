"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { House } from "lucide-react";


const links = [
  { href: "/", label: <House size={16}/> },
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

function NavbarButton({ children, isActive }) {
  const activeClass = "bg-brand hover:bg-brand-dark text-text-inverted";
  const inactiveClass = "bg-transparent hover:bg-background-secondary text-text";
  return (
    <button
      className={`
        transition-all
        rounded-md
        px-1.5
        h-7
        flex
        items-center
        justify-center
        cursor-pointer
        font-semibold
        uppercase
        ${isActive ? activeClass : inactiveClass}
      `}
    >
      {children}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
      <nav className="flex items-center bg-background rounded-xl p-1 border border-border justify-between">
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
            <span className="text-xs font-bold text-text leading-tight truncate">
              SIMO
            </span>
            <span className="text-[8px] text-text-secondary uppercase tracking-tight truncate">
              Simone Penza
            </span>
            <span className="text-[8px] text-text-secondary tracking-tight truncate">
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
              <Settings size={18}></Settings>
            </span>
          </button>

        </div>
      </nav>
  );
}