import apiClient from "./apiClient";

export const categoryService = {
  list: (search) =>
    apiClient.get("/products/categories/", { params: search ? { search } : {} }).then((r) => r.data),

  create: (formData) =>
    apiClient
      .post("/products/categories/", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  update: (id, formData) =>
    apiClient
      .patch(`/products/categories/${id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  remove: (id) => apiClient.delete(`/products/categories/${id}/`).then((r) => r.data),
};
