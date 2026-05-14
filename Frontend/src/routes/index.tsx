import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBus } from "@/components/HeroBus";
import { SearchCard } from "@/components/SearchCard";
import { Results, type BusResult } from "@/components/Results";

export const Route = createFileRoute("/")({
  component: Index,
});

const API_BASE =
  (typeof import.meta.env.VITE_API_BASE_URL === "string" && import.meta.env.VITE_API_BASE_URL.trim()) ||
  "http://127.0.0.1:8000";

function Index() {
  const [results, setResults] = useState<BusResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (from: string, to: string) => {
    setLoading(true);
    setSearched(false);
    try {
      const base = API_BASE.replace(/\/$/, "");
      const qs = new URLSearchParams({ from, to }).toString();
      const res = await fetch(`${base}/api/buses/?${qs}`, { method: "GET" });
      if (!res.ok) {
        setResults([]);
        setSearched(true);
        return;
      }
      const data = (await res.json()) as { buses?: BusResult[] };
      setResults(Array.isArray(data.buses) ? data.buses : []);
    } catch {
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", minHeight: 380 }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-2 md:px-6 md:py-16">
          <div style={{ animation: "var(--animate-fade-in)" }}>
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Find Your BMTC Bus
            </h1>
            <p className="mt-4 max-w-md text-base md:text-lg" style={{ color: "rgba(227,242,253,0.9)" }}>
              Enter your stop and destination — we'll find the bus.
            </p>
          </div>
          <div className="hidden justify-end md:flex">
            <HeroBus className="w-[380px] max-w-full" />
          </div>
        </div>
      </section>

      <main className="px-4 pb-20 md:px-6">
        <SearchCard onSearch={handleSearch} loading={loading} />
        <Results results={results} searched={searched} />
      </main>
    </div>
  );
}
