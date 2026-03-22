# BGMI Tournament Registration App

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Public tournament listing page with upcoming tournaments, map, mode, date, slots remaining
- Player registration form (name, BGMI ID/UID, team name for duo/squad, contact number)
- Registration slot tracking -- close registration when full
- Admin panel (authenticated) to create/manage tournaments (date, map, mode, slot count)
- Admin view of registered players/teams per tournament
- Organizer contact number 8120888131 displayed prominently
- Support for Solo, Duo, Squad registration modes
- Maps: Erangel, Miramar, Sanhok, Vikendi, Livik

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Tournament entity (id, name, date, map, mode, totalSlots, registeredCount, status)
2. Backend: Registration entity (id, tournamentId, playerName, bgmiId, teamName, contactNumber, mode, registeredAt)
3. Backend: CRUD for tournaments (admin only)
4. Backend: Player registration endpoint (public) with slot validation
5. Backend: Get registrations per tournament (admin only)
6. Frontend: Public listing page with tournament cards
7. Frontend: Registration modal/form per tournament
8. Frontend: Admin login and management panel (create/edit tournaments, view registrations)
9. Frontend: Prominent contact info display
10. Frontend: Gaming dark theme with orange/gold accents
