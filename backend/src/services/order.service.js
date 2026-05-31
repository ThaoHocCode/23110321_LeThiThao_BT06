import { pool } from "../config/db.js";
import {
  AUTO_CONFIRM_MINUTES,
  CANCEL_WINDOW_MINUTES,
  DEFAULT_SHIPPING_FEE,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "../constants/order.constants.js";
import { clearCart, getCartByUserId } from "./cart.service.js";
import { normalizeProductRow } from "./product.service.js";

const generateOrderCode = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD${datePart}${randomPart}`;
};

const logStatusChange = async (connection, orderId, status, note = null) => {
  await connection.query(
    "INSERT INTO order_status_logs (order_id, status, note) VALUES (?, ?, ?)",
    [orderId, status, note]
  );
};

const enrichOrder = (order, items = [], statusLogs = []) => ({
  ...order,
  subtotal: Number(order.subtotal),
  shipping_fee: Number(order.shipping_fee),
  total: Number(order.total),
  statusLabel: ORDER_STATUS_LABELS[order.status] || order.status,
  canCancel: canUserCancel(order),
  cancelAction: getCancelAction(order),
  items,
  statusLogs,
});

export const canUserCancel = (order) => {
  if ([ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCEL_REQUEST].includes(order.status)) {
    return false;
  }
  if (order.status === ORDER_STATUS.PREPARING) return true;
  if ([ORDER_STATUS.NEW, ORDER_STATUS.CONFIRMED].includes(order.status)) {
    const createdAt = new Date(order.created_at);
    const diffMs = Date.now() - createdAt.getTime();
    return diffMs <= CANCEL_WINDOW_MINUTES * 60 * 1000;
  }
  return false;
};

export const getCancelAction = (order) => {
  if (!canUserCancel(order)) return null;
  if (order.status === ORDER_STATUS.PREPARING) return "request";
  return "direct";
};

export const autoConfirmPendingOrders = async () => {
  const [rows] = await pool.query(
    `
    SELECT id FROM orders
    WHERE status = ?
      AND created_at <= DATE_SUB(NOW(), INTERVAL ? MINUTE)
    `,
    [ORDER_STATUS.NEW, AUTO_CONFIRM_MINUTES]
  );

  for (const row of rows) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        "UPDATE orders SET status = ?, confirmed_at = NOW() WHERE id = ? AND status = ?",
        [ORDER_STATUS.CONFIRMED, row.id, ORDER_STATUS.NEW]
      );
      await logStatusChange(
        connection,
        row.id,
        ORDER_STATUS.CONFIRMED,
        "Tu dong xac nhan sau 30 phut"
      );
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.error("Auto confirm failed for order", row.id, err);
    } finally {
      connection.release();
    }
  }

  return rows.length;
};

export const createOrderFromCart = async (userId, payload) => {
  const {
    shippingName,
    shippingPhone,
    shippingAddress,
    note,
    paymentMethod = PAYMENT_METHODS.COD,
  } = payload;

  if (!shippingName || !shippingPhone || !shippingAddress) {
    const err = new Error("Shipping information is required");
    err.status = 400;
    throw err;
  }

  if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
    const err = new Error("Invalid payment method");
    err.status = 400;
    throw err;
  }

  const cart = await getCartByUserId(userId);
  if (!cart.items.length) {
    const err = new Error("Cart is empty");
    err.status = 400;
    throw err;
  }

  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      const err = new Error(`"${item.product.name}" only has ${item.product.stock} in stock`);
      err.status = 400;
      throw err;
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const orderCode = generateOrderCode();
    const subtotal = cart.subtotal;
    const shippingFee = subtotal >= 2000000 ? 0 : DEFAULT_SHIPPING_FEE;
    const total = subtotal + shippingFee;
    const paymentStatus = paymentMethod === PAYMENT_METHODS.COD ? "pending" : "pending";

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
        (user_id, order_code, status, payment_method, payment_status,
         subtotal, shipping_fee, total, shipping_name, shipping_phone, shipping_address, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        orderCode,
        ORDER_STATUS.NEW,
        paymentMethod,
        paymentStatus,
        subtotal,
        shippingFee,
        total,
        shippingName,
        shippingPhone,
        shippingAddress,
        note || null,
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of cart.items) {
      const image = Array.isArray(item.product.images) ? item.product.images[0] : null;
      await connection.query(
        `
        INSERT INTO order_items
          (order_id, product_id, product_name, product_price, product_image, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.product.id,
          item.product.name,
          item.product.price,
          image,
          item.quantity,
        ]
      );

      await connection.query(
        "UPDATE products SET stock = stock - ?, sales_count = sales_count + ? WHERE id = ? AND stock >= ?",
        [item.quantity, item.quantity, item.product.id, item.quantity]
      );

      const [stockCheck] = await connection.query(
        "SELECT stock FROM products WHERE id = ?",
        [item.product.id]
      );
      if (stockCheck[0].stock < 0) {
        throw new Error(`Insufficient stock for "${item.product.name}"`);
      }
    }

    await logStatusChange(connection, orderId, ORDER_STATUS.NEW, "Don hang moi duoc tao");
    await clearCart(userId, connection);
    await connection.commit();

    const order = await getOrderById(orderId, userId);
    const paymentInfo =
      paymentMethod !== PAYMENT_METHODS.COD
        ? {
            redirectUrl: `https://sandbox-payment.example.com/pay?order=${orderCode}&method=${paymentMethod}`,
            message: "Chuyen huong den cong thanh toan vi dien tu (mock)",
          }
        : null;

    return { order, paymentInfo };
  } catch (error) {
    await connection.rollback();
    if (!error.status) error.status = 400;
    throw error;
  } finally {
    connection.release();
  }
};

const fetchOrderItems = async (orderId) => {
  const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [orderId]);
  return items.map((item) => ({
    ...item,
    product_price: Number(item.product_price),
    lineTotal: Number(item.product_price) * item.quantity,
  }));
};

const fetchStatusLogs = async (orderId) => {
  const [logs] = await pool.query(
    "SELECT * FROM order_status_logs WHERE order_id = ? ORDER BY created_at ASC",
    [orderId]
  );
  return logs;
};

export const getOrderById = async (orderId, userId = null) => {
  const params = [orderId];
  let userFilter = "";
  if (userId) {
    userFilter = "AND user_id = ?";
    params.push(userId);
  }

  const [rows] = await pool.query(
    `SELECT * FROM orders WHERE id = ? ${userFilter} LIMIT 1`,
    params
  );
  if (!rows[0]) return null;

  const items = await fetchOrderItems(orderId);
  const statusLogs = await fetchStatusLogs(orderId);
  return enrichOrder(rows[0], items, statusLogs);
};

export const getOrdersByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
  const offset = (Number(page) - 1) * Number(limit);

  const [rows] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [userId, Number(limit), offset]
  );

  const [countRows] = await pool.query(
    "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",
    [userId]
  );

  const orders = await Promise.all(
    rows.map(async (order) => {
      const items = await fetchOrderItems(order.id);
      return enrichOrder(order, items);
    })
  );

  return {
    data: orders,
    total: countRows[0].total,
    page: Number(page),
    limit: Number(limit),
    hasMore: offset + rows.length < countRows[0].total,
  };
};

export const cancelOrderByUser = async (userId, orderId) => {
  const order = await getOrderById(orderId, userId);
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  if (!canUserCancel(order)) {
    const err = new Error("Cannot cancel this order");
    err.status = 400;
    throw err;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (order.status === ORDER_STATUS.PREPARING) {
      await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
        ORDER_STATUS.CANCEL_REQUEST,
        orderId,
      ]);
      await logStatusChange(
        connection,
        orderId,
        ORDER_STATUS.CANCEL_REQUEST,
        "Khach hang gui yeu cau huy don"
      );
    } else {
      await connection.query("UPDATE orders SET status = ? WHERE id = ?", [
        ORDER_STATUS.CANCELLED,
        orderId,
      ]);
      await logStatusChange(connection, orderId, ORDER_STATUS.CANCELLED, "Khach hang huy don");

      for (const item of order.items) {
        await connection.query(
          "UPDATE products SET stock = stock + ?, sales_count = GREATEST(sales_count - ?, 0) WHERE id = ?",
          [item.quantity, item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();
    return getOrderById(orderId, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateOrderStatusByAdmin = async (orderId, newStatus, note = null) => {
  const allowedStatuses = [...ORDER_STATUS_STEPS, ORDER_STATUS.CANCELLED];
  if (!allowedStatuses.includes(newStatus)) {
    const err = new Error("Invalid order status");
    err.status = 400;
    throw err;
  }

  const order = await getOrderById(orderId);
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const updates = { status: newStatus };
    if (newStatus === ORDER_STATUS.CONFIRMED) {
      updates.confirmed_at = new Date();
    }

    await connection.query("UPDATE orders SET status = ?, confirmed_at = COALESCE(confirmed_at, ?) WHERE id = ?", [
      newStatus,
      newStatus === ORDER_STATUS.CONFIRMED ? new Date() : order.confirmed_at,
      orderId,
    ]);

    await logStatusChange(connection, orderId, newStatus, note || `Cap nhat trang thai: ${ORDER_STATUS_LABELS[newStatus]}`);

    if (
      (newStatus === ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.CANCELLED) ||
      (order.status === ORDER_STATUS.CANCEL_REQUEST && newStatus === ORDER_STATUS.CANCELLED)
    ) {
      for (const item of order.items) {
        await connection.query(
          "UPDATE products SET stock = stock + ?, sales_count = GREATEST(sales_count - ?, 0) WHERE id = ?",
          [item.quantity, item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();
    return getOrderById(orderId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getPaymentMethods = () => {
  const ids = ["COD", "MOMO", "ZALOPAY", "VNPAY"];
  return ids.map((id) => ({
    id,
    label: PAYMENT_METHOD_LABELS[id],
    required: id === "COD",
    description:
      id === "COD"
        ? "Thanh toan tien mat khi nhan hang"
        : `Thanh toan qua vi dien tu ${id} (tich hop sandbox)`,
  }));
};

export { ORDER_STATUS_STEPS };
