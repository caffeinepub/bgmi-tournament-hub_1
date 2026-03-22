import { Badge } from "@/components/ui/badge";
import { Mode } from "../backend.d";

const MODE_CONFIG: Record<
  Mode,
  { label: string; className: string; icon: string }
> = {
  [Mode.Solo]: {
    label: "Solo",
    className: "bg-orange-900/60 text-orange-300 border-orange-700/50",
    icon: "👤",
  },
  [Mode.Duo]: {
    label: "Duo",
    className: "bg-amber-900/60 text-amber-300 border-amber-700/50",
    icon: "👥",
  },
  [Mode.Squad]: {
    label: "Squad",
    className: "bg-red-900/60 text-red-300 border-red-700/50",
    icon: "⚔️",
  },
};

export function ModeBadge({ mode }: { mode: Mode }) {
  const config = MODE_CONFIG[mode];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold ${config.className}`}
    >
      {config.icon} {config.label}
    </Badge>
  );
}
