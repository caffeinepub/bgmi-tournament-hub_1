import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Order "mo:core/Order";

actor {
  // Authorization setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.notEqual(user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Types
  type MapType = {
    #Erangel;
    #Miramar;
    #Sanhok;
    #Vikendi;
    #Livik;
  };

  module MapType {
    public func compare(mapType1 : MapType, mapType2 : MapType) : Order.Order {
      Nat.compare(
        switch (mapType1) {
          case (#Erangel) { 0 };
          case (#Miramar) { 1 };
          case (#Sanhok) { 2 };
          case (#Vikendi) { 3 };
          case (#Livik) { 4 };
        },
        switch (mapType2) {
          case (#Erangel) { 0 };
          case (#Miramar) { 1 };
          case (#Sanhok) { 2 };
          case (#Vikendi) { 3 };
          case (#Livik) { 4 };
        },
      );
    };

    public func fromText(text : Text) : ?MapType {
      switch (text) {
        case ("Erangel") { ?#Erangel };
        case ("Miramar") { ?#Miramar };
        case ("Sanhok") { ?#Sanhok };
        case ("Vikendi") { ?#Vikendi };
        case ("Livik") { ?#Livik };
        case (_) { null };
      };
    };

    public func toText(mapType : MapType) : Text {
      switch (mapType) {
        case (#Erangel) { "Erangel" };
        case (#Miramar) { "Miramar" };
        case (#Sanhok) { "Sanhok" };
        case (#Vikendi) { "Vikendi" };
        case (#Livik) { "Livik" };
      };
    };
  };

  type Mode = {
    #Solo;
    #Duo;
    #Squad;
  };

  module Mode {
    public func compare(mode1 : Mode, mode2 : Mode) : Order.Order {
      Nat.compare(
        switch (mode1) {
          case (#Solo) { 0 };
          case (#Duo) { 1 };
          case (#Squad) { 2 };
        },
        switch (mode2) {
          case (#Solo) { 0 };
          case (#Duo) { 1 };
          case (#Squad) { 2 };
        },
      );
    };

    public func fromText(text : Text) : ?Mode {
      switch (text) {
        case ("Solo") { ?#Solo };
        case ("Duo") { ?#Duo };
        case ("Squad") { ?#Squad };
        case (_) { null };
      };
    };

    public func toText(mode : Mode) : Text {
      switch (mode) {
        case (#Solo) { "Solo" };
        case (#Duo) { "Duo" };
        case (#Squad) { "Squad" };
      };
    };
  };

  type TournamentStatus = {
    #active;
    #closed;
    #upcoming;
  };

  module TournamentStatus {
    public func compare(status1 : TournamentStatus, status2 : TournamentStatus) : Order.Order {
      Nat.compare(
        switch (status1) {
          case (#upcoming) { 0 };
          case (#active) { 1 };
          case (#closed) { 2 };
        },
        switch (status2) {
          case (#upcoming) { 0 };
          case (#active) { 1 };
          case (#closed) { 2 };
        },
      );
    };

    public func fromText(status : Text) : ?TournamentStatus {
      switch (status) {
        case ("active") { ?#active };
        case ("closed") { ?#closed };
        case ("upcoming") { ?#upcoming };
        case (_) { null };
      };
    };

    public func toText(status : TournamentStatus) : Text {
      switch (status) {
        case (#active) { "active" };
        case (#closed) { "closed" };
        case (#upcoming) { "upcoming" };
      };
    };
  };

  public type Tournament = {
    id : Nat;
    name : Text;
    date : Text;
    map : MapType;
    mode : Mode;
    totalSlots : Nat;
    registeredCount : Nat;
    status : TournamentStatus;
    createdAt : Int;
  };

  module Tournament {
    public func compare(tournament1 : Tournament, tournament2 : Tournament) : Order.Order {
      Nat.compare(tournament1.id, tournament2.id);
    };
  };

  type Registration = {
    id : Nat;
    tournamentId : Nat;
    playerName : Text;
    bgmiId : Text;
    teamName : ?Text;
    contactNumber : Text;
    registeredAt : Int;
  };

  module Registration {
    public func compare(registration1 : Registration, registration2 : Registration) : Order.Order {
      Nat.compare(registration1.id, registration2.id);
    };
  };

  // Persistent data
  let tournaments = Map.empty<Nat, Tournament>();
  let registrations = Map.empty<Nat, Registration>();
  var nextTournamentId = 1;
  var nextRegistrationId = 1;

  // Tournament Management
  public shared ({ caller }) func createTournament(name : Text, date : Text, map : Text, mode : Text, totalSlots : Nat, status : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };
    let id = nextTournamentId;
    nextTournamentId += 1;

    let mapType = switch (MapType.fromText(map)) {
      case (null) { Runtime.trap("Invalid map type") };
      case (?m) { m };
    };

    let modeType = switch (Mode.fromText(mode)) {
      case (null) { Runtime.trap("Invalid mode type") };
      case (?m) { m };
    };

    let statusType = switch (TournamentStatus.fromText(status)) {
      case (null) { Runtime.trap("Invalid status type") };
      case (?s) { s };
    };

    let tournament : Tournament = {
      id;
      name;
      date;
      map = mapType;
      mode = modeType;
      totalSlots;
      registeredCount = 0;
      status = statusType;
      createdAt = Time.now();
    };

    tournaments.add(id, tournament);
    id;
  };

  public shared ({ caller }) func updateTournament(id : Nat, name : ?Text, date : ?Text, map : ?Text, mode : ?Text, totalSlots : ?Nat, status : ?Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update tournaments");
    };

    switch (tournaments.get(id)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        let updatedTournament : Tournament = {
          id = tournament.id;
          name = switch (name) { case (null) { tournament.name }; case (?n) { n } };
          date = switch (date) { case (null) { tournament.date }; case (?d) { d } };
          map = switch (map) {
            case (null) { tournament.map };
            case (?m) {
              switch (MapType.fromText(m)) {
                case (null) { Runtime.trap("Invalid map type") };
                case (?mt) { mt };
              };
            };
          };
          mode = switch (mode) {
            case (null) { tournament.mode };
            case (?m) {
              switch (Mode.fromText(m)) {
                case (null) { Runtime.trap("Invalid mode type") };
                case (?mt) { mt };
              };
            };
          };
          totalSlots = switch (totalSlots) {
            case (null) { tournament.totalSlots };
            case (?ts) { ts };
          };
          registeredCount = tournament.registeredCount;
          status = switch (status) {
            case (null) { tournament.status };
            case (?s) {
              switch (TournamentStatus.fromText(s)) {
                case (null) { Runtime.trap("Invalid status type") };
                case (?st) { st };
              };
            };
          };
          createdAt = tournament.createdAt;
        };
        tournaments.add(id, updatedTournament);
      };
    };
  };

  public shared ({ caller }) func deleteTournament(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete tournaments");
    };
    if (not tournaments.containsKey(id)) {
      Runtime.trap("Tournament not found");
    };
    tournaments.remove(id);
  };

  public query ({ caller }) func getTournament(id : Nat) : async Tournament {
    switch (tournaments.get(id)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?t) { t };
    };
  };

  public query ({ caller }) func getAllTournaments() : async [Tournament] {
    tournaments.values().toArray().sort();
  };

  // Player Registration
  public shared ({ caller }) func registerForTournament(tournamentId : Nat, playerName : Text, bgmiId : Text, teamName : ?Text, contactNumber : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register for tournaments");
    };

    if (playerName.size() <= 0) { Runtime.trap("Player name cannot be empty") };
    if (bgmiId.size() <= 0) { Runtime.trap("BGMI ID cannot be empty") };
    if (contactNumber.size() <= 0) { Runtime.trap("Contact number cannot be empty") };

    let tournament = switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?t) { t };
    };

    if (tournament.status == #closed) { Runtime.trap("Tournament is closed") };
    if (tournament.registeredCount >= tournament.totalSlots) {
      Runtime.trap("No slots available");
    };

    // Check for duplicate registration
    let isDuplicate = registrations.values().any(
      func(r) {
        r.tournamentId == tournamentId and Text.equal(r.bgmiId, bgmiId)
      }
    );
    if (isDuplicate) {
      Runtime.trap("Already registered with this BGMI ID for this tournament");
    };

    // Create registration
    let id = nextRegistrationId;
    nextRegistrationId += 1;

    let registration : Registration = {
      id;
      tournamentId;
      playerName;
      bgmiId;
      teamName;
      contactNumber;
      registeredAt = Time.now();
    };

    registrations.add(id, registration);

    // Update tournament registered count
    let updatedTournament : Tournament = {
      id = tournament.id;
      name = tournament.name;
      date = tournament.date;
      map = tournament.map;
      mode = tournament.mode;
      totalSlots = tournament.totalSlots;
      registeredCount = tournament.registeredCount + 1;
      status = tournament.status;
      createdAt = tournament.createdAt;
    };
    tournaments.add(tournamentId, updatedTournament);

    id;
  };

  public query ({ caller }) func getTournamentRegistrations(tournamentId : Nat) : async [Registration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view tournament registrations");
    };
    registrations.values().toArray().filter(
      func(r) { r.tournamentId == tournamentId }
    ).sort();
  };

  public shared ({ caller }) func deleteRegistration(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete registrations");
    };

    let registration = switch (registrations.get(id)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?r) { r };
    };

    let tournament = switch (tournaments.get(registration.tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?t) { t };
    };

    if (tournament.registeredCount > 0) {
      let updatedTournament : Tournament = {
        id = tournament.id;
        name = tournament.name;
        date = tournament.date;
        map = tournament.map;
        mode = tournament.mode;
        totalSlots = tournament.totalSlots;
        registeredCount = tournament.registeredCount - 1;
        status = tournament.status;
        createdAt = tournament.createdAt;
      };
      tournaments.add(registration.tournamentId, updatedTournament);
    };

    registrations.remove(id);
  };

  // Get all registrations (admin only)
  public shared ({ caller }) func getAllRegistrations() : async [Registration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray().sort();
  };
};
