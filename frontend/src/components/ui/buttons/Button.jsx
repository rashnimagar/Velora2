import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  primary:
    "bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50",
  secondary:
    "bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 disabled:opacity-50",
  danger:
    "bg-[var(--color-danger)] text-white hover:opacity-90 disabled:opacity-50",
  success:
    "bg-[var(--color-success)] text-white hover:opacity-90 disabled:opacity-50",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 py-2.5 font-medium text-sm shadow-sm transition ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
