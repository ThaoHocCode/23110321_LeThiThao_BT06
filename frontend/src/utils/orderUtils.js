export const ORDER_STATUS_LABELS = {
  new: "Don hang moi",
  confirmed: "Da xac nhan",
  preparing: "Shop dang chuan bi hang",
  shipping: "Dang giao hang",
  delivered: "Da giao thanh cong",
  cancelled: "Da huy don hang",
  cancel_request: "Yeu cau huy don",
};

export const ORDER_STATUS_STEPS = [
  { key: "new", label: "Don moi" },
  { key: "confirmed", label: "Xac nhan" },
  { key: "preparing", label: "Chuan bi" },
  { key: "shipping", label: "Giao hang" },
  { key: "delivered", label: "Hoan tat" },
];

export const PAYMENT_METHOD_LABELS = {
  COD: "Thanh toan khi nhan hang (COD)",
  MOMO: "Vi MoMo",
  ZALOPAY: "Vi ZaloPay",
  VNPAY: "VNPay",
};

export const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " VND";

export const getFirstImage = (imagesValue) => {
  if (Array.isArray(imagesValue)) return imagesValue[0] || "";
  if (typeof imagesValue === "string") {
    const trimmed = imagesValue.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http")) return trimmed;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed[0] || "";
    } catch {
      return "";
    }
  }
  return "";
};
