import { Badge } from "@/components/ui/badge";
import { TournamentStatus } from "../backend.d";

const STATUS_CONFIG: Record<
  TournamentStatus,
  { label: string; className: string }
> = {
  [TournamentStatus.active]: {
    label: "Active",
    className:
      "bg-green-900/60 text-green-300 border-green-700/50 shadow-[0_0_8px_oklch(0.55_0.15_160/0.4)]",
  },
  [TournamentStatus.upcoming]: {
    label: "Upcoming",
    className: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  },
  [TournamentStatus.closed]: {
    label: "Closed",
    className: "bg-gray-800/60 text-gray-400 border-gray-700/50",
  },
};

export function StatusBadge({ status }: { status: TournamentStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold ${config.className}`}
    >
      {status === TournamentStatus.active && (
        <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      )}
      {config.label}
    </Badge>
  );
}
