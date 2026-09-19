"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function FormDialog({
  trigger,
  title,
  description,
  action,
  children,
  submitLabel = "Enregistrer",
  className,
}: {
  trigger: React.ReactElement;
  title: string;
  description?: string;
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className={className ?? "sm:max-w-lg"}>
        <form
          action={async (formData) => {
            await action(formData);
            setOpen(false);
          }}
          className="flex max-h-[80vh] flex-col"
        >
          <DialogHeader>
            <DialogTitle className="text-h3">{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="-mx-1 flex-1 space-y-4 overflow-y-auto px-1 py-4">{children}</div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              }
            />
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
