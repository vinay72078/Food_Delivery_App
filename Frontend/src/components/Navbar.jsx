import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Search, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const cartCount = getCartCount();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleSearchClick = () => {
    const focusSearch = () => {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        document.getElementById("food-search-input")?.focus();
      }, 300);
    };

    if (location.pathname === "/") {
      focusSearch();
    } else {
      navigate("/");
      setTimeout(focusSearch, 100);
    }
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-mark">F</span>
          <span>Foodie</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <a href="/#menu" className="navbar-link" onClick={handleMenuClick}>
            Menu
          </a>
          <a href="/#about" className="navbar-link" onClick={handleAboutClick}>
            About
          </a>
          <Link to="/orders" className="navbar-link">
            Orders
          </Link>
        </nav>

        <div className="navbar-actions">
          <button
            className="navbar-icon-button"
            type="button"
            aria-label="Search"
            onClick={handleSearchClick}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>

          <Link to="/cart" className="navbar-icon-button navbar-cart" aria-label="Shopping cart">
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="navbar-user-menu">
              <span className="navbar-username">{user.username || "Account"}</span>
              <button
                type="button"
                className="navbar-logout-button"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={16} strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar-user-button">
              <UserRound size={18} strokeWidth={1.8} />
              <span>Account</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;