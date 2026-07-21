import apiClient from "./apiClient";

export const cartService = {
  get: () => apiClient.get("/cart/").then((r) => r.data),
  add: (productId, quantity = 1) =>
    apiClient.post("/cart/", { product_id: productId, quantity }).then((r) => r.data),
  updateQuantity: (itemId, quantity) =>
    apiClient.patch(`/cart/${itemId}/`, { quantity }).then((r) => r.data),
  remove: (itemId) => apiClient.delete(`/cart/${itemId}/`).then((r) => r.data),
};
