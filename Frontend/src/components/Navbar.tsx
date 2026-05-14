import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bus, ListChecks, HelpCircle, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Bookings", to: "/", icon: ListChecks },
  { label: "Help", to: "/", icon: HelpCircle },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-white"
      style={{ boxShadow: "var(--shadow-nav)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-white"
            style={{ background: "var(--color-primary)" }}
          >
            <Bus className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-primary)" }}>
            BMTC
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[color:var(--color-primary)]"
            >
              <Icon className="h-4 w-4" />
              {label}
              <span
                className="pointer-events-none absolute bottom-1 left-4 right-4 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: "var(--color-primary)" }}
              />
            </Link>
          ))}
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full transition-transform duration-200 active:scale-95 md:hidden"
          style={{ background: "var(--color-input-soft)" }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden" style={{ animation: "var(--animate-dropdown)" }}>
          <nav className="mx-4 mb-3 flex flex-col gap-1 rounded-2xl bg-white p-2"
               style={{ boxShadow: "var(--shadow-soft)" }}>
            {navLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[color:var(--color-hover-row)]"
              >
                <Icon className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
