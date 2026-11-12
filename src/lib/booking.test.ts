import { describe, it, expect } from "vitest";
import { bookingSchema, buildWhatsAppUrl, nextStatus } from "./booking";

const base = { player_name: "Ana", console: "PlayStation 4" as const, booking_date: "2026-11-20", booking_time: "14:00", hours: 2 };

describe("booking rules", () => {
  it("accepts 1 to 3 hours only", () => {
    expect(bookingSchema.safeParse({ ...base, hours: 3 }).success).toBe(true);
    expect(bookingSchema.safeParse({ ...base, hours: 4 }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...base, hours: 0 }).success).toBe(false);
  });
  it("builds wa.me link with booking data", () => {
    const url = buildWhatsAppUrl(base);
    expect(url.startsWith("https://wa.me/5511999999999?text=")).toBe(true);
    const text = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(text).toContain("Ana");
    expect(text).toContain("20/11/2026 às 14:00");
    expect(text).toContain("2h");
  });
  it("advances status in order", () => {
    expect(nextStatus("Pendente")).toBe("Confirmado");
    expect(nextStatus("Jogando")).toBe("Finalizado");
    expect(nextStatus("Finalizado")).toBe(null);
  });
});
