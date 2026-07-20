import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, MessageCircle, ShoppingCart, Store, ImageOff } from "lucide-react";

import Button from "../components/ui/buttons/Button";
import { productService } from "../services/productService";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    productService
      .getBySlug(slug)
      .then((data) => setProduct(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Guests get redirected to login for these actions, per the PRD.
  // Buyers/sellers proceed to the relevant (not-yet-built) feature page.
  const handleRestrictedAction = (path) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  if (loading) {
    return <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 text-center text-sm text-[var(--color-text-secondary)]">Loading...</div>;
  }

  if (notFound || !product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-[var(--color-text-secondary)]">This product doesn't exist or is no longer available.</p>
        <Link to="/products" className="text-[var(--color-primary)] font-medium mt-3 inline-block">
          Browse other products
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const outOfStock = product.stock === 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-[var(--radius-card)] overflow-hidden border border-[var(--color-border)]">
            {images.length > 0 ? (
              <img src={images[activeImage].image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="h-10 w-10 text-[var(--color-text-secondary)]" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 rounded-[var(--radius-image)] overflow-hidden border-2 ${
                    activeImage === i ? "border-[var(--color-primary)]" : "border-transparent"
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm text-[var(--color-text-secondary)]">{product.category_name}</span>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mt-1">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-[var(--color-primary)] mt-3">Rs. {product.price}</p>

          <p className={`text-sm mt-2 ${outOfStock ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"}`}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>

          {product.description && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-4 leading-relaxed">
              {product.description}
            </p>
          )}

          <Link
            to={`/sellers/${product.seller.username}`}
            className="flex items-center gap-2 mt-5 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
          >
            <Store className="h-4 w-4" /> Sold by <span className="font-medium">{product.seller.username}</span>
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              disabled={outOfStock}
              onClick={() => handleRestrictedAction("/cart")}
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleRestrictedAction("/wishlist")}
              className="flex-1"
            >
              <Heart className="h-4 w-4" /> Wishlist
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleRestrictedAction("/messages")}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4" /> Message Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
