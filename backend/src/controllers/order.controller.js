import * as orderService from "../services/order.service.js";
import { getPaymentMethods as getPaymentMethodsList } from "../services/order.service.js";
import { PAYMENT_METHOD_LABELS } from "../constants/order.constants.js";

export const getPaymentMethods = async (_req, res) => {
  const methods = getPaymentMethodsList().map((m) => ({
    ...m,
    label: PAYMENT_METHOD_LABELS[m.id] || m.label,
  }));
  res.json({ methods, codRequired: true });
};

export const checkout = async (req, res, next) => {
  try {
    const result = await orderService.createOrderFromCart(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderService.getOrdersByUserId(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyOrderDetail = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(Number(req.params.id), req.user.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrderByUser(req.user.id, Number(req.params.id));
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ message: "status is required" });

    const order = await orderService.updateOrderStatusByAdmin(Number(req.params.id), status, note);
    res.json(order);
  } catch (error) {
    next(error);
  }
};
