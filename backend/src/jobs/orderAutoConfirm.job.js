import { autoConfirmPendingOrders } from "../services/order.service.js";

let missingTableWarned = false;

export const startOrderAutoConfirmJob = () => {
  const run = async () => {
    try {
      const count = await autoConfirmPendingOrders();
      if (count > 0) {
        console.log(`[orders] Auto-confirmed ${count} order(s)`);
      }
    } catch (err) {
      if (err.code === "ER_NO_SUCH_TABLE") {
        if (!missingTableWarned) {
          missingTableWarned = true;
          console.warn("[orders] Bang orders chua ton tai. Chay: npm run db:migrate (trong thu muc backend)");
        }
        return;
      }
      console.error("[orders] Auto-confirm job error:", err.message);
    }
  };

  run();
  const intervalMs = 60 * 1000;
  return setInterval(run, intervalMs);
};
