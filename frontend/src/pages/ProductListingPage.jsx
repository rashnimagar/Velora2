import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import TextInput from "../components/ui/forms/TextInput";
import Select from "../components/ui/forms/Select";
import ProductCard from "../components/common/ProductCard";
import Button from "../components/ui/buttons/Button";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
];

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoryService.list().then((data) => setCategories(data.results || data));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = { page, ordering };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      productService
        .browse(params)
        .then((data) => {
          setProducts(data.results);
          setCount(data.count);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice, ordering, page]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-6">
        All Products
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1">
          <TextInput
            icon={Search}
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            placeholder="All Categories"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <div className="w-full md:w-40">
          <TextInput
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => {
              setPage(1);
              setMinPrice(e.target.value);
            }}
          />
        </div>
        <div className="w-full md:w-40">
          <TextInput
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => {
              setPage(1);
              setMaxPrice(e.target.value);
            }}
          />
        </div>
        <div className="w-full md:w-52">
          <Select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[var(--radius-card)] bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SlidersHorizontal className="h-8 w-8 text-[var(--color-text-secondary)] mb-3" />
          <p className="text-[var(--color-text-secondary)]">No products match your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="!px-4 !py-1.5"
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--color-text-secondary)]">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="!px-4 !py-1.5"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
