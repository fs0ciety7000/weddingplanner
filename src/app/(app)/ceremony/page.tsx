import { Plus, CalendarHeart, Pencil, Trash2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventFields } from "@/components/ceremony/event-fields";
import { ProtocolFields } from "@/components/ceremony/protocol-fields";
import { createEvent, createProtocol, deleteEvent, deleteProtocol, updateEvent, updateProtocol } from "@/lib/actions/ceremony";
import { ceremonyCategoryLabel, protocolTypeLabel } from "@/lib/status";
import { formatTimeOfDay } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { requireActiveWedding } from "@/lib/wedding";

export default async function CeremonyPage() {
  const { wedding } = await requireActiveWedding();
  const supabase = await createClient();

  const [{ data: events }, { data: protocols }] = await Promise.all([
    supabase
      .from("ceremony_events")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("start_time", { ascending: true, nullsFirst: false })
      .order("order_index", { ascending: true }),
    supabase
      .from("ceremony_protocols")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("order_index", { ascending: true }),
  ]);

  const eventList = events ?? [];
  const protocolList = protocols ?? [];

  const addEventButton = (
    <FormDialog
      trigger={
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Ajouter un temps fort
        </Button>
      }
      title="Ajouter un temps fort"
      action={createEvent.bind(null, wedding.id)}
      submitLabel="Ajouter"
    >
      <EventFields />
    </FormDialog>
  );

  return (
    <div>
      <PageHeader
        title="Cérémonie & déroulé"
        subtitle="Le fil du jour, du premier « oui » à la dernière danse — une fiche par temps fort."
        action={addEventButton}
      />

      <section className="mb-12">
        {eventList.length === 0 ? (
          <EmptyState
            icon={CalendarHeart}
            title="Le déroulé est vide"
            description="Ajoutez la cérémonie, le vin d'honneur, le dîner… pour construire votre déroulé minute par minute."
            action={addEventButton}
          />
        ) : (
          <ol className="relative space-y-6 border-l border-line pl-6">
            {eventList.map((event) => {
              const fiche = [
                ["Tenues", event.outfits],
                ["Cortège", event.cortege],
                ["Interventions", event.speeches],
                ["Musique d'entrée", event.music],
              ].filter(([, v]) => v) as [string, string][];

              return (
                <li key={event.id} className="relative">
                  <span className="absolute top-1.5 -left-[27px] h-3 w-3 rounded-full border-2 border-background bg-sage-deep" />
                  <Card>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {event.start_time && (
                              <span className="text-h2 tabular-nums text-sage-deep">
                                {formatTimeOfDay(event.start_time)}
                              </span>
                            )}
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {ceremonyCategoryLabel(event.category)}
                            </span>
                          </div>
                          <h3 className="text-h3 mt-1 text-foreground">{event.title}</h3>
                          {event.location && (
                            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                              {event.location}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <FormDialog
                            trigger={
                              <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </Button>
                            }
                            title="Modifier le temps fort"
                            action={updateEvent.bind(null, event.id)}
                          >
                            <EventFields event={event} />
                          </FormDialog>
                          <form action={deleteEvent.bind(null, event.id)}>
                            <Button variant="ghost" size="icon-sm" type="submit" aria-label="Supprimer">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
                            </Button>
                          </form>
                        </div>
                      </div>

                      {fiche.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 border-t border-line pt-3 sm:grid-cols-2">
                          {fiche.map(([label, value]) => (
                            <div key={label}>
                              <p className="text-label text-muted-foreground">{label}</p>
                              <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="border-t border-line pt-3 text-sm text-muted-foreground">
                          Fiche vide : ajoutez tenues, cortège, interventions ou musique.
                        </p>
                      )}

                      {event.notes && <p className="text-sm text-muted-foreground">{event.notes}</p>}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-h3 text-foreground">Fiches complémentaires</h2>
          <FormDialog
            trigger={
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Nouvelle fiche
              </Button>
            }
            title="Nouvelle fiche protocole"
            action={createProtocol.bind(null, wedding.id)}
            submitLabel="Créer"
          >
            <ProtocolFields events={eventList} />
          </FormDialog>
        </div>

        {protocolList.length === 0 ? (
          <p className="rounded-md border border-dashed border-line bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
            Pour tout ce qui ne rentre pas dans un temps fort précis : protocole général, notes pour les officiants…
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {protocolList.map((protocol) => (
              <Card key={protocol.id}>
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-label text-gold-ink">{protocolTypeLabel(protocol.type)}</span>
                      <h3 className="text-h3 text-foreground">{protocol.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <FormDialog
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                        }
                        title="Modifier la fiche"
                        action={updateProtocol.bind(null, protocol.id)}
                      >
                        <ProtocolFields protocol={protocol} events={eventList} />
                      </FormDialog>
                      <form action={deleteProtocol.bind(null, protocol.id)}>
                        <Button variant="ghost" size="icon-sm" type="submit" aria-label="Supprimer">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.5} />
                        </Button>
                      </form>
                    </div>
                  </div>
                  {protocol.content && (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{protocol.content}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
