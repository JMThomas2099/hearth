import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium font-sans transition-[scale,background-color,color,opacity,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive",
  {
    variants: {
      variant: {
        primary: "bg-olive text-olive-fg hover:bg-ink",
        secondary: "bg-surface-2 text-ink hover:opacity-90",
        ghost: "bg-transparent text-ink hover:bg-surface-2",
        outline: "bg-transparent text-ink shadow-border hover:shadow-border-hover",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-sm",
        md: "h-11 px-4 text-sm rounded-md",
        lg: "h-12 px-5 rounded-md",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Badge({
  className,
  tone = "muted",
  ...props
}: React.ComponentProps<"span"> & { tone?: "muted" | "olive" | "ink" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tone === "olive" && "bg-olive text-olive-fg",
        tone === "ink" && "bg-ink text-olive-fg",
        tone === "muted" && "bg-surface-2 text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(clamped)}%</span>
        </div>
      ) : null}
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-olive transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-surface text-ink shadow-border outline-none",
          "sm:inset-y-8 sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:rounded-xl sm:max-h-screen",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
          <DialogPrimitive.Title className="font-display text-xl text-balance">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close
            className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
            aria-label="Close"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </div>
        <DialogPrimitive.Description className="sr-only">{title} recipe</DialogPrimitive.Description>
        <div className="flex-1 px-5 py-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function CheckRow({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md px-1 py-2.5 transition-[background-color,opacity] duration-150 hover:bg-surface-2/70",
        checked && "opacity-55",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-5 shrink-0 rounded-sm border-rule accent-olive"
      />
      <span className={cn("min-w-0 flex-1 text-sm leading-snug", checked && "line-through")}>{children}</span>
    </label>
  );
}
