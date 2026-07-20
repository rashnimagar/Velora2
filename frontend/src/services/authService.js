import apiClient from "./apiClient";

export const authService = {
  register: (payload) =>
    apiClient.post("/auth/register/", payload).then((r) => r.data),
  login: (payload) =>
    apiClient.post("/auth/login/", payload).then((r) => r.data),
  logout: (refresh) =>
    apiClient.post("/auth/logout/", { refresh }).then((r) => r.data),
  me: () => apiClient.get("/auth/me/").then((r) => r.data),
  requestPasswordReset: (email) =>
    apiClient.post("/auth/password-reset/", { email }).then((r) => r.data),
  confirmPasswordReset: (payload) =>
    apiClient
      .post("/auth/password-reset/confirm/", payload)
      .then((r) => r.data),
};
