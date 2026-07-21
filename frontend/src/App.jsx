import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/store";
import AppRoutes from "./routes/AppRoutes";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";

function SessionHydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("velora_access_token")) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return null;
}

function CartHydrator() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  useEffect(() => {
    if (isAuthenticated && user?.role === "buyer") {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, user, dispatch]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SessionHydrator />
        <CartHydrator />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
