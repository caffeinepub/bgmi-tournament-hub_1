import { Badge } from "@/components/ui/badge";
import { MapType } from "../backend.d";

const MAP_CONFIG: Record<MapType, { label: string; className: string }> = {
  [MapType.Erangel]: {
    label: "Erangel",
    className: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  },
  [MapType.Miramar]: {
    label: "Miramar",
    className: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  },
  [MapType.Sanhok]: {
    label: "Sanhok",
    className: "bg-teal-900/60 text-teal-300 border-teal-700/50",
  },
  [MapType.Vikendi]: {
    label: "Vikendi",
    className: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  },
  [MapType.Livik]: {
    label: "Livik",
    className: "bg-purple-900/60 text-purple-300 border-purple-700/50",
  },
};

export function MapBadge({ map }: { map: MapType }) {
  const config = MAP_CONFIG[map];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold ${config.className}`}
    >
      🗺 {config.label}
    </Badge>
  );
}
