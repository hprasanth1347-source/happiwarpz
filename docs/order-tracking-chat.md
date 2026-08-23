# Order Tracking & Customer-Admin Chat System

Happiwrapz includes a visual order delivery tracking timeline and an interactive Customer-Admin order chat system.

## 1. Visual Tracking Progress Timeline
- Located at `/account/orders/[id]`
- Steps: `Order Placed` -> `Payment Confirmed` -> `Crafting Bouquet` -> `Out for Delivery` -> `Delivered`.
- Displays real-time updates, courier carrier name, and tracking code.

## 2. Customer-Admin Order Chat
- Data Model: `OrderMessage` in MongoDB.
- Endpoints:
  - `GET /api/orders/:id/messages` - Retrieve message history
  - `POST /api/orders/:id/messages` - Send new message
- Customers can send special requests or ask questions.
- Admins can reply directly from `/admin/orders` drawer.
