import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Registration {
    id: bigint;
    teamName?: string;
    playerName: string;
    contactNumber: string;
    bgmiId: string;
    registeredAt: bigint;
    tournamentId: bigint;
}
export interface Tournament {
    id: bigint;
    map: MapType;
    status: TournamentStatus;
    registeredCount: bigint;
    date: string;
    mode: Mode;
    name: string;
    createdAt: bigint;
    totalSlots: bigint;
}
export interface UserProfile {
    name: string;
}
export enum MapType {
    Livik = "Livik",
    Sanhok = "Sanhok",
    Miramar = "Miramar",
    Vikendi = "Vikendi",
    Erangel = "Erangel"
}
export enum Mode {
    Duo = "Duo",
    Squad = "Squad",
    Solo = "Solo"
}
export enum TournamentStatus {
    closed = "closed",
    active = "active",
    upcoming = "upcoming"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTournament(name: string, date: string, map: string, mode: string, totalSlots: bigint, status: string): Promise<bigint>;
    deleteRegistration(id: bigint): Promise<void>;
    deleteTournament(id: bigint): Promise<void>;
    getAllRegistrations(): Promise<Array<Registration>>;
    getAllTournaments(): Promise<Array<Tournament>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTournament(id: bigint): Promise<Tournament>;
    getTournamentRegistrations(tournamentId: bigint): Promise<Array<Registration>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerForTournament(tournamentId: bigint, playerName: string, bgmiId: string, teamName: string | null, contactNumber: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTournament(id: bigint, name: string | null, date: string | null, map: string | null, mode: string | null, totalSlots: bigint | null, status: string | null): Promise<void>;
}
