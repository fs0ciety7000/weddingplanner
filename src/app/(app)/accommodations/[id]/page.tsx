import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";
import { FormDialog } from "@/components/form-dialog";
import { AccommodationFields } from "@/components/accommodations/accommodation-fields";
import { RoomFields } from "@/components/accommodations/room-fields";
import { RoomPanel } from "@/components/accommodations/room-panel";
import {
  createRoom,
  deleteAccommodation,
  updateAccommodation,
} from "@/lib/actions/accommodations";
import { bookingStatusMeta, accommodationTypeLabel } from "@/lib/status";
import { formatEUR } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function AccommodationDetailPage(
  props: PageProps<"/accommodations/[id]">
) {
  const { id } = await props.params;
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data: accommodation }, { data: rooms }, { data: guests }] = await Promise.all([
    supabase
      .from("accommodations")
      .select("*")
      .eq("id", id)
      .eq("wedding_id", wedding.id)
      .maybeSingle(),
    supabase
      .from("rooms")
      .select("*, room_assignments(*, guests(*))")
      .eq("accommodation_id", id)
      .order("order_index", { ascending: true }),
    supabase.from("guests").select("*").eq("wedding_id", wedding.id).order("first_name"),
  ]);

  if (!accommodation) notFound();

  const status = bookingStatusMeta(accommodation.booking_status);
  const roomList = rooms ?? [];
  const guestList = guests ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/accommodations"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Tous les hébergements
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
          <h1 className="text-display mt-2 text-foreground">{accommodation.name}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {accommodationTypeLabel(accommodation.type)}
            {accommodation.address ? ` · ${accommodation.address}` : ""}
            {accommodation.distance_minutes !== null
              ? ` · ${accommodation.distance_minutes} min de route`
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <FormDialog
            trigger={
              <Button variant="outline" className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                Modifier
              </Button>
            }
            title="Modifier l'hébergement"
            action={updateAccommodation.bind(null, accommodation.id)}
          >
            <AccommodationFields accommodation={accommodation} />
          </FormDialog>
          <form action={deleteAccommodation.bind(null, accommodation.id)}>
            <Button variant="outline" size="icon" type="submit" aria-label="Supprimer">
              <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
            </Button>
          </form>
        </div>
      </div>

      {accommodation.price_per_night && (
        <p className="mb-6 text-sm text-muted-foreground">
          Tarif indicatif : <span className="text-body-strong text-foreground">{formatEUR(accommodation.price_per_night)}</span> / nuit
        </p>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-h3 text-foreground">Chambres ({roomList.length})</h2>
        <FormDialog
          trigger={
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              Ajouter une chambre
            </Button>
          }
          title="Ajouter une chambre"
          action={createRoom.bind(null, accommodation.id)}
          submitLabel="Ajouter"
        >
          <RoomFields />
        </FormDialog>
      </div>

      {roomList.length === 0 ? (
        <p className="rounded-md border border-dashed border-line bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          Ajoutez des chambres pour commencer l&apos;attribution des invités.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roomList.map((room) => (
            <RoomPanel key={room.id} room={room} allGuests={guestList} />
          ))}
        </div>
      )}

      {accommodation.notes && (
        <div className="mt-8 space-y-1.5 border-t border-line pt-4">
          <span className="text-label text-muted-foreground">Notes</span>
          <p className="whitespace-pre-wrap text-sm text-foreground">{accommodation.notes}</p>
        </div>
      )}
    </div>
  );
}
