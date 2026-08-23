import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const cartCount = getCartCount();

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleSearchClick = () => {
    closeMobileMenu();

    const focusSearch = () => {
      document.getElementById("menu")?.scrollIntoView({
        behavior: "smooth",
      });

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
    closeMobileMenu();

    if (location.pathname === "/") {
      document.getElementById("menu")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");

      setTimeout(() => {
        document.getElementById("menu")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    closeMobileMenu();

    if (location.pathname === "/") {
      document.getElementById("about")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");

      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMobileMenu}
        >
          <span className="navbar-logo-mark">F</span>
          <span>Foodie</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          <Link
            to="/"
            className="navbar-link"
          >
            Home
          </Link>

          <a
            href="/#menu"
            className="navbar-link"
            onClick={handleMenuClick}
          >
            Menu
          </a>

          <a
            href="/#about"
            className="navbar-link"
            onClick={handleAboutClick}
          >
            About
          </a>

          <Link
            to="/orders"
            className="navbar-link"
          >
            Orders
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">

          {/* Search */}
          <button
            className="navbar-icon-button"
            type="button"
            aria-label="Search"
            onClick={handleSearchClick}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="navbar-icon-button navbar-cart"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />

            {cartCount > 0 && (
              <span className="navbar-cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="navbar-user-menu">
              <span className="navbar-username">
                {user.username || "Account"}
              </span>

              <button
                type="button"
                className="navbar-logout-button"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar-user-button"
            >
              <UserRound size={18} />
              <span>Account</span>
            </Link>
          )}

        </div>

        {/* =================================
            MOBILE ACTIONS
        ================================= */}

        <div className="mobile-top-actions">

          {/* Search */}
          <button
            type="button"
            className="mobile-top-icon"
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="mobile-top-icon mobile-top-cart"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="mobile-top-cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Logout / Account */}
          {user ? (
            <button
              type="button"
              className="mobile-top-icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={19} />
            </button>
          ) : (
            <Link
              to="/login"
              className="mobile-top-icon"
              aria-label="Account"
            >
              <UserRound size={20} />
            </Link>
          )}

          {/* Hamburger */}
          <button
            type="button"
            className="navbar-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

      </div>

      {/* =================================
          MOBILE DROPDOWN
      ================================= */}

      <nav className={`mobile-nav ${menuOpen ? "active" : ""}`}>

        <Link
          to="/"
          onClick={closeMobileMenu}
        >
          Home
        </Link>

        <a
          href="/#menu"
          onClick={handleMenuClick}
        >
          Menu
        </a>

        <a
          href="/#about"
          onClick={handleAboutClick}
        >
          About
        </a>

        <Link
          to="/orders"
          onClick={closeMobileMenu}
        >
          Orders
        </Link>

      </nav>
    </header>
  );
}

export default Navbar;
