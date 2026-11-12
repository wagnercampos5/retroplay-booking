import { Link } from "@tanstack/react-router";
import { Gamepad2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader({ admin = false }: { admin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-7 w-7 text-secondary" />
          <span className="font-display text-xs sm:text-sm text-neon">RetroPlay</span>
        </Link>
        {admin ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/">Voltar ao site</Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/admin">
              <ShieldCheck /> <span className="hidden sm:inline">Sou o Dono (Admin)</span><span className="sm:hidden">Admin</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
