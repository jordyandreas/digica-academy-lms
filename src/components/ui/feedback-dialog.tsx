"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Check, HelpCircle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FeedbackDialogVariant = "success" | "confirm" | "danger";

export type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: FeedbackDialogVariant;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Called when the primary button is pressed. Success also closes the dialog. */
  onConfirm?: () => void;
  /** Called when the cancel button is pressed, before the dialog closes. */
  onCancel?: () => void;
  hideCancel?: boolean;
  confirmPending?: boolean;
  descriptionClassName?: string;
};

const variantCopy: Record<
  FeedbackDialogVariant,
  { confirmLabel: string; cancelLabel: string }
> = {
  success: { confirmLabel: "Continue", cancelLabel: "Close" },
  confirm: { confirmLabel: "Confirm", cancelLabel: "Cancel" },
  danger: { confirmLabel: "Delete", cancelLabel: "Cancel" },
};

export function FeedbackDialog({
  open,
  onOpenChange,
  variant = "success",
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  hideCancel,
  confirmPending = false,
  descriptionClassName,
}: FeedbackDialogProps) {
  const reduceMotion = useReducedMotion();
  const showCancel = hideCancel ?? variant !== "success";
  const labels = variantCopy[variant];

  const handleConfirm = () => {
    onConfirm?.();
    if (variant === "success") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[22rem] overflow-hidden border-brand-periwinkle/70 p-0 shadow-xl sm:max-w-sm"
        overlayClassName="bg-brand-deep/35 backdrop-blur-[2px]"
      >
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-pale/80 via-white to-white px-6 pb-6 pt-8 text-center">
          <span
            className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand-lavender/30"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -bottom-8 -left-10 h-24 w-24 rounded-full bg-tertiary/10"
            aria-hidden
          />

          <FeedbackIcon variant={variant} reduceMotion={Boolean(reduceMotion)} />

          <DialogTitle className="relative mt-5 text-balance text-xl font-bold tracking-tight text-brand-deep">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription
              className={cn(
                "relative mx-auto mt-2 max-w-[18rem] text-pretty text-sm leading-relaxed text-brand-muted",
                descriptionClassName,
              )}
            >
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}

          <div
            className={cn(
              "relative mt-6 flex flex-col gap-2",
              showCancel && "sm:flex-row-reverse",
            )}
          >
            <Button
              type="button"
              variant={variant === "danger" ? "tertiary" : "default"}
              className="h-11 w-full rounded-xl font-semibold"
              loading={confirmPending}
              onClick={handleConfirm}
            >
              {confirmLabel ?? labels.confirmLabel}
            </Button>
            {showCancel ? (
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl font-semibold"
                disabled={confirmPending}
                onClick={() => {
                  onCancel?.();
                  onOpenChange(false);
                }}
              >
                {cancelLabel ?? labels.cancelLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeedbackIcon({
  variant,
  reduceMotion,
}: {
  variant: FeedbackDialogVariant;
  reduceMotion: boolean;
}) {
  const wrapClass =
    variant === "success"
      ? "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(98,10,121,0.28)]"
      : variant === "danger"
        ? "bg-tertiary text-tertiary-foreground shadow-[0_8px_24px_rgba(231,110,75,0.28)]"
        : "bg-brand-pale text-brand-royal shadow-[0_8px_24px_rgba(98,10,121,0.16)]";

  const Icon =
    variant === "success" ? Check : variant === "danger" ? AlertTriangle : HelpCircle;

  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
      {variant === "success" ? (
        <>
          <Sparkles
            className="absolute -left-1 top-1 h-4 w-4 text-tertiary"
            aria-hidden
          />
          <Sparkles
            className="absolute -right-0.5 bottom-2 h-3.5 w-3.5 text-brand-royal/70"
            aria-hidden
          />
        </>
      ) : null}
      <motion.span
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full",
          wrapClass,
        )}
        initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        aria-hidden
      >
        <Icon className="h-8 w-8" strokeWidth={2.4} />
      </motion.span>
    </div>
  );
}
