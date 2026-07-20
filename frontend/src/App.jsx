import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import AppRoutes from "./routes/AppRoutes";
import { fetchCurrentUser } from "./features/auth/authSlice";

function SessionHydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("velora_access_token")) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SessionHydrator />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
