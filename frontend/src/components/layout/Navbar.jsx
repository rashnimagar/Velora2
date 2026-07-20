import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Store, X } from "lucide-react";

import Button from "../ui/buttons/Button";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-card)] border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-primary)]">
            VELORA
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text-primary)]">
          <Link to="/" className="hover:text-[var(--color-primary)]">Home</Link>
          <Link to="/products" className="hover:text-[var(--color-primary)]">Products</Link>
          {!isAuthenticated && (
            <Link to="/register" className="hover:text-[var(--color-primary)] flex items-center gap-1">
              <Store className="h-4 w-4" /> Become a Seller
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Button variant="secondary" onClick={() => navigate("/login")} className="!px-4 !py-1.5">
                Login
              </Button>
              <Button onClick={() => navigate("/register")} className="!px-4 !py-1.5">
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-text-primary)]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm">Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="text-sm">Products</Link>
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => navigate("/login")} className="flex-1 !py-1.5">
                Login
              </Button>
              <Button onClick={() => navigate("/register")} className="flex-1 !py-1.5">
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
