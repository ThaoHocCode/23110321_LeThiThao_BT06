import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";

const HorizontalProductCarousel = ({ title, products = [] }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      {/* Header với nút Prev/Next */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-brand hover:text-white hover:border-brand active:scale-95"
            aria-label="Truot trai"
          >
            ‹
          </button>
          <button
            ref={nextRef}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-brand hover:text-white hover:border-brand active:scale-95"
            aria-label="Truot phai"
          >
            ›
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        style={{ paddingBottom: "2rem" }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HorizontalProductCarousel;
