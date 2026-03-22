import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MapType,
  Mode,
  Registration,
  Tournament,
  TournamentStatus,
} from "../backend.d";
import { useActor } from "./useActor";

export type { Tournament, Registration };

export function useAllTournaments() {
  const { actor, isFetching } = useActor();
  return useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTournaments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTournamentRegistrations(tournamentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["registrations", tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || tournamentId === null) return [];
      return actor.getTournamentRegistrations(tournamentId);
    },
    enabled: !!actor && !isFetching && tournamentId !== null,
  });
}

export function useRegisterForTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tournamentId,
      playerName,
      bgmiId,
      teamName,
      contactNumber,
    }: {
      tournamentId: bigint;
      playerName: string;
      bgmiId: string;
      teamName: string | null;
      contactNumber: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerForTournament(
        tournamentId,
        playerName,
        bgmiId,
        teamName,
        contactNumber,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
}

export function useCreateTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      date: string;
      map: string;
      mode: string;
      totalSlots: bigint;
      status: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTournament(
        data.name,
        data.date,
        data.map,
        data.mode,
        data.totalSlots,
        data.status,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tournaments"] }),
  });
}

export function useUpdateTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name?: string | null;
      date?: string | null;
      map?: string | null;
      mode?: string | null;
      totalSlots?: bigint | null;
      status?: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTournament(
        data.id,
        data.name ?? null,
        data.date ?? null,
        data.map ?? null,
        data.mode ?? null,
        data.totalSlots ?? null,
        data.status ?? null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tournaments"] }),
  });
}

export function useDeleteTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTournament(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tournaments"] }),
  });
}

export function useDeleteRegistration() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRegistration(id);
    },
    onSuccess: (_d, _v, ctx: { tournamentId?: bigint } | undefined) => {
      qc.invalidateQueries({ queryKey: ["registrations"] });
      if (ctx?.tournamentId) {
        qc.invalidateQueries({
          queryKey: ["registrations", ctx.tournamentId.toString()],
        });
      }
    },
  });
}
