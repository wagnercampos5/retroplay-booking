import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { bookingSchema, STATUSES } from "./booking";

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bookingSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({ ...data, status: "Pendente" })
      .select("id")
      .single();
    if (error) {
      console.error(error);
      throw new Error("Não foi possível salvar o agendamento");
    }
    return { id: row.id };
  });

export const listBookings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("Erro ao carregar agendamentos");
  }
  return data;
});

export const updateBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(STATUSES) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Erro ao atualizar status");
    return { ok: true };
  });
