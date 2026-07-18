// Placeholder only — the full Landing Page (hero, featured products,
// categories, testimonials) is its own screen and gets built out when
// we reach that step in the Screen-by-Screen spec. This just confirms
// routing + Tailwind theme tokens are wired correctly.
export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-text-primary)]">
          VELORA
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Project scaffold running. Landing page design comes next.
        </p>
      </div>
    </div>
  );
}
