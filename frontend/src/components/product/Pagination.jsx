const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 py-4 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-brand hover:text-white hover:border-brand disabled:pointer-events-none disabled:opacity-40"
        aria-label="Trang trước"
      >
        ‹
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-slate-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition ${
              p === page
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:bg-brand hover:text-white hover:border-brand"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-brand hover:text-white hover:border-brand disabled:pointer-events-none disabled:opacity-40"
        aria-label="Trang sau"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
