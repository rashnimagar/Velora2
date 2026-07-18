// Mirrors the order lifecycle defined in the PRD / Component Library.
export const ORDER_STATUS = {
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  DISPATCHED: "dispatched",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Component Library status color mapping
export const ORDER_STATUS_COLORS = {
  confirmed: "blue",
  processing: "indigo",
  dispatched: "purple",
  delivered: "green",
  cancelled: "gray",
};
