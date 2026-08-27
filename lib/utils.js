import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatTeamCode(id) {
  if (!id && id !== 0) return 'EV26-ALPHA';
  const numeric = typeof id === 'number' ? id : parseInt(id, 10);
  if (isNaN(numeric)) return String(id);
  // Obfuscate sequential counter into non-sequential 5-digit festival code
  const code = ((numeric * 7919 + 104729) % 90000) + 10000;
  return `EV26-${code}`;
}
