import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import TextInput from "../../components/ui/forms/TextInput";
import Select from "../../components/ui/forms/Select";
import ToggleSwitch from "../../components/ui/forms/ToggleSwitch";
import Button from "../../components/ui/buttons/Button";
import ProductImageManager from "../../components/seller/ProductImageManager";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";

const emptyForm = { name: "", description: "", category: "", price: "", stock: "", is_active: true };

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [productId, setProductId] = useState(id || null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [justCreated, setJustCreated] = useState(false);

  useEffect(() => {
    categoryService.list().then((data) => setCategories(data.results || data));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    productService.get(id).then((data) => {
      setForm({
        name: data.name,
        description: data.description || "",
        category: data.category || "",
        price: data.price,
        stock: data.stock,
        is_active: data.is_active,
      });
      setImages(data.images);
      setLoading(false);
    });
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.category) return setError("Please select a category.");
    if (!form.price || Number(form.price) <= 0) return setError("Enter a valid price greater than 0.");
    if (form.stock === "" || Number(form.stock) < 0) return setError("Enter a valid stock quantity.");

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price,
        stock: form.stock,
        is_active: form.is_active,
      };

      if (productId) {
        await productService.update(productId, payload);
        navigate("/seller/products");
      } else {
        const created = await productService.create(payload);
        setProductId(created.id);
        setJustCreated(true);
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(" ")
          : "Something went wrong saving this product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-sm text-[var(--color-text-secondary)]">Loading...</div>;
  }

  return (
    <div className="px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/seller/products")}
          className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </button>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-6">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={handleSubmit} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md p-6 flex flex-col gap-5">
          <TextInput
            label="Product Name"
            required
            placeholder="e.g. Wireless Mouse"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] p-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none"
              placeholder="Describe your product"
            />
          </div>

          <Select
            label="Category"
            required
            placeholder="Select a category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Price (Rs.)"
              required
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
            <TextInput
              label="Stock"
              required
              type="number"
              min="0"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            />
          </div>

          <ToggleSwitch
            checked={form.is_active}
            onChange={(val) => setForm((f) => ({ ...f, is_active: val }))}
            label="Active (visible to buyers)"
          />

          {productId ? (
            <ProductImageManager productId={productId} images={images} onImagesChange={setImages} />
          ) : (
            <p className="text-xs text-[var(--color-text-secondary)] bg-gray-50 rounded-[var(--radius-input)] px-3 py-2">
              Save the product first, then you'll be able to add images.
            </p>
          )}

          {justCreated && (
            <p className="text-sm text-[var(--color-success)] bg-[var(--color-success)]/10 rounded-[var(--radius-input)] px-3 py-2">
              Product created! Add some images below, then click Done.
            </p>
          )}

          {error && (
            <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-[var(--radius-input)] px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/seller/products")}>
              {justCreated ? "Done" : "Cancel"}
            </Button>
            {!justCreated && (
              <Button type="submit" isLoading={saving}>
                {isEditMode ? "Save Changes" : "Create Product"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
