import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toggleSidebar, closeMobileNav } from "../../features/ui/uiSlice";

/**
 * items: [{ label, path, icon: LucideIcon }]
 * Desktop: collapses to icon-only via Redux ui.isSidebarOpen
 * Mobile: slides in/out as a drawer via Redux ui.isMobileNavOpen
 */
export default function Sidebar({ title, items }) {
  const dispatch = useDispatch();
  const { isSidebarOpen, isMobileNavOpen } = useSelector((s) => s.ui);
  const collapsed = !isSidebarOpen;

  const content = (
    <>
      <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-border)]">
        {!collapsed && (
          <span className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-primary)] truncate">
            {title}
          </span>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden md:flex text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        <button
          onClick={() => dispatch(closeMobileNav())}
          className="md:hidden text-[var(--color-text-secondary)]"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => dispatch(closeMobileNav())}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-gray-50"
              }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-[var(--color-card)] border-r border-[var(--color-border)] shrink-0 transition-all ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => dispatch(closeMobileNav())}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-lg flex flex-col">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
