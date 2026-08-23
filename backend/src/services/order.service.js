import { prisma } from "../config/database.js";
import { sendOrderConfirmationEmail } from "./email.service.js";

/**
 * Generate unique order number (e.g. HW-2026-98124).
 */
export const generateOrderNumber = () => {
  const randomStr = Math.floor(10000 + Math.random() * 90000);
  return `HW-${new Date().getFullYear()}-${randomStr}`;
};

/**
 * Create new Order from customer cart items.
 */
export const createOrder = async (userId, { shippingAddress, cartItems }) => {
  if (!cartItems || cartItems.length === 0) {
    throw { statusCode: 400, message: "Cannot place order with empty cart.", code: "EMPTY_CART" };
  }

  let subtotal = 0;
  const orderItemsData = [];

  for (const item of cartItems) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.isActive) {
      throw { statusCode: 400, message: `Product ${item.productName || "item"} is no longer available.` };
    }

    const itemPrice = product.salePrice || product.price;
    subtotal += itemPrice * item.quantity;

    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: itemPrice,
      variant: item.variant || "Standard",
      customMessage: item.customMessage || null,
      specialInstructions: item.specialInstructions || null,
    });
  }

  const deliveryCharge = subtotal > 1500 ? 0 : 99; // Free delivery above ₹1500
  const total = subtotal + deliveryCharge;
  const orderNumber = generateOrderNumber();

  // Create Order in MongoDB
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      subtotal,
      deliveryCharge,
      total,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      shippingAddress,
      items: {
        create: orderItemsData,
      },
      statusHistory: {
        create: {
          status: "PENDING",
          note: "Order placed by customer.",
          updatedBy: "SYSTEM",
        },
      },
    },
    include: {
      items: true,
      user: true,
      statusHistory: true,
    },
  });

  // Clear user cart after placing order
  await prisma.cartItem.deleteMany({ where: { userId } });

  // Send confirmation email
  sendOrderConfirmationEmail(order, order.user).catch((err) => console.error("Email Error:", err));

  return order;
};

/**
 * Update Order status with tracking timeline log.
 */
export const updateOrderStatus = async (orderId, { orderStatus, paymentStatus, trackingCarrier, trackingNumber, estimatedDelivery, note, updatedBy }) => {
  const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existingOrder) {
    throw { statusCode: 404, message: "Order not found.", code: "ORDER_NOT_FOUND" };
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(orderStatus && { orderStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(trackingCarrier && { trackingCarrier }),
      ...(trackingNumber && { trackingNumber }),
      ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) }),
    },
    include: {
      items: true,
      statusHistory: true,
      messages: true,
    },
  });

  // Create status timeline record if status changed
  if (orderStatus && orderStatus !== existingOrder.orderStatus) {
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: orderStatus,
        note: note || `Order status updated to ${orderStatus}`,
        updatedBy: updatedBy || "ADMIN",
      },
    });
  }

  return updatedOrder;
};
