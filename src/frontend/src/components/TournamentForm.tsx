import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MapType, Mode, TournamentStatus } from "../backend.d";
import type { Tournament } from "../hooks/useQueries";

interface TournamentFormData {
  name: string;
  date: string;
  map: string;
  mode: string;
  totalSlots: string;
  status: string;
}

interface Props {
  initial?: Tournament | null;
  onSubmit: (data: TournamentFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function TournamentForm({
  initial,
  onSubmit,
  isLoading,
  onCancel,
}: Props) {
  const [form, setForm] = useState<TournamentFormData>({
    name: "",
    date: "",
    map: MapType.Erangel,
    mode: Mode.Squad,
    totalSlots: "100",
    status: TournamentStatus.upcoming,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        date: initial.date,
        map: initial.map,
        mode: initial.mode,
        totalSlots: initial.totalSlots.toString(),
        status: initial.status,
      });
    }
  }, [initial]);

  function set(key: keyof TournamentFormData) {
    return (val: string) => setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm text-muted-foreground">
          Tournament Name *
        </Label>
        <Input
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder="e.g. BGMI Pro League #1"
          required
          className="bg-input border-border"
          data-ocid="admin.tournament.input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Date *</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => set("date")(e.target.value)}
            required
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Total Slots *</Label>
          <Input
            type="number"
            min="1"
            value={form.totalSlots}
            onChange={(e) => set("totalSlots")(e.target.value)}
            required
            className="bg-input border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Map</Label>
          <Select value={form.map} onValueChange={set("map")}>
            <SelectTrigger
              className="bg-input border-border"
              data-ocid="admin.tournament.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {Object.values(MapType).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Mode</Label>
          <Select value={form.mode} onValueChange={set("mode")}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {Object.values(Mode).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Status</Label>
          <Select value={form.status} onValueChange={set("status")}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {Object.values(TournamentStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary text-primary-foreground font-semibold hover:opacity-90"
          data-ocid="admin.tournament.submit_button"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : initial ? (
            "Update Tournament"
          ) : (
            "Create Tournament"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-border text-foreground"
          data-ocid="admin.tournament.cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
