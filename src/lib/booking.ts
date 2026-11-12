import { z } from "zod";

export const CONSOLES = ["PlayStation 2", "PlayStation 4", "Xbox Series S"] as const;
export const HOURS = [1, 2, 3] as const;
export const STATUSES = ["Pendente", "Confirmado", "Jogando", "Finalizado"] as const;
export type BookingStatus = (typeof STATUSES)[number];
export const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);
export const WHATSAPP_NUMBER = "5511999999999";

export const bookingSchema = z.object({
  player_name: z.string().trim().min(2, "Informe seu nome").max(80, "Nome muito longo"),
  console: z.enum(CONSOLES),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Escolha uma data"),
  booking_time: z.string().regex(/^\d{2}:\d{2}$/, "Escolha um horário"),
  hours: z.number().int().min(1).max(3),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export function formatDateBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function buildWhatsAppUrl(b: BookingInput) {
  const text =
    `Olá, quero agendar:\n` +
    `Jogador: ${b.player_name}\n` +
    `Console: ${b.console}\n` +
    `Data: ${formatDateBR(b.booking_date)} às ${b.booking_time}\n` +
    `Duração: ${b.hours}h`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function nextStatus(s: BookingStatus): BookingStatus | null {
  const i = STATUSES.indexOf(s);
  return i < STATUSES.length - 1 ? STATUSES[i + 1] : null;
}
