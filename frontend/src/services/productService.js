import apiClient from "./apiClient";

export const productService = {
  // Public browsing (guest/buyer facing)
  browse: (params) =>
    apiClient.get("/products/", { params }).then((r) => r.data),
  getBySlug: (slug) => apiClient.get(`/products/${slug}/`).then((r) => r.data),

  // Seller product management
  list: (search) =>
    apiClient
      .get("/products/my-products/", { params: search ? { search } : {} })
      .then((r) => r.data),

  get: (id) =>
    apiClient.get(`/products/my-products/${id}/`).then((r) => r.data),

  create: (payload) =>
    apiClient.post("/products/my-products/", payload).then((r) => r.data),

  update: (id, payload) =>
    apiClient
      .patch(`/products/my-products/${id}/`, payload)
      .then((r) => r.data),

  remove: (id) =>
    apiClient.delete(`/products/my-products/${id}/`).then((r) => r.data),

  uploadImages: (productId, files) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    return apiClient
      .post(`/products/my-products/${productId}/images/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  deleteImage: (productId, imageId) =>
    apiClient
      .delete(`/products/my-products/${productId}/images/${imageId}/`)
      .then((r) => r.data),
};
