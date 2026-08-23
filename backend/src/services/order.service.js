import { prisma, isDatabaseConnected } from "../config/database.js";
import { sendOrderConfirmationEmail } from "./email.service.js";

let memoryOrders = [];

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
    let itemPrice = item.price || 299;
    let productName = item.productName || "Handmade Bouquet";
    let productId = item.productId || "prod-1";

    if (isDatabaseConnected) {
      try {
        const isHexId = /^[0-9a-fA-F]{24}$/.test(item.productId);
        const product = isHexId
          ? await prisma.product.findUnique({ where: { id: item.productId } })
          : await prisma.product.findUnique({ where: { slug: item.productId } });
        if (product) {
          itemPrice = product.salePrice || product.price;
          productName = product.name;
          productId = product.id;
        }
      } catch (e) {}
    }

    subtotal += itemPrice * item.quantity;

    orderItemsData.push({
      productId,
      productName,
      quantity: item.quantity,
      price: itemPrice,
      variant: item.variant || "Standard",
      customMessage: item.customMessage || null,
      specialInstructions: item.specialInstructions || null,
    });
  }

  const deliveryCharge = subtotal > 1500 ? 0 : 99;
  const total = subtotal + deliveryCharge;
  const orderNumber = generateOrderNumber();

  if (isDatabaseConnected) {
    try {
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
      await prisma.cartItem.deleteMany({ where: { userId } }).catch(() => {});

      // Send confirmation email
      sendOrderConfirmationEmail(order, order.user).catch((err) => console.error("Email Error:", err));

      return order;
    } catch (dbErr) {}
  }

  // Memory Fallback Order
  const memoryOrder = {
    id: `ord_${Date.now()}`,
    orderNumber,
    userId,
    subtotal,
    deliveryCharge,
    total,
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    shippingAddress,
    items: orderItemsData,
    statusHistory: [
      {
        id: `osh_${Date.now()}`,
        status: "PENDING",
        note: "Order placed by customer.",
        updatedBy: "SYSTEM",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryOrders.unshift(memoryOrder);
  return memoryOrder;
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
