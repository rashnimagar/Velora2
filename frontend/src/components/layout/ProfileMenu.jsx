import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut, ShieldCheck, User } from "lucide-react";
import { logoutUser } from "../../features/auth/authSlice";

const ROLE_LINKS = {
  seller: { label: "Seller Verification", path: "/seller/verification", icon: ShieldCheck },
  admin: { label: "Admin Panel", path: "/admin/sellers/verification", icon: LayoutDashboard },
};

export default function ProfileMenu() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.username?.slice(0, 2).toUpperCase() || "U";
  const roleLink = ROLE_LINKS[user.role];

  const handleLogout = async () => {
    setOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-black/5 transition"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold">
          {initials}
        </span>
        <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)]" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md py-2 z-50">
          <div className="px-4 py-2 border-b border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {user.username}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] capitalize">{user.role}</p>
          </div>

          {roleLink && (
            <button
              onClick={() => {
                setOpen(false);
                navigate(roleLink.path);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-50"
            >
              <roleLink.icon className="h-4 w-4" />
              {roleLink.label}
            </button>
          )}

          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-50"
          >
            <User className="h-4 w-4" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
