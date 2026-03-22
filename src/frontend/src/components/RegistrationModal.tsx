import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Mode } from "../backend.d";
import type { Tournament } from "../hooks/useQueries";
import { useRegisterForTournament } from "../hooks/useQueries";
import { MapBadge } from "./MapBadge";
import { ModeBadge } from "./ModeBadge";
import { StatusBadge } from "./StatusBadge";

interface Props {
  tournament: Tournament | null;
  open: boolean;
  onClose: () => void;
}

export function RegistrationModal({ tournament, open, onClose }: Props) {
  const [playerName, setPlayerName] = useState("");
  const [bgmiId, setBgmiId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [success, setSuccess] = useState(false);
  const register = useRegisterForTournament();

  const needsTeam =
    tournament?.mode === Mode.Duo || tournament?.mode === Mode.Squad;

  function resetForm() {
    setPlayerName("");
    setBgmiId("");
    setTeamName("");
    setContactNumber("");
    setSuccess(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tournament) return;
    if (!playerName.trim() || !bgmiId.trim() || !contactNumber.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (needsTeam && !teamName.trim()) {
      toast.error("Team name is required for this mode.");
      return;
    }
    try {
      await register.mutateAsync({
        tournamentId: tournament.id,
        playerName: playerName.trim(),
        bgmiId: bgmiId.trim(),
        teamName: needsTeam ? teamName.trim() : null,
        contactNumber: contactNumber.trim(),
      });
      setSuccess(true);
      toast.success("Registration successful! Good luck, soldier! 🏆");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  }

  if (!tournament) return null;

  const slotsLeft =
    Number(tournament.totalSlots) - Number(tournament.registeredCount);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent
        className="max-w-md bg-card border-border shadow-card"
        data-ocid="registration.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Register for Tournament
          </DialogTitle>
        </DialogHeader>

        {/* Tournament Info */}
        <div className="rounded-lg bg-muted/30 border border-border p-3 mb-2">
          <p className="font-display font-semibold text-foreground mb-2">
            {tournament.name}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            <MapBadge map={tournament.map} />
            <ModeBadge mode={tournament.mode} />
            <StatusBadge status={tournament.status} />
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>📅 {tournament.date}</span>
            <span>🎯 {slotsLeft} slots left</span>
          </div>
        </div>

        {success ? (
          <div
            className="flex flex-col items-center gap-3 py-8"
            data-ocid="registration.success_state"
          >
            <CheckCircle className="w-14 h-14 text-green-400" />
            <p className="text-lg font-display font-semibold text-green-300">
              You&apos;re registered!
            </p>
            <p className="text-sm text-muted-foreground">
              Good luck, soldier! 🏆
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="playerName"
                className="text-sm text-muted-foreground"
              >
                Player Name *
              </Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your in-game name"
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                data-ocid="registration.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bgmiId" className="text-sm text-muted-foreground">
                BGMI ID / UID *
              </Label>
              <Input
                id="bgmiId"
                value={bgmiId}
                onChange={(e) => setBgmiId(e.target.value)}
                placeholder="Your BGMI UID"
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {needsTeam && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="teamName"
                  className="text-sm text-muted-foreground"
                >
                  Team Name *
                </Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Your team name"
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="contactNumber"
                className="text-sm text-muted-foreground"
              >
                Contact Number *
              </Label>
              <Input
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Your mobile number"
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={register.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold hover:opacity-90 shadow-glow-sm"
              data-ocid="registration.submit_button"
            >
              {register.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Registering...
                </>
              ) : (
                "Register Now 🎮"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
