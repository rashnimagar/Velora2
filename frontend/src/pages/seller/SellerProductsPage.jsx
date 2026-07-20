import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ImageOff, Search } from "lucide-react";

import Button from "../../components/ui/buttons/Button";
import TextInput from "../../components/ui/forms/TextInput";
import ToggleSwitch from "../../components/ui/forms/ToggleSwitch";
import Modal from "../../components/ui/modals/Modal";
import { productService } from "../../services/productService";

export default function SellerProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const load = async (searchTerm) => {
    setLoading(true);
    try {
      const data = await productService.list(searchTerm);
      setProducts(data.results || data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleToggleActive = async (product) => {
    setTogglingId(product.id);
    try {
      await productService.update(product.id, { is_active: !product.is_active });
      await load(search);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load(search);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-1">
              Products
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Manage your product listings.
            </p>
          </div>
          <Button onClick={() => navigate("/seller/products/new")}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        <div className="mb-4 max-w-xs">
          <TextInput
            icon={Search}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
              No products yet. Click "Add Product" to create your first listing.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Active</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const primaryImage = p.images?.find((img) => img.is_primary) || p.images?.[0];
                  return (
                    <tr key={p.id} className="border-t border-[var(--color-border)] hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {primaryImage ? (
                            <img
                              src={primaryImage.image}
                              alt={p.name}
                              className="h-9 w-9 rounded-[var(--radius-image)] object-cover"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-[var(--radius-image)] bg-gray-100 flex items-center justify-center">
                              <ImageOff className="h-4 w-4 text-[var(--color-text-secondary)]" />
                            </div>
                          )}
                          <span className="font-medium text-[var(--color-text-primary)]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[var(--color-text-secondary)]">
                        {p.category_name || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className={p.stock === 0 ? "text-[var(--color-danger)]" : ""}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">Rs. {p.price}</td>
                      <td className="px-5 py-3">
                        <ToggleSwitch
                          checked={p.is_active}
                          onChange={() => handleToggleActive(p)}
                          disabled={togglingId === p.id}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                            className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-primary)]"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-[var(--color-danger)]"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product">
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
