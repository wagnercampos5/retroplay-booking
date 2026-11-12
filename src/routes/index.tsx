import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CalendarClock, Gamepad2, Timer, Zap, Joystick } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookingSchema, buildWhatsAppUrl, CONSOLES, HOURS, TIME_SLOTS } from "@/lib/booking";
import { createBooking } from "@/lib/bookings.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RetroPlay Booking — Agende seu horário no videogame" },
      { name: "description", content: "Garanta seu controle e pule a fila: agende PS2, PS4 ou Xbox Series S na RetroPlay." },
      { property: "og:title", content: "RetroPlay Booking — Agende seu horário" },
      { property: "og:description", content: "Escolha o console, marque o horário e venha jogar sem filas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Gamepad2, title: "Escolha o console", text: "PS2, PS4 ou Xbox Series S — você decide." },
  { icon: CalendarClock, title: "Horário marcado", text: "Sua TV reservada no dia e hora que quiser." },
  { icon: Zap, title: "Sem filas", text: "Chegou, sentou, jogou. Simples assim." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/50 px-3 py-1 text-xs text-secondary">
            <Joystick className="h-3.5 w-3.5" /> Fliperama moderno
          </span>
          <h1 className="mt-6 font-display text-2xl leading-relaxed sm:text-4xl sm:leading-relaxed">
            Garanta seu controle, <span className="text-neon">pule a fila</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Agende sua hora na TV e venha jogar sem estresse.
          </p>
          <Button asChild size="lg" className="mt-8 bg-neon text-secondary-foreground glow-primary hover:opacity-90">
            <a href="#agendar">Agendar Agora</a>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition hover:border-secondary hover:glow-secondary">
            <f.icon className="h-8 w-8 text-secondary" />
            <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <section id="agendar" className="mx-auto max-w-xl scroll-mt-20 px-4 pb-20">
        <BookingForm />
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RetroPlay — Game on.
      </footer>
    </div>
  );
}

function BookingForm() {
  const [name, setName] = useState("");
  const [consoleName, setConsoleName] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const create = useServerFn(createBooking);
  const today = new Date().toISOString().slice(0, 10);

  const mutation = useMutation({
    mutationFn: create,
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = bookingSchema.safeParse({
      player_name: name, console: consoleName, booking_date: date, booking_time: time, hours,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message.startsWith("Invalid") ? "Campo obrigatório" : i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    // Open window synchronously to avoid popup blockers, then fill URL after saving.
    const win = window.open("", "_blank");
    try {
      await mutation.mutateAsync({ data: parsed.data });
      const url = buildWhatsAppUrl(parsed.data);
      if (win) win.location.href = url;
      else window.location.href = url;
      toast.success("Agendamento enviado! Confirme no WhatsApp.");
      setName(""); setConsoleName(""); setDate(""); setTime(""); setHours(1);
    } catch {
      win?.close();
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-primary/50 bg-card p-6 glow-primary sm:p-8" noValidate>
      <h2 className="font-display text-base text-neon sm:text-lg">Monte seu plano</h2>
      <p className="mt-2 text-sm text-muted-foreground">Preencha e confirme direto no WhatsApp.</p>

      <div className="mt-6 space-y-5">
        <Field label="Nome do Jogador" error={errors.player_name}>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Ex: Player One" />
        </Field>
        <Field label="Console" error={errors.console}>
          <Select value={consoleName} onValueChange={setConsoleName}>
            <SelectTrigger><SelectValue placeholder="Escolha o console" /></SelectTrigger>
            <SelectContent>
              {CONSOLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Data" error={errors.booking_date}>
            <Input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="[color-scheme:dark]" />
          </Field>
          <Field label="Horário" error={errors.booking_time}>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger><SelectValue placeholder="Escolha" /></SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Quantidade de horas">
          <div className="grid grid-cols-3 gap-2">
            {HOURS.map((h) => (
              <button
                type="button"
                key={h}
                onClick={() => setHours(h)}
                className={cn(
                  "flex items-center justify-center gap-1 rounded-lg border py-3 font-bold transition",
                  hours === h ? "border-secondary bg-secondary text-secondary-foreground glow-secondary" : "border-border hover:border-secondary",
                )}
              >
                <Timer className="h-4 w-4" /> {h}h
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={mutation.isPending} className="mt-8 w-full bg-secondary text-secondary-foreground glow-secondary hover:bg-secondary/90">
        <WhatsAppIcon className="h-5 w-5" />
        {mutation.isPending ? "Salvando..." : "Confirmar via WhatsApp"}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
