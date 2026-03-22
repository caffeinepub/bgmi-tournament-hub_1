import { Button } from "@/components/ui/button";
import { Calendar, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { TournamentStatus } from "../backend.d";
import type { Tournament } from "../hooks/useQueries";
import { MapBadge } from "./MapBadge";
import { ModeBadge } from "./ModeBadge";
import { StatusBadge } from "./StatusBadge";

interface Props {
  tournament: Tournament;
  index: number;
  onRegister: (t: Tournament) => void;
}

export function TournamentCard({ tournament, index, onRegister }: Props) {
  const slotsLeft =
    Number(tournament.totalSlots) - Number(tournament.registeredCount);
  const isFull = slotsLeft <= 0;
  const isClosed = tournament.status === TournamentStatus.closed;
  const canRegister = !isFull && !isClosed;
  const fillPercent =
    (Number(tournament.registeredCount) / Number(tournament.totalSlots)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative bg-card border border-border rounded-xl p-5 shadow-card hover:border-primary/40 hover:shadow-glow transition-all duration-300"
    >
      {/* Glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,oklch(0.76_0.17_68/0.07),transparent)]" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display font-semibold text-lg text-foreground leading-snug">
          {tournament.name}
        </h3>
        <StatusBadge status={tournament.status} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <MapBadge map={tournament.map} />
        <ModeBadge mode={tournament.mode} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{tournament.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span>
            <span
              className={
                isFull ? "text-destructive" : "text-foreground font-medium"
              }
            >
              {slotsLeft}
            </span>{" "}
            / {tournament.totalSlots.toString()} slots remaining
          </span>
        </div>
      </div>

      {/* Slot fill bar */}
      <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(fillPercent, 100)}%`,
            background:
              fillPercent > 80
                ? "oklch(0.577 0.245 27.325)"
                : "oklch(0.76 0.17 68)",
          }}
        />
      </div>

      <Button
        onClick={() => onRegister(tournament)}
        disabled={!canRegister}
        className={`w-full font-semibold text-sm ${
          canRegister
            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-glow-sm"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
        }`}
        data-ocid="tournament.primary_button"
      >
        {isClosed ? (
          "Registration Closed"
        ) : isFull ? (
          "Slots Full"
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Register Now
          </>
        )}
      </Button>
    </motion.div>
  );
}
