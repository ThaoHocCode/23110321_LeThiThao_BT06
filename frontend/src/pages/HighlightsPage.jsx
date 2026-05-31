import { useEffect, useState } from "react";
import api from "../api/client";
import Header from "../components/layout/Header";
import HorizontalProductCarousel from "../components/product/HorizontalProductCarousel";

const HighlightsPage = () => {
  const [data, setData] = useState({ bestSellers: [], mostViewed: [] });

  useEffect(() => {
    api.get("/products/highlights").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <Header />
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-bold">San pham noi bat</h1>
        <HorizontalProductCarousel title="Top 10 ban chay nhat" products={data.bestSellers} />
        <HorizontalProductCarousel title="Top 10 xem nhieu nhat" products={data.mostViewed} />
      </section>
    </div>
  );
};

export default HighlightsPage;
