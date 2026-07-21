import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash2, ImageOff } from "lucide-react";

import Button from "../components/ui/buttons/Button";
import QuantitySelector from "../components/ui/forms/QuantitySelector";
import { fetchCart, updateCartItemQuantity, removeCartItem } from "../features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, status, error } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (status === "loading" && items.length === 0) {
    return <div className="max-w-[1000px] mx-auto px-4 py-16 text-center text-sm text-[var(--color-text-secondary)]">Loading your cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-10 w-10 text-[var(--color-text-secondary)] mx-auto" />
        <p className="text-[var(--color-text-primary)] font-medium mt-4">Your cart is empty</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Browse products and add something you like.
        </p>
        <Link to="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-6">
        Your Cart
      </h1>

      {error && (
        <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-[var(--radius-input)] px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-4"
            >
              <Link to={`/products/${item.product.slug}`} className="shrink-0">
                {item.product.primary_image ? (
                  <img
                    src={item.product.primary_image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-[var(--radius-image)] object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-[var(--radius-image)] bg-gray-100 flex items-center justify-center">
                    <ImageOff className="h-5 w-5 text-[var(--color-text-secondary)]" />
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product.slug}`}
                  className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] truncate block"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-[var(--color-text-secondary)]">Rs. {item.product.price} each</p>
                {!item.product.is_active && (
                  <p className="text-xs text-[var(--color-danger)] mt-1">
                    This product is no longer available.
                  </p>
                )}
              </div>

              <QuantitySelector
                quantity={item.quantity}
                max={item.product.stock}
                onChange={(qty) => dispatch(updateCartItemQuantity({ itemId: item.id, quantity: qty }))}
              />

              <p className="w-20 text-right font-semibold text-[var(--color-text-primary)]">
                Rs. {item.subtotal}
              </p>

              <button
                onClick={() => dispatch(removeCartItem(item.id))}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-red-50 rounded-[var(--radius-button)]"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-6 h-fit">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-2">
            <span>Subtotal</span>
            <span>Rs. {total}</span>
          </div>
          <div className="border-t border-[var(--color-border)] my-3" />
          <div className="flex justify-between font-semibold text-[var(--color-text-primary)] mb-6">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
          <Button className="w-full" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
