export default function TextInput({
  label,
  error,
  icon: Icon,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
        )}
        <input
          className={`w-full rounded-[var(--radius-input)] border ${
            error
              ? "border-[var(--color-danger)]"
              : "border-[var(--color-border)]"
          } bg-white px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 ${
            Icon ? "pl-9" : ""
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
