import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import NotFoundPage from "../pages/NotFoundPage";

// Each feature step adds its own routes here (guest/public routes now;
// buyer/seller/admin protected routes arrive with Auth + role guards).
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* <Route path="/products" element={<ProductListingPage />} /> */}
      {/* <Route path="/products/:id" element={<ProductDetailsPage />} /> */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}

      {/* Buyer routes - added in later steps, wrapped in a role guard */}
      {/* Seller routes - added in later steps, wrapped in a role guard */}
      {/* Admin routes - added in later steps, wrapped in a role guard */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
