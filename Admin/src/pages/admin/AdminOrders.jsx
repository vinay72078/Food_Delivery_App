import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, X } from "lucide-react";
import { getOrders, updateOrderStatus } from "../../api/api";
import Receipt from "../../components/Receipt";
import AdminLayout from "../../components/AdminLayout";
import { ORDER_STATUSES, STATUS_LABELS } from "../../constants/orderStatus";
import "./AdminDashboard.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin/login");
      return;
    }
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError("Failed to update order status.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <AdminLayout activePage="orders">
      <header className="admin-header">
        <h1>Orders</h1>
      </header>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-loading">No orders yet.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.orderId}</strong>
                    <br />
                    <span className="admin-cell-sub">{formatDate(order.createdAt)}</span>
                  </td>
                  <td>
                    {order.userId?.username || "Unknown"}
                    <br />
                    <span className="admin-cell-sub">{order.userId?.email || ""}</span>
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index} className="admin-cell-item">
                        {item.quantity}× {item.name}
                      </div>
                    ))}
                  </td>
                  <td>₹{Number(order.total || 0).toFixed(0)}</td>
                  <td>
                    <select
                      className={`admin-status-select status-${order.status}`}
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.orderId, event.target.value)
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-receipt-button"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Printer size={14} strokeWidth={1.8} />
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
    </AdminLayout>
  );
}

export default AdminOrders;