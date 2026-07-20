import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, ShieldCheck, User,
  Users, FolderTree, Star, Settings,
} from "lucide-react";

import Sidebar from "./Sidebar";
import ProfileMenu from "./ProfileMenu";
import { toggleMobileNav } from "../../features/ui/uiSlice";

const SELLER_ITEMS = [
  { label: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/seller/products", icon: Package },
  { label: "Orders", path: "/seller/orders", icon: ShoppingCart },
  { label: "Messages", path: "/seller/messages", icon: MessageSquare },
  { label: "Verification", path: "/seller/verification", icon: ShieldCheck },
  { label: "Profile", path: "/seller/profile", icon: User },
];

const ADMIN_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Sellers", path: "/admin/sellers/verification", icon: ShieldCheck },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", path: "/admin/categories", icon: FolderTree },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const items = user?.role === "admin" ? ADMIN_ITEMS : SELLER_ITEMS;
  const title = user?.role === "admin" ? "Admin Panel" : "Seller Panel";

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      <Sidebar title={title} items={items} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[var(--color-card)] border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-6">
          <button
            className="md:hidden text-[var(--color-text-primary)]"
            onClick={() => dispatch(toggleMobileNav())}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-[family-name:var(--font-display)] font-semibold hidden md:block">
            {title}
          </span>
          <ProfileMenu />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
