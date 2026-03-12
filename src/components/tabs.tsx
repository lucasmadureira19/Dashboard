import React, { useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { KPICard, SectionTitle, ChartTooltip, Badge, cn } from "./ui";
import { fmt, fmtBRL, pct, minToH, STAGE_LABELS } from "../lib/utils";
import { MOCK_FUNIL_DIARIO, MOCK_SDRS, MOCK_CLOSERS, MOCK_VELOCIDADE, MOCK_FOLLOWUP, MOCK_FOLLOWUP_DIARIO, MOCK_UTM, MOCK_ABANDONADOS } from "../data/mock";

const Table = ({ columns, data, highlightCol }: any) => (
  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr>
          {columns.map((col: any, i: number) => (
            <th key={i} className={cn(
              "px-3.5 py-2.5 bg-zinc-800/50 text-zinc-400 font-semibold text-[11px] uppercase tracking-wider border-b border-zinc-800 whitespace-nowrap",
              col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
            )}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, ri: number) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-transparent" : "bg-zinc-800/20"}>
            {columns.map((col: any, ci: number) => {
              const val = col.render ? col.render(row, ri) : row[col.key];
              const isHighlight = highlightCol === col.key;
              return (
                <td key={ci} className={cn(
                  "px-3.5 py-2.5 border-b border-zinc-800/50 whitespace-nowrap",
                  isHighlight ? "text-pink-400 font-bold" : "text-zinc-300 font-normal",
                  col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                  col.mono ? "font-mono" : "font-sans"
                )}>{val}</td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const TabGeral = ({ data }: { data: typeof MOCK_FUNIL_DIARIO }) => {
  const totals = useMemo(() => {
    const t = { oportunidades: 0, qualificados: 0, desqualificados: 0, reunioes_agendadas: 0, reunioes_realizadas: 0, reunioes_no_show: 0, reunioes_canceladas: 0, vendas_sinal: 0, vendas_completa: 0, valor_liquido: 0, tempo_medio: 0 };
    data.forEach(d => {
      Object.keys(t).forEach(k => { if (k !== "tempo_medio") (t as any)[k] += (d as any)[k] || 0; });
    });
    t.tempo_medio = Math.round(data.reduce((s, d) => s + d.tempo_medio_min, 0) / data.length);
    return t;
  }, [data]);

  const taxaQualificacao = totals.oportunidades > 0 ? (100 * totals.qualificados / totals.oportunidades).toFixed(1) : 0;
  const taxaNoShow = totals.reunioes_agendadas > 0 ? (100 * totals.reunioes_no_show / totals.reunioes_agendadas).toFixed(1) : 0;
  const taxaConversao = totals.reunioes_realizadas > 0 ? (100 * totals.vendas_sinal / totals.reunioes_realizadas).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Row 1 - Funil */}
      <div>
        <SectionTitle>Funil de Oportunidades</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Oportunidades" value={fmt(totals.oportunidades)} valueClassName="text-blue-400" />
          <KPICard label="Qualificados" value={fmt(totals.qualificados)} sub={`${taxaQualificacao}% taxa`} trend="up" valueClassName="text-emerald-400" />
          <KPICard label="Desqualificados" value={fmt(totals.desqualificados)} valueClassName="text-rose-400" />
          <KPICard label="SDR Assumiu" value={fmt(data.reduce((s, d) => s + d.sdr_assumiu, 0))} valueClassName="text-cyan-400" />
          <KPICard label="Tempo 1° Contato" value={`${totals.tempo_medio}min`} sub="média do período" valueClassName="text-amber-400" />
        </div>
      </div>

      {/* Chart - Oportunidades diário */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle extra="por dia">Oportunidades vs Qualificados</SectionTitle>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />
              <Bar dataKey="oportunidades" name="Oportunidades" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar dataKey="qualificados" name="Qualificados" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="desqualificados" name="Desqualificados" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI Row 2 - Reuniões */}
      <div>
        <SectionTitle>Reuniões</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Agendadas" value={fmt(totals.reunioes_agendadas)} valueClassName="text-blue-400" small />
          <KPICard label="Realizadas" value={fmt(totals.reunioes_realizadas)} valueClassName="text-emerald-400" small />
          <KPICard label="No-Show" value={fmt(totals.reunioes_no_show)} sub={`${taxaNoShow}% taxa`} trend="down" valueClassName="text-rose-400" small />
          <KPICard label="Canceladas" value={fmt(totals.reunioes_canceladas)} valueClassName="text-orange-400" small />
          <KPICard label="Reagendadas" value={fmt(data.reduce((s, d) => s + d.reunioes_reagendadas, 0))} valueClassName="text-amber-400" small />
        </div>
      </div>

      {/* Chart - Reuniões diário */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle extra="por dia">Reuniões — Agendadas vs Realizadas vs No-Show</SectionTitle>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="reunioes_agendadas" name="Agendadas" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="reunioes_realizadas" name="Realizadas" stroke="#10b981" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="reunioes_no_show" name="No-Show" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI Row 3 - Vendas */}
      <div>
        <SectionTitle>Vendas</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard label="Vendas Sinal" value={fmt(totals.vendas_sinal)} valueClassName="text-pink-400" />
          <KPICard label="Vendas Completas" value={fmt(totals.vendas_completa)} valueClassName="text-emerald-400" />
          <KPICard label="Receita Líquida" value={fmtBRL(totals.valor_liquido)} valueClassName="text-emerald-400" />
          <KPICard label="Taxa Conversão" value={`${taxaConversao}%`} sub="reunião → venda sinal" valueClassName="text-pink-400" />
        </div>
      </div>

      {/* Chart - Vendas diário */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle extra="por dia">Vendas e Receita</SectionTitle>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />
              <Bar yAxisId="left" dataKey="vendas_sinal" name="Sinal" fill="#f472b6" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar yAxisId="left" dataKey="vendas_completa" name="Completa" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="valor_liquido" name="Receita" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const TabSDR = () => (
  <div className="flex flex-col gap-6">
    <SectionTitle extra={`${MOCK_SDRS.length} SDRs ativos`}>Ranking de SDRs</SectionTitle>
    <Table
      data={[...MOCK_SDRS].sort((a, b) => b.taxa_agendamento - a.taxa_agendamento)}
      highlightCol="taxa_agendamento"
      columns={[
        { label: "#", render: (_: any, i: number) => i + 1, align: "center" },
        { label: "SDR", key: "nome" },
        { label: "Leads", key: "leads_recebidos", align: "center", mono: true },
        { label: "1° Contato", render: (r: any) => `${r.primeiro_contato_avg_min}min`, align: "center", mono: true },
        { label: "Agendadas", key: "reunioes_agendadas", align: "center", mono: true },
        { label: "Realizadas", key: "reunioes_realizadas", align: "center", mono: true },
        { label: "No-Show", key: "no_show", align: "center", mono: true },
        { label: "Tx Agend.", render: (r: any) => pct(r.taxa_agendamento), align: "center", mono: true, key: "taxa_agendamento" },
        { label: "Tx No-Show", render: (r: any) => <Badge colorClass={r.taxa_no_show > 25 ? "bg-rose-500/20 text-rose-400" : r.taxa_no_show > 20 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}>{pct(r.taxa_no_show)}</Badge>, align: "center" },
      ]}
    />
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <SectionTitle>Leads Recebidos vs Reuniões Agendadas</SectionTitle>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_SDRS} layout="vertical" barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: "#a1a1aa", fontSize: 11 }} width={120} axisLine={{ stroke: "#27272a" }} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />
            <Bar dataKey="leads_recebidos" name="Leads" fill="#3b82f6" radius={[0, 4, 4, 0]} opacity={0.8} />
            <Bar dataKey="reunioes_agendadas" name="Agendadas" fill="#f472b6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export const TabCloser = () => (
  <div className="flex flex-col gap-6">
    <SectionTitle extra={`${MOCK_CLOSERS.length} closers ativos`}>Ranking de Closers</SectionTitle>
    <Table
      data={[...MOCK_CLOSERS].sort((a, b) => b.taxa_conversao - a.taxa_conversao)}
      highlightCol="taxa_conversao"
      columns={[
        { label: "#", render: (_: any, i: number) => i + 1, align: "center" },
        { label: "Closer", key: "nome" },
        { label: "Reuniões", key: "reunioes_realizadas", align: "center", mono: true },
        { label: "V. Sinal", key: "vendas_sinal", align: "center", mono: true },
        { label: "V. Completa", key: "vendas_completa", align: "center", mono: true },
        { label: "Receita", render: (r: any) => fmtBRL(r.valor_total), align: "right", mono: true },
        { label: "Tx Conversão", render: (r: any) => <Badge colorClass={r.taxa_conversao >= 40 ? "bg-emerald-500/20 text-emerald-400" : r.taxa_conversao >= 33 ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"}>{pct(r.taxa_conversao)}</Badge>, align: "center", key: "taxa_conversao" },
        { label: "Ticket Médio", render: (r: any) => fmtBRL(r.ticket_medio), align: "right", mono: true },
      ]}
    />
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <SectionTitle>Receita por Closer</SectionTitle>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[...MOCK_CLOSERS].sort((a, b) => b.valor_total - a.valor_total)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#a1a1aa", fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: "#a1a1aa", fontSize: 11 }} width={130} axisLine={{ stroke: "#27272a" }} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />
            <Bar dataKey="valor_total" name="Receita" radius={[0, 4, 4, 0]}>
              {[...MOCK_CLOSERS].sort((a, b) => b.valor_total - a.valor_total).map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#f472b6" : i < 3 ? "#10b981" : "#3b82f6"} opacity={i === 0 ? 1 : 0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export const TabVelocidade = () => {
  const avgData = useMemo(() => {
    const avg = (arr: any[], k: string) => Math.round(arr.reduce((s, d) => s + d[k], 0) / arr.length);
    return [
      { etapa: "Criação → 1° Contato", minutos: avg(MOCK_VELOCIDADE, "criacao_contato"), colorClass: "text-cyan-400" },
      { etapa: "1° Contato → Agendamento", minutos: avg(MOCK_VELOCIDADE, "contato_agendamento"), colorClass: "text-blue-400" },
      { etapa: "Agendamento → Reunião", minutos: avg(MOCK_VELOCIDADE, "agendamento_reuniao"), colorClass: "text-purple-400" },
      { etapa: "Reunião → Venda Sinal", minutos: avg(MOCK_VELOCIDADE, "reuniao_sinal"), colorClass: "text-pink-400" },
      { etapa: "Sinal → Completa", minutos: avg(MOCK_VELOCIDADE, "sinal_completa"), colorClass: "text-emerald-400" },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle extra="média do período">Velocidade do Funil — Tempo Entre Etapas</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {avgData.map((d, i) => (
          <KPICard key={i} label={d.etapa} value={minToH(d.minutos)} valueClassName={d.colorClass} />
        ))}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle extra="em minutos">Tempo 1° Contato — Evolução Diária</SectionTitle>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_VELOCIDADE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="min" />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="criacao_contato" name="Criação → 1° Contato" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle extra="em horas">Ciclo Completo — Agendamento a Venda</SectionTitle>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_VELOCIDADE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/60).toFixed(0)}h`} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="contato_agendamento" name="Contato → Agendamento" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="agendamento_reuniao" name="Agend. → Reunião" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="reuniao_sinal" name="Reunião → Sinal" stroke="#f472b6" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const TabFollowup = () => (
  <div className="flex flex-col gap-6">
    <SectionTitle>Helena — Follow-up por Tentativa</SectionTitle>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {MOCK_FOLLOWUP.map((f, i) => (
        <KPICard key={i} label={`Tentativa ${f.tentativa}`} value={pct(f.taxa)} sub={`${f.respondidos}/${f.enviados} respostas`} valueClassName={i < 2 ? "text-emerald-400" : i < 4 ? "text-amber-400" : "text-rose-400"} small />
      ))}
    </div>

    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <SectionTitle>Taxa de Resposta por Tentativa</SectionTitle>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_FOLLOWUP}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="tentativa" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} tickFormatter={v => `#${v}`} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />
            <Bar dataKey="taxa" name="Taxa Resposta %" radius={[6, 6, 0, 0]}>
              {MOCK_FOLLOWUP.map((_, i) => (
                <Cell key={i} fill={i < 2 ? "#10b981" : i < 4 ? "#fbbf24" : "#f43f5e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <SectionTitle extra="por dia">Follow-ups Enviados vs Respondidos</SectionTitle>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_FOLLOWUP_DIARIO} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />
            <Bar dataKey="enviados" name="Enviados" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Bar dataKey="respondidos" name="Respondidos" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="bloqueados" name="Bloqueados" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export const TabUTM = () => (
  <div className="flex flex-col gap-6">
    <SectionTitle extra={`${MOCK_UTM.length} origens`}>Performance por Origem (UTM)</SectionTitle>
    <Table
      data={[...MOCK_UTM].sort((a, b) => b.taxa_conversao_reuniao - a.taxa_conversao_reuniao)}
      highlightCol="taxa_conversao_reuniao"
      columns={[
        { label: "Source", render: (r: any) => <Badge colorClass={
          r.source === "facebook" ? "bg-blue-500/20 text-blue-400" :
          r.source === "google" ? "bg-emerald-500/20 text-emerald-400" :
          r.source === "instagram" ? "bg-purple-500/20 text-purple-400" :
          r.source === "youtube" ? "bg-rose-500/20 text-rose-400" :
          r.source === "organico" ? "bg-cyan-500/20 text-cyan-400" :
          "bg-orange-500/20 text-orange-400"
        }>{r.source}</Badge> },
        { label: "Campanha", key: "campaign" },
        { label: "Oport.", key: "oportunidades", align: "center", mono: true },
        { label: "Qualif.", key: "qualificados", align: "center", mono: true },
        { label: "Reuniões", key: "reunioes", align: "center", mono: true },
        { label: "Vendas", key: "vendas", align: "center", mono: true },
        { label: "Receita", render: (r: any) => fmtBRL(r.valor), align: "right", mono: true },
        { label: "Tx Qualif.", render: (r: any) => pct(r.taxa_qualificacao), align: "center", mono: true },
        { label: "Tx Conv. Reunião", render: (r: any) => pct(r.taxa_conversao_reuniao), align: "center", mono: true, key: "taxa_conversao_reuniao" },
      ]}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle>Volume por Source</SectionTitle>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={(() => {
                  const grouped: any = {};
                  MOCK_UTM.forEach(u => { grouped[u.source] = (grouped[u.source] || 0) + u.oportunidades; });
                  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
                })()}
                cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={{ stroke: "#a1a1aa" }}
              >
                {["#3b82f6", "#10b981", "#a855f7", "#f43f5e", "#06b6d4", "#f97316"].map((c, i) => (
                  <Cell key={i} fill={c} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
        <SectionTitle>Receita por Source</SectionTitle>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={(() => {
                  const grouped: any = {};
                  MOCK_UTM.forEach(u => { grouped[u.source] = (grouped[u.source] || 0) + u.valor; });
                  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
                })()}
                cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={{ stroke: "#a1a1aa" }}
              >
                {["#3b82f6", "#10b981", "#a855f7", "#f43f5e", "#06b6d4", "#f97316"].map((c, i) => (
                  <Cell key={i} fill={c} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

export const TabAbandonados = () => {
  const byStage = useMemo(() => {
    const grouped: any = {};
    MOCK_ABANDONADOS.forEach(a => {
      grouped[a.stage] = (grouped[a.stage] || 0) + 1;
    });
    return Object.entries(grouped).map(([stage, count]) => ({ stage: STAGE_LABELS[stage] || stage, count }));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle extra={`${MOCK_ABANDONADOS.length} leads parados`}>Leads Abandonados (&gt;3 dias sem interação)</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {byStage.map((s: any, i) => (
          <KPICard key={i} label={s.stage} value={fmt(s.count as number)} valueClassName="text-rose-400" small />
        ))}
        <KPICard label="Média Dias Parado" value={`${Math.round(MOCK_ABANDONADOS.reduce((s, a) => s + a.dias_parado, 0) / MOCK_ABANDONADOS.length)}d`} valueClassName="text-amber-400" small />
      </div>
      <Table
        data={[...MOCK_ABANDONADOS].sort((a, b) => b.dias_parado - a.dias_parado)}
        columns={[
          { label: "Contato", key: "contato" },
          { label: "Stage", render: (r: any) => <Badge colorClass={
            r.stage.includes("venda") ? "bg-pink-500/20 text-pink-400" :
            r.stage.includes("reuniao") ? "bg-purple-500/20 text-purple-400" :
            r.stage.includes("sdr") ? "bg-blue-500/20 text-blue-400" :
            "bg-cyan-500/20 text-cyan-400"
          }>{STAGE_LABELS[r.stage] || r.stage}</Badge> },
          { label: "SDR", key: "sdr" },
          { label: "Closer", render: (r: any) => r.closer || "—" },
          { label: "Dias Parado", render: (r: any) => <span className={cn("font-mono font-bold", r.dias_parado > 10 ? "text-rose-400" : r.dias_parado > 5 ? "text-amber-400" : "text-zinc-300")}>{r.dias_parado}d</span>, align: "center" },
          { label: "Última Msg", key: "ultima_msg_em", mono: true },
          { label: "Direção", render: (r: any) => <Badge colorClass={r.ultima_msg_direcao === "inbound" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}>{r.ultima_msg_direcao}</Badge>, align: "center" },
        ]}
      />
    </div>
  );
};
