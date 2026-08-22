import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, MapPin, Phone, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { createOrder } from "../api/api";
import "./Checkout.css";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  useEffect(() => {
    if (cartItems.length === 0 && !placedOrderId) {
      navigate("/cart");
    }
  }, [cartItems.length, placedOrderId, navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      setError("Please fill in all delivery details");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now()}`;
      const orderData = {
        orderId,
        userId: user.id,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ""
        })),
        total: getCartTotal() + 40,
        deliveryDetails: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          pincode: form.pincode
        }
      };

      await createOrder(orderData);
      setPlacedOrderId(orderId);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (placedOrderId) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="order-success">
          <CheckCircle size={64} strokeWidth={1.5} color="#16a34a" />
          <h1>Order placed successfully!</h1>
          <p>Order ID: <strong>{placedOrderId}</strong></p>
          <p>Thank you for ordering with Foodie. Your food is being prepared.</p>
          <Link to="/" className="order-success-button">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-main">
        <div className="checkout-container">
          <Link to="/cart" className="checkout-back">
            <ArrowLeft size={18} strokeWidth={1.8} />
            Back to cart
          </Link>

          <h1 className="checkout-title">Checkout</h1>

          {error && <div className="checkout-error">{error}</div>}

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-section">
                <h2>Delivery details</h2>

                <div className="form-group">
                  <label htmlFor="name">
                    <User size={14} /> Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={14} /> Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">
                    <MapPin size={14} /> Delivery address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    placeholder="House no, street, area"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="6-digit pincode"
                      value={form.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="place-order-button" disabled={loading}>
                {loading ? "Placing order..." : `Place order • ₹${(getCartTotal() + 40).toFixed(0)}`}
              </button>
            </form>

            <div className="checkout-summary">
              <h2>Order summary</h2>

              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div className="checkout-item" key={item._id}>
                    <div className="checkout-item-info">
                      <span className="checkout-item-qty">{item.quantity}×</span>
                      <span>{item.name}</span>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toFixed(0)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Delivery fee</span>
                  <span>₹40</span>
                </div>
                <div className="checkout-total-row checkout-grand-total">
                  <span>Total</span>
                  <span>₹{(getCartTotal() + 40).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;