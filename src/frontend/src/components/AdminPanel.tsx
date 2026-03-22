import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Tournament } from "../hooks/useQueries";
import {
  useAllTournaments,
  useCreateTournament,
  useDeleteRegistration,
  useDeleteTournament,
  useTournamentRegistrations,
  useUpdateTournament,
} from "../hooks/useQueries";
import { MapBadge } from "./MapBadge";
import { ModeBadge } from "./ModeBadge";
import { StatusBadge } from "./StatusBadge";
import { TournamentForm } from "./TournamentForm";

export function AdminPanel() {
  const { data: tournaments = [], isLoading: tournamentsLoading } =
    useAllTournaments();
  const [showForm, setShowForm] = useState(false);
  const [editTournament, setEditTournament] = useState<Tournament | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);

  const createTournament = useCreateTournament();
  const updateTournament = useUpdateTournament();
  const deleteTournament = useDeleteTournament();
  const deleteRegistration = useDeleteRegistration();

  const selectedId = selectedTournamentId ? BigInt(selectedTournamentId) : null;
  const { data: registrations = [], isLoading: regsLoading } =
    useTournamentRegistrations(selectedId);

  async function handleCreateOrUpdate(data: {
    name: string;
    date: string;
    map: string;
    mode: string;
    totalSlots: string;
    status: string;
  }) {
    try {
      if (editTournament) {
        await updateTournament.mutateAsync({
          id: editTournament.id,
          name: data.name,
          date: data.date,
          map: data.map,
          mode: data.mode,
          totalSlots: BigInt(data.totalSlots),
          status: data.status,
        });
        toast.success("Tournament updated!");
      } else {
        await createTournament.mutateAsync({
          name: data.name,
          date: data.date,
          map: data.map,
          mode: data.mode,
          totalSlots: BigInt(data.totalSlots),
          status: data.status,
        });
        toast.success("Tournament created!");
      }
      setShowForm(false);
      setEditTournament(null);
    } catch {
      toast.error("Failed to save tournament.");
    }
  }

  async function handleDeleteTournament(id: bigint) {
    if (!confirm("Delete this tournament? This cannot be undone.")) return;
    try {
      await deleteTournament.mutateAsync(id);
      toast.success("Tournament deleted.");
    } catch {
      toast.error("Failed to delete tournament.");
    }
  }

  async function handleDeleteRegistration(id: bigint) {
    if (!confirm("Remove this registration?")) return;
    try {
      await deleteRegistration.mutateAsync(id);
      toast.success("Registration removed.");
    } catch {
      toast.error("Failed to remove registration.");
    }
  }

  return (
    <div className="space-y-6" data-ocid="admin.panel">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full bg-primary" />
        <h2 className="font-display font-bold text-2xl text-foreground">
          Admin Panel
        </h2>
      </div>

      <Tabs defaultValue="tournaments">
        <TabsList className="bg-muted/30 border border-border">
          <TabsTrigger
            value="tournaments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.tab"
          >
            🏆 Tournaments
          </TabsTrigger>
          <TabsTrigger
            value="registrations"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.tab"
          >
            <Users className="w-4 h-4 mr-1.5" /> Registrations
          </TabsTrigger>
        </TabsList>

        {/* TOURNAMENTS TAB */}
        <TabsContent value="tournaments" className="mt-6 space-y-4">
          <AnimatePresence>
            {(showForm || editTournament) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card border border-border rounded-xl p-5"
                data-ocid="admin.tournament.panel"
              >
                <h3 className="font-display font-semibold text-lg mb-4">
                  {editTournament ? "Edit Tournament" : "Create Tournament"}
                </h3>
                <TournamentForm
                  initial={editTournament}
                  onSubmit={handleCreateOrUpdate}
                  isLoading={
                    createTournament.isPending || updateTournament.isPending
                  }
                  onCancel={() => {
                    setShowForm(false);
                    setEditTournament(null);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!showForm && !editTournament && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground font-semibold hover:opacity-90 shadow-glow-sm"
              data-ocid="admin.tournament.primary_button"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Tournament
            </Button>
          )}

          {tournamentsLoading ? (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tournaments.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              No tournaments yet. Create one above.
            </div>
          ) : (
            <div className="space-y-3">
              {tournaments.map((t, i) => (
                <motion.div
                  key={t.id.toString()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
                  data-ocid="admin.tournament.row"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-foreground truncate">
                      {t.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <MapBadge map={t.map} />
                      <ModeBadge mode={t.mode} />
                      <StatusBadge status={t.status} />
                      <Badge
                        variant="outline"
                        className="text-xs border-border text-muted-foreground"
                      >
                        📅 {t.date}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-border text-muted-foreground"
                      >
                        👥 {t.registeredCount.toString()}/
                        {t.totalSlots.toString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:border-primary/50 text-foreground"
                      onClick={() => {
                        setEditTournament(t);
                        setShowForm(false);
                      }}
                      data-ocid="admin.tournament.edit_button"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTournament(t.id)}
                      data-ocid="admin.tournament.delete_button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* REGISTRATIONS TAB */}
        <TabsContent value="registrations" className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Select
              value={selectedTournamentId ?? ""}
              onValueChange={setSelectedTournamentId}
            >
              <SelectTrigger
                className="w-72 bg-input border-border"
                data-ocid="admin.registrations.select"
              >
                <SelectValue placeholder="Select a tournament..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {tournaments.map((t) => (
                  <SelectItem key={t.id.toString()} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedTournamentId ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.registrations.empty_state"
            >
              Select a tournament to view registrations.
            </div>
          ) : regsLoading ? (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="admin.registrations.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : registrations.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.registrations.empty_state"
            >
              No registrations yet for this tournament.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Table data-ocid="admin.registrations.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">#</TableHead>
                    <TableHead className="text-muted-foreground">
                      Player Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      BGMI ID
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Team
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Contact
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Registered
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg, i) => (
                    <TableRow
                      key={reg.id.toString()}
                      className="border-border hover:bg-muted/20"
                      data-ocid="admin.registrations.row"
                    >
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {reg.playerName}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {reg.bgmiId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {reg.teamName ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {reg.contactNumber}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(
                          Number(reg.registeredAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/50 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteRegistration(reg.id)}
                          data-ocid="admin.registrations.delete_button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
