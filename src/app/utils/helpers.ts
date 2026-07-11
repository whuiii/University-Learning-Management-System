export function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export function statusColor(s: string) {
  return s === "graded" ? "text-emerald-500" : s === "submitted" ? "text-sky-400" : "text-amber-500";
}

export function statusBg(s: string) {
  return s === "graded" ? "bg-emerald-500/15" : s === "submitted" ? "bg-sky-500/15" : "bg-amber-500/15";
}

export function statusLabel(s: string) {
  return s === "graded" ? "Graded" : s === "submitted" ? "Submitted" : "Pending";
}

// Font constants
export const serif = "'DM Serif Display', Georgia, serif";
export const sans = "'DM Sans', system-ui, sans-serif";
export const mono = "'JetBrains Mono', monospace";