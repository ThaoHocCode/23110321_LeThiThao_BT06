export const ORDER_STATUS = {
  NEW: "new",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  CANCEL_REQUEST: "cancel_request",
};

export const ORDER_STATUS_LABELS = {
  new: "Don hang moi",
  confirmed: "Da xac nhan",
  preparing: "Shop dang chuan bi hang",
  shipping: "Dang giao hang",
  delivered: "Da giao thanh cong",
  cancelled: "Da huy don hang",
  cancel_request: "Yeu cau huy don (cho shop xu ly)",
};

export const ORDER_STATUS_STEPS = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.DELIVERED,
];

export const PAYMENT_METHODS = {
  COD: "COD",
  MOMO: "MOMO",
  ZALOPAY: "ZALOPAY",
  VNPAY: "VNPAY",
};

export const PAYMENT_METHOD_LABELS = {
  COD: "Thanh toan khi nhan hang (COD)",
  MOMO: "Vi MoMo",
  ZALOPAY: "Vi ZaloPay",
  VNPAY: "VNPay",
};

export const AUTO_CONFIRM_MINUTES = 30;
export const CANCEL_WINDOW_MINUTES = 30;
export const DEFAULT_SHIPPING_FEE = 30000;
