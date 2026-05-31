import { ORDER_STATUS_STEPS } from "../../utils/orderUtils";

const TERMINAL_STATUSES = ["cancelled", "cancel_request"];

const OrderStatusTracker = ({ status }) => {
  const isTerminal = TERMINAL_STATUSES.includes(status);
  const currentIndex = ORDER_STATUS_STEPS.findIndex((s) => s.key === status);

  if (isTerminal) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Trang thai: <b>{status === "cancelled" ? "Da huy don hang" : "Yeu cau huy don (cho shop xu ly)"}</b>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const done = currentIndex >= index;
        const active = currentIndex === index;
        return (
          <li key={step.key} className="flex flex-1 items-start gap-2 sm:flex-col sm:items-center sm:text-center">
            <div className="flex items-center gap-2 sm:flex-col">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-brand text-white" : "bg-slate-200 text-slate-500"
                } ${active ? "ring-2 ring-brand ring-offset-2" : ""}`}
              >
                {index + 1}
              </span>
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <span className={`hidden h-0.5 flex-1 sm:block ${done && index < currentIndex ? "bg-brand" : "bg-slate-200"}`} />
              )}
            </div>
            <p className={`text-xs sm:mt-2 ${done ? "font-semibold text-brand" : "text-slate-500"}`}>
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStatusTracker;
