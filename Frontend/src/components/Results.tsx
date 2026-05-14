import { Bus } from "lucide-react";

export interface BusResult {
  number: string;
  name: string;
}

export function Results({ results, searched }: { results: BusResult[]; searched: boolean }) {
  if (!searched) return null;

  return (
    <section
      className="mx-auto mt-10 w-full max-w-4xl px-1"
      style={{ animation: "var(--animate-slide-up)" }}
    >
      <h2 className="mb-4 text-xl font-bold text-foreground">Buses Available</h2>

      {results.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center"
          style={{ boxShadow: "var(--shadow-soft)", animation: "var(--animate-fade-in)" }}
        >
          <div className="mb-3 text-5xl">🚌</div>
          <p className="text-base font-semibold text-foreground">No buses found for this route</p>
          <p className="mt-1 text-sm text-muted-foreground">Try checking the stop names</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((b, i) => (
            <article
              key={b.number + i}
              className="group flex items-center gap-4 rounded-2xl bg-white p-4 transition-all duration-200 hover:-translate-y-[3px]"
              style={{ boxShadow: "var(--shadow-soft)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.10)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-soft)")}
            >
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                style={{ background: "var(--color-input-soft)" }}
              >
                <Bus className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold leading-tight" style={{ color: "var(--color-primary)" }}>
                  {b.number}
                </div>
                <div className="truncate text-sm text-muted-foreground">{b.name}</div>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--color-input-soft)", color: "var(--color-primary)" }}
              >
                BMTC
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
