import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2, LogOut, Phone, Shield, Sword } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Mode } from "./backend.d";
import { AdminPanel } from "./components/AdminPanel";
import { RegistrationModal } from "./components/RegistrationModal";
import { TournamentCard } from "./components/TournamentCard";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import type { Tournament } from "./hooks/useQueries";
import { useAllTournaments, useIsAdmin } from "./hooks/useQueries";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster />
    </QueryClientProvider>
  );
}

function AppInner() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const [showAdmin, setShowAdmin] = useState(false);
  const [modeFilter, setModeFilter] = useState<Mode | "All">("All");
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [regModalOpen, setRegModalOpen] = useState(false);

  const { data: tournaments = [], isLoading } = useAllTournaments();
  const { data: isAdmin } = useIsAdmin();

  useEffect(() => {
    if (isAdmin) setShowAdmin(true);
  }, [isAdmin]);

  const filteredTournaments =
    modeFilter === "All"
      ? tournaments
      : tournaments.filter((t) => t.mode === modeFilter);

  const modes: (Mode | "All")[] = ["All", Mode.Solo, Mode.Duo, Mode.Squad];

  function handleRegister(t: Tournament) {
    setSelectedTournament(t);
    setRegModalOpen(true);
  }

  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sword className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              BGMI <span className="text-primary">Tournament Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:8120888131"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              data-ocid="header.link"
            >
              <Phone className="w-3.5 h-3.5" />
              8120888131
            </a>

            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAdmin(!showAdmin)}
                className="border-primary/40 text-primary hover:bg-primary/10"
                data-ocid="admin.toggle"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                {showAdmin ? "Public View" : "Admin"}
              </Button>
            )}

            {isLoggedIn ? (
              <Button
                size="sm"
                variant="outline"
                onClick={clear}
                className="border-border text-muted-foreground hover:text-foreground"
                data-ocid="header.secondary_button"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={login}
                disabled={loginStatus === "logging-in" || isInitializing}
                className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                data-ocid="header.secondary_button"
              >
                {loginStatus === "logging-in" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />{" "}
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 mr-1.5" /> Admin Login
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {showAdmin && isAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto max-w-6xl px-4 py-8"
            >
              <AdminPanel />
            </motion.div>
          ) : (
            <motion.div
              key="public"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,oklch(0.22_0.06_68/0.12),transparent)] pointer-events-none" />
                <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 font-semibold">
                      🔥 Season 2026 — Now Open
                    </Badge>
                    <h1 className="font-display font-extrabold text-5xl md:text-6xl text-foreground mb-4 leading-tight">
                      BGMI{" "}
                      <span className="text-primary drop-shadow-[0_0_20px_oklch(0.76_0.17_68/0.6)]">
                        Tournament
                      </span>
                      <br />
                      Hub
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                      Join the ultimate Battlegrounds Mobile India tournament.
                      Register your squad, battle for glory, claim the chicken
                      dinner!
                    </p>

                    <a
                      href="tel:8120888131"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary/10 border-2 border-primary/40 text-primary font-bold text-lg hover:bg-primary/20 transition-all shadow-glow"
                      data-ocid="hero.link"
                    >
                      <Phone className="w-5 h-5" />📞 Contact Organizer:
                      8120888131
                    </a>
                  </motion.div>
                </div>
              </section>

              {/* Tournaments Section */}
              <section
                className="container mx-auto max-w-6xl px-4 pb-16"
                data-ocid="tournaments.section"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-display font-bold text-2xl text-foreground">
                    Active Tournaments
                    <span className="ml-2 text-lg font-normal text-muted-foreground">
                      ({filteredTournaments.length})
                    </span>
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {modes.map((m) => (
                      <Button
                        key={m}
                        size="sm"
                        variant={modeFilter === m ? "default" : "outline"}
                        className={
                          modeFilter === m
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                        }
                        onClick={() => setModeFilter(m)}
                        data-ocid="tournaments.filter.tab"
                      >
                        {m}
                      </Button>
                    ))}
                  </div>
                </div>

                {isLoading ? (
                  <div
                    className="flex items-center justify-center py-24"
                    data-ocid="tournaments.loading_state"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  </div>
                ) : filteredTournaments.length === 0 ? (
                  <div
                    className="text-center py-24 border border-dashed border-border rounded-xl"
                    data-ocid="tournaments.empty_state"
                  >
                    <p className="text-2xl mb-2">🎮</p>
                    <p className="text-muted-foreground font-medium">
                      No tournaments found for this filter.
                    </p>
                  </div>
                ) : (
                  <div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    data-ocid="tournaments.list"
                  >
                    {filteredTournaments.map((t, i) => (
                      <TournamentCard
                        key={t.id.toString()}
                        tournament={t}
                        index={i}
                        onRegister={handleRegister}
                      />
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">
              BGMI Tournament Hub
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <a
              href="tel:8120888131"
              className="text-primary font-semibold hover:underline"
            >
              8120888131
            </a>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <RegistrationModal
        tournament={selectedTournament}
        open={regModalOpen}
        onClose={() => setRegModalOpen(false)}
      />
    </div>
  );
}
