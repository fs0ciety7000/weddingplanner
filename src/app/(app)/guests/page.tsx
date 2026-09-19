import { Plus, UsersRound, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GuestFields } from "@/components/guests/guest-fields";
import { createGuest, deleteGuest, updateGuest } from "@/lib/actions/guests";
import { rsvpStatusMeta, guestSideLabel } from "@/lib/status";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function GuestsPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("created_at", { ascending: true });

  const guests = data ?? [];
  const totalHeads = guests.reduce(
    (sum, g) => sum + 1 + (g.plus_one ? 1 : 0) + g.children_count,
    0
  );
  const confirmed = guests.filter((g) => g.rsvp_status === "confirme").length;
  const needsLodging = guests.filter((g) => g.needs_lodging).length;

  const addButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter un invité
        </Button>
      }
      title="Ajouter un invité"
      action={createGuest.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <GuestFields />
    </FormDialog>
  );

  return (
    <div>
      <PageHeader
        title="Invités"
        subtitle="La liste qui alimente l'attribution des chambres et les totaux du budget."
        action={addButton}
      />

      {guests.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Aucun invité renseigné"
          description="Ajoutez vos invités pour suivre les RSVP, les régimes alimentaires et les besoins d'hébergement."
          action={addButton}
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">Total personnes</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">{totalHeads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">RSVP confirmés</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">
                  {confirmed}
                  <span className="text-sm font-normal text-muted-foreground">/{guests.length}</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-label text-muted-foreground">Besoin d&apos;un hébergement</p>
                <p className="text-h2 mt-1 tabular-nums text-foreground">{needsLodging}</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto rounded-md border border-line">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead>Invité·e</TableHead>
                  <TableHead>Groupe</TableHead>
                  <TableHead>Côté</TableHead>
                  <TableHead className="text-center">+1 / enfants</TableHead>
                  <TableHead>RSVP</TableHead>
                  <TableHead>Régime</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => {
                  const rsvp = rsvpStatusMeta(guest.rsvp_status);
                  return (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">
                        {guest.first_name} {guest.last_name ?? ""}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{guest.group_label ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {guest.side ? guestSideLabel(guest.side) : "—"}
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-muted-foreground">
                        {guest.plus_one ? "1" : "0"} / {guest.children_count}
                      </TableCell>
                      <TableCell>
                        <StatusPill tone={rsvp.tone}>{rsvp.label}</StatusPill>
                      </TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground">
                        {guest.dietary_restrictions ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <FormDialog
                            trigger={
                              <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </Button>
                            }
                            title="Modifier l'invité"
                            action={updateGuest.bind(null, guest.id)}
                          >
                            <GuestFields guest={guest} />
                          </FormDialog>
                          <form action={deleteGuest.bind(null, guest.id)}>
                            <Button variant="ghost" size="icon-sm" type="submit" aria-label="Supprimer">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
