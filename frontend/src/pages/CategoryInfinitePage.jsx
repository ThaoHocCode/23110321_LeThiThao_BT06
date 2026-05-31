import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import Header from "../components/layout/Header";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const CategoryInfinitePage = () => {
  const [categories, setCategories] = useState([]);
  const [categorySlug, setCategorySlug] = useState("sneaker-cao-cap");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const resetAndLoad = useCallback(async (slug) => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    const { data } = await api.get(`/products/category/${slug}/infinite?page=1&limit=6`);
    setProducts(data.data);
    setHasMore(data.hasMore);
    setPage(2);
    setLoading(false);
  }, []);

  useEffect(() => {
    resetAndLoad(categorySlug);
  }, [categorySlug, resetAndLoad]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { data } = await api.get(
      `/products/category/${categorySlug}/infinite?page=${page}&limit=6`
    );
    setProducts((prev) => [...prev, ...data.data]);
    setHasMore(data.hasMore);
    setPage((p) => p + 1);
    setLoading(false);
  }, [categorySlug, hasMore, loading, page]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div>
      <Header />
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <h2 className="text-xl font-bold">San pham theo danh muc (Lazy loading)</h2>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorySlug(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                categorySlug === cat.slug
                  ? "bg-brand text-white"
                  : "bg-white ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {loading && Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={`sk-${i}`} />)}
        </div>

        {!hasMore && products.length > 0 && (
          <p className="text-center text-sm text-slate-500">Da hien thi tat ca san pham</p>
        )}
        <div ref={sentinelRef} className="h-8" />
      </section>
    </div>
  );
};

export default CategoryInfinitePage;
