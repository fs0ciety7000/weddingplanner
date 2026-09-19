"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOODBOARD_TYPE } from "@/lib/status";
import type { MoodboardItem, MoodboardType } from "@/lib/types/database";

export function MoodboardFields({ item, defaultType }: { item?: MoodboardItem; defaultType?: MoodboardType }) {
  const [type, setType] = useState<MoodboardType>(item?.type ?? defaultType ?? "scenographie");

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="m-type">Type</Label>
        <Select name="type" value={type} onValueChange={(v) => setType(v as MoodboardType)}>
          <SelectTrigger id="m-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOODBOARD_TYPE.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-title">Titre</Label>
        <Input
          id="m-title"
          name="title"
          defaultValue={item?.title ?? ""}
          placeholder={type === "palette" ? "Sauge" : type === "typographie" ? "Cormorant Garamond" : "Bouquet champêtre"}
        />
      </div>

      {type === "palette" && (
        <div className="space-y-1.5">
          <Label htmlFor="m-color">Couleur</Label>
          <div className="flex items-center gap-2">
            <Input id="m-color" name="color_hex" type="text" defaultValue={item?.color_hex ?? "#5f7752"} placeholder="#5f7752" />
          </div>
        </div>
      )}

      {(type === "papier" || type === "floral" || type === "scenographie" || type === "matiere") && (
        <div className="space-y-1.5">
          <Label htmlFor="m-image">URL de l&apos;image</Label>
          <Input id="m-image" name="image_url" type="url" defaultValue={item?.image_url ?? ""} placeholder="https://…" />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="m-link">Lien (source, boutique…)</Label>
        <Input id="m-link" name="link_url" type="url" defaultValue={item?.link_url ?? ""} placeholder="https://…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-tags">Tags (séparés par des virgules)</Label>
        <Input id="m-tags" name="tags" defaultValue={item?.tags?.join(", ") ?? ""} placeholder="champêtre, sauge, lin" />
      </div>
    </>
  );
}
