import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ProductListingPage from "../pages/ProductListingPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import SellerVerificationPage from "../pages/seller/SellerVerificationPage";
import SellerProductsPage from "../pages/seller/SellerProductsPage";
import ProductFormPage from "../pages/seller/ProductFormPage";
import AdminSellerVerificationPage from "../pages/admin/AdminSellerVerificationPage";
import AdminCategoryManagementPage from "../pages/admin/AdminCategoryManagementPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

// Each feature step adds its own routes here.
// - PublicLayout (Navbar + Footer) wraps guest/buyer-facing pages.
// - Auth pages stay standalone (centered card, no navbar/footer), per spec.
// - DashboardLayout (Sidebar + top bar) wraps seller/admin pages, each
//   behind a <ProtectedRoute allowedRoles={[...]} /> guard.
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public / guest pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:slug" element={<ProductDetailsPage />} />
      </Route>

      {/* Auth pages - standalone */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Seller dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/seller/verification"
            element={<SellerVerificationPage />}
          />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<ProductFormPage />} />
          <Route
            path="/seller/products/:id/edit"
            element={<ProductFormPage />}
          />
          {/* <Route path="/seller/dashboard" element={<SellerDashboardPage />} /> */}
        </Route>
      </Route>

      {/* Admin dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin/sellers/verification"
            element={<AdminSellerVerificationPage />}
          />
          <Route
            path="/admin/categories"
            element={<AdminCategoryManagementPage />}
          />
        </Route>
      </Route>

      {/* Buyer routes - added in later steps, wrapped in a role guard */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
