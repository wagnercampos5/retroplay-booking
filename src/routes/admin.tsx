import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CalendarClock, ChevronRight, Clock, Gamepad2, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { listBookings, updateBookingStatus } from "@/lib/bookings.functions";
import { formatDateBR, nextStatus, STATUSES, type BookingStatus } from "@/lib/booking";
import { cn } from "@/lib/utils";

const bookingsQuery = queryOptions({ queryKey: ["bookings"], queryFn: () => listBookings() });

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel do Dono — RetroPlay Booking" },
      { name: "description", content: "Acompanhe e gerencie os agendamentos da RetroPlay." },
      { property: "og:title", content: "Painel do Dono — RetroPlay" },
      { property: "og:description", content: "Gerencie agendamentos e status dos jogadores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(bookingsQuery);
  },
  component: AdminPage,
});

const statusStyle: Record<BookingStatus, string> = {
  Pendente: "border-warning text-warning",
  Confirmado: "border-info text-info",
  Jogando: "border-secondary text-secondary glow-secondary",
  Finalizado: "border-muted-foreground text-muted-foreground",
};

function StatusBadge({ s }: { s: BookingStatus }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold", statusStyle[s])}>{s}</span>;
}

function AdminPage() {
  const { data } = useSuspenseQuery(bookingsQuery);
  const qc = useQueryClient();
  const update = useServerFn(updateBookingStatus);
  const mutation = useMutation({
    mutationFn: update,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); toast.success("Status atualizado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setStatus = (id: string, status: BookingStatus) => mutation.mutate({ data: { id, status } });
  const totalHours = data.reduce((a, b) => a + b.hours, 0);

  const Actions = ({ id, status }: { id: string; status: BookingStatus }) => {
    const next = nextStatus(status);
    return (
      <div className="flex items-center gap-2">
        {next && (
          <Button size="sm" disabled={mutation.isPending} onClick={() => setStatus(id, next)} className="bg-primary text-primary-foreground">
            {next} <ChevronRight />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Alterar</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            {STATUSES.filter((s) => s !== status).map((s) => (
              <DropdownMenuItem key={s} onClick={() => setStatus(id, s)}>{s}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader admin />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-lg text-neon sm:text-2xl">Painel do Dono</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Stat icon={Users} label="Total de Agendamentos" value={data.length} />
          <Stat icon={Clock} label="Horas Vendidas" value={`${totalHours}h`} />
        </div>

        {data.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <Gamepad2 className="mx-auto h-10 w-10" />
            <p className="mt-3">Nenhum agendamento ainda.</p>
          </div>
        ) : (
          <>
            <div className="mt-10 hidden overflow-hidden rounded-xl border border-border bg-card md:block">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-muted-foreground">
                  <tr>{["Nome", "Console", "Horário", "Horas", "Status", "Ações"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-3 font-bold">{b.player_name}</td>
                      <td className="px-4 py-3">{b.console}</td>
                      <td className="px-4 py-3">{formatDateBR(b.booking_date)} · {b.booking_time}</td>
                      <td className="px-4 py-3">{b.hours}h</td>
                      <td className="px-4 py-3"><StatusBadge s={b.status} /></td>
                      <td className="px-4 py-3"><Actions id={b.id} status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 space-y-3 md:hidden">
              {data.map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{b.player_name}</p>
                      <p className="text-sm text-muted-foreground">{b.console} · {b.hours}h</p>
                    </div>
                    <StatusBadge s={b.status} />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-sm"><CalendarClock className="h-4 w-4 text-secondary" />{formatDateBR(b.booking_date)} às {b.booking_time}</p>
                  <div className="mt-3"><Actions id={b.id} status={b.status} /></div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-primary/50 bg-card p-6 glow-primary">
      <Icon className="h-6 w-6 text-secondary" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
