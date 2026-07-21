import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, onChange, min = 1, max, disabled = false }) {
  const decrease = () => onChange(Math.max(min, quantity - 1));
  const increase = () => onChange(max ? Math.min(max, quantity + 1) : quantity + 1);

  return (
    <div className="inline-flex items-center border border-[var(--color-border)] rounded-[var(--radius-button)] overflow-hidden">
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || quantity <= min}
        className="px-2.5 py-1.5 text-[var(--color-text-secondary)] hover:bg-gray-50 disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="px-3 text-sm font-medium min-w-[2.5rem] text-center">{quantity}</span>
      <button
        type="button"
        onClick={increase}
        disabled={disabled || (max !== undefined && quantity >= max)}
        className="px-2.5 py-1.5 text-[var(--color-text-secondary)] hover:bg-gray-50 disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
