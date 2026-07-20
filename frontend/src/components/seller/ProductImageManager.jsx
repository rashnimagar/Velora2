import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { productService } from "../../services/productService";

const MAX_IMAGES = 6;

export default function ProductImageManager({ productId, images, onImagesChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleFilesSelected = async (fileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setError(`A product can have at most ${MAX_IMAGES} images (${images.length} already uploaded).`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const data = await productService.uploadImages(productId, files);
      onImagesChange([...images, ...data.images]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong uploading images.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId) => {
    setDeletingId(imageId);
    try {
      await productService.deleteImage(productId, imageId);
      onImagesChange(images.filter((img) => img.id !== imageId));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">
        Product Images
        <span className="text-[var(--color-text-secondary)] font-normal"> (up to {MAX_IMAGES})</span>
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-[var(--radius-image)] overflow-hidden border border-[var(--color-border)] group">
            <img src={img.image} alt="" className="w-full h-full object-cover" />
            {img.is_primary && (
              <span className="absolute top-1 left-1 bg-[var(--color-primary)] text-white rounded-full p-1">
                <Star className="h-3 w-3 fill-current" />
              </span>
            )}
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              disabled={deletingId === img.id}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
              aria-label="Delete image"
            >
              <Trash2 className="h-5 w-5 text-white" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-[var(--radius-image)] border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)]/50 flex flex-col items-center justify-center gap-1 text-[var(--color-text-secondary)] transition"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">{uploading ? "Uploading..." : "Add"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
