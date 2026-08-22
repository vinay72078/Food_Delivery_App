import { UtensilsCrossed } from "lucide-react";
import { STATUS_LABELS } from "../constants/orderStatus";
import "./Receipt.css";

function Receipt({ order }) {
  if (!order) return null;

  const delivery = order.deliveryDetails || {};
  const user = order.userId || {};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const customerName = delivery.name || user.username || "—";
  const customerPhone = delivery.phone || "—";
  const customerEmail = user.email || "—";

  const addressParts = [
    delivery.address,
    delivery.city,
    delivery.pincode
  ].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : "—";

  return (
    <div className="receipt">
      <div className="receipt-header">
        <div className="receipt-logo">
          <UtensilsCrossed size={22} strokeWidth={1.8} />
          <span>Foodie</span>
        </div>
        <div className="receipt-title">Order Receipt</div>
        <div className="receipt-order-id">#{order.orderId}</div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">Order details</div>
        <div className="receipt-row">
          <span>Order ID</span>
          <strong>{order.orderId}</strong>
        </div>
        <div className="receipt-row">
          <span>Date</span>
          <strong>{formatDate(order.createdAt)}</strong>
        </div>
        <div className="receipt-row">
          <span>Status</span>
          <strong>{STATUS_LABELS[order.status] || order.status}</strong>
        </div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">Customer details</div>
        <div className="receipt-row">
          <span>Name</span>
          <strong>{customerName}</strong>
        </div>
        <div className="receipt-row">
          <span>Phone</span>
          <strong>{customerPhone}</strong>
        </div>
        <div className="receipt-row">
          <span>Email</span>
          <strong>{customerEmail}</strong>
        </div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">Delivery address</div>
        <div className="receipt-address">
          {fullAddress}
        </div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">Items</div>
        <div className="receipt-items">
          {(order.items || []).map((item, index) => (
            <div className="receipt-item" key={index}>
              <div className="receipt-item-info">
                <span className="receipt-item-qty">{item.quantity}×</span>
                <span>{item.name}</span>
              </div>
              <span>₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="receipt-total">
        <span>Total</span>
        <strong>₹{Number(order.total || 0).toFixed(0)}</strong>
      </div>

      <div className="receipt-footer">
        Thank you for ordering with Foodie!
      </div>
    </div>
  );
}

export default Receipt;