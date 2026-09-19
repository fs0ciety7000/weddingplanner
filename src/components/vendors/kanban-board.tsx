"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import { StarRatingReadOnly } from "@/components/star-rating";
import { VendorFields } from "@/components/vendors/vendor-fields";
import { moveVendor, updateVendor } from "@/lib/actions/vendors";
import { formatEUR, formatDateShortFr } from "@/lib/format";
import { VENDOR_STATUS, vendorCategoryLabel } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Vendor, VendorStatus } from "@/lib/types/database";

export function KanbanBoard({ vendors }: { vendors: Vendor[] }) {
  const [items, setItems] = useState(vendors);
  const [prevVendors, setPrevVendors] = useState(vendors);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (vendors !== prevVendors) {
    setPrevVendors(vendors);
    setItems(vendors);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = String(over.id) as VendorStatus;
    const vendor = items.find((v) => v.id === active.id);
    if (!vendor || vendor.status === newStatus) return;

    setItems((prev) =>
      prev.map((v) => (v.id === vendor.id ? { ...v, status: newStatus } : v))
    );
    startTransition(() => {
      moveVendor(vendor.id, newStatus);
    });
  }

  const activeVendor = items.find((v) => v.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-5">
        {VENDOR_STATUS.map((column) => (
          <KanbanColumn
            key={column.value}
            status={column.value}
            label={column.label}
            vendors={items.filter((v) => v.status === column.value)}
          />
        ))}
      </div>

      <DragOverlay>{activeVendor && <VendorCard vendor={activeVendor} dragging />}</DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  status,
  label,
  vendors,
}: {
  status: VendorStatus;
  label: string;
  vendors: Vendor[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-40 flex-col gap-2.5 rounded-md bg-muted/60 p-2.5 transition-colors",
        isOver && "bg-sage-pale/70"
      )}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-label text-muted-foreground">{label}</h3>
        <span className="text-xs tabular-nums text-muted-foreground">{vendors.length}</span>
      </div>
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}

function VendorCard({ vendor, dragging = false }: { vendor: Vendor; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: vendor.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab gap-2 py-3 shadow-card active:cursor-grabbing",
        (isDragging || dragging) && "rotate-1 opacity-90"
      )}
    >
      <div className="flex items-start justify-between gap-2 px-3">
        <div>
          <span className="text-xs text-muted-foreground">{vendorCategoryLabel(vendor.category)}</span>
          <h4 className="text-body-strong text-foreground">{vendor.name}</h4>
        </div>
        <FormDialog
          trigger={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Modifier"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Button>
          }
          title="Modifier le prestataire"
          action={updateVendor.bind(null, vendor.id)}
        >
          <VendorFields vendor={vendor} />
        </FormDialog>
      </div>
      <div className="flex items-center justify-between px-3 text-sm">
        <span className="tabular-nums text-muted-foreground">
          {vendor.quote_amount ? formatEUR(vendor.quote_amount) : "Devis en attente"}
        </span>
        {vendor.rating ? <StarRatingReadOnly value={vendor.rating} size="h-3 w-3" /> : null}
      </div>
      {vendor.next_contact_date && (
        <p className="px-3 text-xs text-muted-foreground">{formatDateShortFr(vendor.next_contact_date)}</p>
      )}
      {vendor.deposit_paid && (
        <div className="px-3">
          <span className="inline-flex rounded-full bg-sage-pale px-2 py-0.5 text-xs text-sage-deep">
            Acompte versé
          </span>
        </div>
      )}
    </Card>
  );
}
