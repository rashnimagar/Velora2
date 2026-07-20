import { Link } from "react-router-dom";
import { Globe, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-primary)]">
            VELORA
          </span>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-xs">
            A trust-focused marketplace connecting verified sellers with buyers.
          </p>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--color-text-primary)]">Company</span>
            <Link to="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">About</Link>
            <Link to="/contact" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Contact</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--color-text-primary)]">Legal</span>
            <Link to="/privacy" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Privacy Policy</Link>
            <Link to="/terms" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Terms</Link>
          </div>
        </div>

        <div className="flex gap-3">
          <a href="#" aria-label="Website" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
            <Globe className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Email" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
            <Mail className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-text-secondary)]">
        © {new Date().getFullYear()} VELORA. All rights reserved.
      </div>
    </footer>
  );
}
