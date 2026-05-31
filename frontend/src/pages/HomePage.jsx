import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import Header from "../components/layout/Header";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/product/FilterSidebar";
import HorizontalProductCarousel from "../components/product/HorizontalProductCarousel";
import ProductSkeleton from "../components/product/ProductSkeleton";
import Pagination from "../components/product/Pagination";

const PRODUCTS_PER_PAGE = 9;

const defaultFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  inStock: false,
  promotion: false,
  sort: "newest",
};

const HomePage = () => {
  const [home, setHome] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v === "" || v === false) return;
      q.append(k, v);
    });
    return q.toString();
  }, [filters]);

  useEffect(() => {
    Promise.all([api.get("/products/home"), api.get("/categories")]).then(([homeRes, catRes]) => {
      setHome(homeRes.data);
      setCategories(catRes.data);
    });
  }, []);

  const applyFilters = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    const pageQuery = `${query}${query ? "&" : ""}page=${page}&limit=${PRODUCTS_PER_PAGE}`;
    const { data } = await api.get(`/products/search?${pageQuery}`);
    setProducts(data.data);
    setTotalPages(Math.ceil(data.total / PRODUCTS_PER_PAGE) || 1);
    setLoading(false);
  };

  useEffect(() => {
    applyFilters(1);
  }, []);

  if (!home) return <div className="p-6">Dang tai...</div>;

  return (
    <div>
      <Header />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          categories={categories}
          filters={filters}
          onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
          onApply={() => applyFilters(1)}
        />
        <section className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-brand to-teal-400 p-6 text-white">
            <p className="text-sm opacity-90">Xin chao, {home.user?.fullName || home.user?.username}!</p>
            <h2 className="text-2xl font-bold">{home.promotionBanner.title}</h2>
            <p>{home.promotionBanner.description}</p>
          </div>

          <HorizontalProductCarousel title="Ban chay nhat" products={home.bestSellers} />

          <section>
            <h3 className="mb-3 text-xl font-bold">San pham moi nhat</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {home.newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold">Tim kiem &amp; loc san pham</h3>
              <button onClick={() => applyFilters(1)} className="rounded-lg bg-brand px-4 py-2 text-sm text-white">
                Ap dung bo loc
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => <ProductSkeleton key={i} />)
                : products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {!loading && products.length === 0 && (
              <p className="text-center text-slate-500">Khong tim thay san pham phu hop</p>
            )}
            {/* Phan trang doc */}
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(p) => applyFilters(p)}
            />
          </section>

          <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <h3 className="mb-3 text-xl font-bold">Tin khuyen mai</h3>
            <ul className="space-y-2 text-slate-700">
              {home.news.map((n) => (
                <li key={n.id}>- {n.title}</li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
