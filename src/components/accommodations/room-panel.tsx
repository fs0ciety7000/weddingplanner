import { Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDialog } from "@/components/form-dialog";
import { RoomFields } from "@/components/accommodations/room-fields";
import {
  assignGuestToRoom,
  deleteRoom,
  unassignGuestFromRoom,
  updateRoom,
} from "@/lib/actions/accommodations";
import { formatEUR } from "@/lib/format";
import type { Guest, Room, RoomAssignment } from "@/lib/types/database";

type RoomWithAssignments = Room & { room_assignments: (RoomAssignment & { guests: Guest | null })[] };

export function RoomPanel({
  room,
  allGuests,
}: {
  room: RoomWithAssignments;
  allGuests: Guest[];
}) {
  const assigned = room.room_assignments.filter((a) => a.guests);
  const assignedGuestIds = new Set(assigned.map((a) => a.guest_id));
  const available = allGuests.filter((g) => !assignedGuestIds.has(g.id));
  const totalCost = room.price_per_night ? room.price_per_night * room.nights : null;
  const costPerGuestPerNight =
    room.price_per_night && assigned.length > 0 ? room.price_per_night / assigned.length : null;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <h4 className="text-body-strong text-foreground">{room.name}</h4>
          <p className="text-small mt-0.5 text-muted-foreground">
            {room.capacity} places · {room.nights} nuit{room.nights > 1 ? "s" : ""}
            {room.price_per_night ? ` · ${formatEUR(room.price_per_night)}/nuit` : ""}
            {" · réglé par "}
            {room.payer === "invites" ? "les invités" : "nous"}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <FormDialog
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Modifier la chambre">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Button>
            }
            title="Modifier la chambre"
            action={updateRoom.bind(null, room.id)}
          >
            <RoomFields room={room} />
          </FormDialog>
          <form action={deleteRoom.bind(null, room.id)}>
            <Button variant="ghost" size="icon-sm" type="submit" aria-label="Supprimer la chambre">
              <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
            </Button>
          </form>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {assigned.length > 0 ? (
          <ul className="space-y-1.5">
            {assigned.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-sm bg-sage-pale px-2.5 py-1.5 text-sm text-sage-deep"
              >
                <span>
                  {a.guests?.first_name} {a.guests?.last_name ?? ""}
                </span>
                <form action={unassignGuestFromRoom.bind(null, a.id)}>
                  <button type="submit" aria-label="Retirer" className="text-sage-deep/70 hover:text-sage-deep">
                    <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun invité attribué.</p>
        )}

        {available.length > 0 && (
          <form action={assignGuestToRoom.bind(null, room.id)} className="flex gap-2">
            <Select name="guest_id">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Attribuer un invité" />
              </SelectTrigger>
              <SelectContent>
                {available.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.first_name} {g.last_name ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline" size="sm" className="shrink-0">
              Ajouter
            </Button>
          </form>
        )}

        {(totalCost !== null || costPerGuestPerNight !== null) && (
          <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
            <span className="text-muted-foreground">Coût total du séjour</span>
            <span className="text-body-strong tabular-nums">{totalCost !== null ? formatEUR(totalCost) : "—"}</span>
          </div>
        )}
        {costPerGuestPerNight !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">€ / invité / nuit</span>
            <span className="tabular-nums text-muted-foreground">{formatEUR(costPerGuestPerNight)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
