import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, ImageOff } from "lucide-react";

import Button from "../../components/ui/buttons/Button";
import TextInput from "../../components/ui/forms/TextInput";
import ToggleSwitch from "../../components/ui/forms/ToggleSwitch";
import FileUpload from "../../components/ui/forms/FileUpload";
import Modal from "../../components/ui/modals/Modal";
import { categoryService } from "../../services/categoryService";

const emptyForm = { name: "", description: "", is_active: true, image: null };

export default function AdminCategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create mode
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async (searchTerm) => {
    setLoading(true);
    try {
      const data = await categoryService.list(searchTerm);
      setCategories(data.results || data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 300); // debounced search
    return () => clearTimeout(timeout);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active,
      image: null,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("is_active", form.is_active);
      if (form.image) formData.append("image", form.image);

      if (editing) {
        await categoryService.update(editing.id, formData);
      } else {
        await categoryService.create(formData);
      }
      setModalOpen(false);
      await load(search);
    } catch (err) {
      setFormError(
        err.response?.data?.errors?.name?.[0] ||
          err.response?.data?.message ||
          "Something went wrong saving this category."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load(search);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-1">
              Category Management
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Create, edit, and manage product categories.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>

        <div className="mb-4 max-w-xs">
          <TextInput
            icon={Search}
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
              No categories found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t border-[var(--color-border)] hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="h-9 w-9 rounded-[var(--radius-image)] object-cover" />
                        ) : (
                          <div className="h-9 w-9 rounded-[var(--radius-image)] bg-gray-100 flex items-center justify-center">
                            <ImageOff className="h-4 w-4 text-[var(--color-text-secondary)]" />
                          </div>
                        )}
                        <span className="font-medium text-[var(--color-text-primary)]">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[var(--color-text-secondary)]">{cat.slug}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          cat.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-primary)]"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-[var(--color-danger)]"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <TextInput
            label="Name"
            required
            placeholder="e.g. Electronics"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] p-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none"
              placeholder="Optional short description"
            />
          </div>
          <FileUpload
            label="Category Image"
            accept="image/*"
            onChange={(file) => setForm((f) => ({ ...f, image: file }))}
          />
          <ToggleSwitch
            checked={form.is_active}
            onChange={(val) => setForm((f) => ({ ...f, is_active: val }))}
            label="Active"
          />
          {formError && (
            <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-[var(--radius-input)] px-3 py-2">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-1">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={saving}>
              {editing ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category">
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
