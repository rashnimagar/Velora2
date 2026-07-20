import apiClient from "./apiClient";

export const sellerService = {
  getMyVerification: () => apiClient.get("/sellers/verification/").then((r) => r.data),

  submitVerification: (formData) =>
    apiClient
      .post("/sellers/verification/submit/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  // Admin
  listVerifications: (statusFilter) =>
    apiClient
      .get("/sellers/verification/admin/", { params: statusFilter ? { status: statusFilter } : {} })
      .then((r) => r.data),

  approveVerification: (id) =>
    apiClient.post(`/sellers/verification/admin/${id}/approve/`).then((r) => r.data),

  rejectVerification: (id, remarks) =>
    apiClient.post(`/sellers/verification/admin/${id}/reject/`, { remarks }).then((r) => r.data),
};
