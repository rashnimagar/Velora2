export default function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-50 ${
          checked ? "bg-[var(--color-success)]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {label && (
        <span className="text-sm text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
    </label>
  );
}
