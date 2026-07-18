import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[var(--color-primary)]">404</h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          This page doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-2.5 text-white font-medium hover:opacity-90 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
