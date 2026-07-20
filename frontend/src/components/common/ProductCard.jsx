import { Link } from "react-router-dom";
import { ImageOff, Store } from "lucide-react";

export default function ProductCard({ product }) {
  const outOfStock = product.stock === 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
    >
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-8 w-8 text-[var(--color-text-secondary)]" />
          </div>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs rounded-full px-2.5 py-1">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-1">
        <span className="text-xs text-[var(--color-text-secondary)]">{product.category_name}</span>
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="font-semibold text-[var(--color-primary)]">Rs. {product.price}</span>
          <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
            <Store className="h-3 w-3" /> {product.seller_username}
          </span>
        </div>
      </div>
    </Link>
  );
}
