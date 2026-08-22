import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, Printer, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Receipt from "../components/Receipt";
import { getUserOrders } from "../api/api";
import { STATUS_LABELS } from "../constants/orderStatus";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      setError("Please log in to view your orders.");
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await getUserOrders(user.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-main">
        <div className="orders-container">
          <div className="orders-header">
            <h1>My orders</h1>
            <span>{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
          </div>

          {loading && <div className="orders-message">Loading your orders...</div>}

          {!loading && error && <div className="orders-message orders-error">{error}</div>}

          {!loading && !error && orders.length === 0 && (
            <div className="orders-empty">
              <Package size={48} strokeWidth={1.5} />
              <h2>No orders yet</h2>
              <p>When you place an order, it will show up here.</p>
              <Link to="/" className="orders-empty-button">Browse menu</Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order._id}>
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">{order.orderId}</span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <span className={`order-status status-${order.status}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div className="order-item" key={index}>
                        <span className="order-item-qty">{item.quantity}×</span>
                        <span>{item.name}</span>
                        <span className="order-item-price">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-total">
                      Total: <strong>₹{Number(order.total || 0).toFixed(0)}</strong>
                    </span>
                    <span className="order-tracking">
                      <Clock size={14} strokeWidth={1.8} />
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="order-receipt-button"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Printer size={14} strokeWidth={1.8} />
                    View Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="receipt-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header">
              <h2>Order Receipt</h2>
              <div className="receipt-modal-actions">
                <button
                  type="button"
                  className="receipt-modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
            <Receipt order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;