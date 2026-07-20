import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Wraps role-protected routes. Usage:
 *   <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
 *     <Route path="/orders" element={<BuyerOrdersPage />} />
 *   </Route>
 *
 * - Not authenticated -> redirect to /login (remembers where they were headed)
 * - Authenticated but wrong role -> redirect to home
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
