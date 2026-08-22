import { useNavigate } from "react-router-dom";
import { LogOut, UtensilsCrossed } from "lucide-react";
import "../pages/admin/AdminDashboard.css";

function AdminLayout({ activePage, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <UtensilsCrossed size={24} strokeWidth={1.8} />
          <span>Foodie Admin</span>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-link ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("/admin/dashboard")}
          >
            Food Items
          </button>
          <button
            type="button"
            className={`admin-nav-link ${activePage === "orders" ? "active" : ""}`}
            onClick={() => navigate("/admin/orders")}
          >
            Orders
          </button>
        </nav>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.8} />
          Logout
        </button>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}

export default AdminLayout;