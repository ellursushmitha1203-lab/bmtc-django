import { useState, useRef, useEffect } from "react";
import { MapPin, Flag, ArrowLeftRight, Search, Loader2 } from "lucide-react";

const SAMPLE_STOPS = [
  "Majestic", "Shivajinagar", "KR Market", "Banashankari", "Jayanagar",
  "Marathahalli", "Whitefield", "Electronic City", "Yeshwanthpur",
  "Hebbal", "Silk Board", "MG Road", "Indiranagar", "Koramangala",
  "BTM Layout", "HSR Layout", "Kengeri", "Vijayanagar",
];

interface Props {
  onSearch: (from: string, to: string) => void;
  loading: boolean;
}

function StopInput({
  label, placeholder, value, onChange, icon, iconColor,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  iconColor: string;
}) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = value
    ? SAMPLE_STOPS.filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
    : SAMPLE_STOPS.slice(0, 6);

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
        style={{
          background: "var(--color-input-soft)",
          boxShadow: focused ? "var(--ring-focus)" : "none",
          transform: focused ? "scale(1.01)" : "scale(1)",
        }}
      >
        <span style={{ color: iconColor }} className="shrink-0">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {open && filtered.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-auto rounded-2xl bg-white p-1.5"
          style={{ boxShadow: "var(--shadow-card)", animation: "var(--animate-dropdown)" }}
        >
          {filtered.map((stop) => (
            <button
              key={stop}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(stop); setOpen(false); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition-colors duration-150 hover:bg-[color:var(--color-hover-row)]"
            >
              <MapPin className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />
              {stop}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SearchCard({ onSearch, loading }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [swapFlash, setSwapFlash] = useState(false);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSwapFlash(true);
    setTimeout(() => setSwapFlash(false), 250);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim() || loading) return;
    onSearch(from.trim(), to.trim());
  };

  return (
    <form
      onSubmit={submit}
      className="relative mx-auto -mt-20 w-full max-w-4xl rounded-[20px] bg-white p-5 md:p-7"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-end md:gap-3">
        <StopInput
          label="From"
          placeholder="Enter source stop"
          value={from}
          onChange={setFrom}
          icon={<MapPin className="h-5 w-5" />}
          iconColor="var(--color-primary)"
        />

        <div className="flex justify-center md:pb-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap from and to"
            className="group grid h-11 w-11 place-items-center rounded-full bg-white transition-transform duration-200 active:scale-95"
            style={{
              boxShadow: "var(--shadow-swap)",
              transform: swapFlash ? "scale(1.15)" : undefined,
            }}
          >
            <ArrowLeftRight
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
              style={{ color: "var(--color-primary)" }}
            />
          </button>
        </div>

        <StopInput
          label="To"
          placeholder="Enter destination stop"
          value={to}
          onChange={setTo}
          icon={<Flag className="h-5 w-5" />}
          iconColor="var(--color-navy)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-80"
        style={{
          background: loading ? "var(--color-primary-dark)" : "var(--color-primary)",
          boxShadow: "var(--shadow-btn)",
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary-dark)"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary)"; }}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Search Buses
          </>
        )}
      </button>
    </form>
  );
}
