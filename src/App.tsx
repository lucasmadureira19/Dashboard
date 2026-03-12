/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TabGeral, TabSDR, TabCloser, TabVelocidade, TabFollowup, TabUTM, TabAbandonados } from "./components/tabs";
import { MOCK_FUNIL_DIARIO } from "./data/mock";
import { cn } from "./components/ui";
import { Activity, Users, Target, Zap, MessageCircle, Link, AlertTriangle } from "lucide-react";

const TABS = [
  { id: "geral", label: "Geral", icon: Activity },
  { id: "sdr", label: "SDRs", icon: Users },
  { id: "closer", label: "Closers", icon: Target },
  { id: "velocidade", label: "Velocidade", icon: Zap },
  { id: "followup", label: "Helena", icon: MessageCircle },
  { id: "utm", label: "UTM", icon: Link },
  { id: "abandonados", label: "Abandonados", icon: AlertTriangle },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("geral");
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState("2026-03-12");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-pink-500/30">
      {/* Header */}
      <header className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
          <div>
            <h1 className="m-0 text-xl font-bold tracking-tight text-zinc-50">Dashboard Comercial</h1>
            <span className="text-xs text-zinc-400 font-medium tracking-wide">Mundo Leilão — Funil de Vendas</span>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 shadow-sm">
          <span className="text-xs text-zinc-400 font-medium px-2 uppercase tracking-wider">Período</span>
          <input
            type="date" 
            value={dateFrom} 
            onChange={e => setDateFrom(e.target.value)}
            className="bg-zinc-800 border-none rounded-md text-zinc-200 px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
          />
          <span className="text-zinc-500 font-mono">→</span>
          <input
            type="date" 
            value={dateTo} 
            onChange={e => setDateTo(e.target.value)}
            className="bg-zinc-800 border-none rounded-md text-zinc-200 px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
          />
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex gap-1 border-b border-zinc-800 bg-zinc-900/30 overflow-x-auto px-6 pt-4 scrollbar-hide">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap",
                isActive 
                  ? "border-pink-500 text-pink-400" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-t-lg"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-pink-500" : "text-zinc-500")} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className="p-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        {activeTab === "geral" && <TabGeral data={MOCK_FUNIL_DIARIO} />}
        {activeTab === "sdr" && <TabSDR />}
        {activeTab === "closer" && <TabCloser />}
        {activeTab === "velocidade" && <TabVelocidade />}
        {activeTab === "followup" && <TabFollowup />}
        {activeTab === "utm" && <TabUTM />}
        {activeTab === "abandonados" && <TabAbandonados />}
      </main>
    </div>
  );
}
