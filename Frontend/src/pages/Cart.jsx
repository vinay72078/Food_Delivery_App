import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-empty">
          <ShoppingBag size={48} strokeWidth={1.5} />
          <h2>Your cart is empty</h2>
          <p>Add some delicious food to get started.</p>
          <Link to="/" className="cart-empty-button">
            Browse menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Your cart</h1>
            <span>{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</span>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder">
                        {item.name?.charAt(0)?.toUpperCase() || "F"}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <span className="cart-item-category">
                      {item.category || "Food"}
                    </span>
                    <strong>₹{Number(item.price || 0).toFixed(0)}</strong>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} strokeWidth={2} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} strokeWidth={2} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(0)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery fee</span>
                <span>₹40</span>
              </div>

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{(getCartTotal() + 40).toFixed(0)}</span>
              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
                <ArrowRight size={18} strokeWidth={1.8} />
              </button>

              <Link to="/" className="continue-shopping">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;