export const fmt = (n: number | undefined) => n?.toLocaleString("pt-BR") ?? "0";
export const fmtBRL = (n: number | undefined) => `R$ ${(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
export const pct = (n: number | undefined) => `${(n || 0).toFixed(1)}%`;
export const minToH = (min: number) => {
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
};

export const STAGE_LABELS: Record<string, string> = {
  novo_lead: "Novo Lead",
  ia_em_contato: "IA em Contato",
  ia_qualificado: "IA Qualificado",
  ia_desqualificado: "IA Desqualificado",
  formulario_qualificado: "Form. Qualificado",
  formulario_desqualificado: "Form. Desqualificado",
  sdr_em_contato: "SDR em Contato",
  sdr_desqualificado: "SDR Desqualificado",
  reuniao_agendada: "Reunião Agendada",
  reuniao_realizada: "Reunião Realizada",
  reuniao_no_show: "Reunião No-Show",
  reuniao_cancelada: "Reunião Cancelada",
  venda_sinal: "Venda Sinal",
  venda_completa: "Venda Completa",
};
