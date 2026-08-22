import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createFoodItem,
  deleteFoodItem,
  getFoodItems,
  toggleFoodAvailability,
  updateFoodItem
} from "../../api/api";
import AdminLayout from "../../components/AdminLayout";
import "./AdminDashboard.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Snacks",
  dietaryPreference: "Vegetarian",
  offer: "",
  image: "",
  isAvailable: true
};

function AdminDashboard() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const loadFoodItems = async () => {
    try {
      const data = await getFoodItems();
      setFoodItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load food items.");
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
    loadFoodItems();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price)
      };

      if (editingId) {
        await updateFoodItem(editingId, payload);
      } else {
        await createFoodItem(payload);
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadFoodItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save food item.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "Snacks",
      dietaryPreference: item.dietaryPreference || "Vegetarian",
      offer: item.offer || "",
      image: item.image || "",
      isAvailable: item.isAvailable ?? true
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteFoodItem(id);
      await loadFoodItems();
    } catch (err) {
      setError("Failed to delete food item.");
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await toggleFoodAvailability(id);
      await loadFoodItems();
    } catch (err) {
      setError("Failed to update availability.");
    }
  };

  return (
    <AdminLayout activePage="dashboard">
      <header className="admin-header">
        <h1>Food Items</h1>
        <button
          type="button"
          className="admin-add-button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          <Plus size={18} strokeWidth={2} />
          {showForm ? "Close" : "Add item"}
        </button>
      </header>

      {error && <div className="admin-error">{error}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit item" : "Add new item"}</h2>

          <div className="admin-form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Item name"
                required
              />
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the item"
                rows="2"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="Beverages">Beverages</option>
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Sides">Sides</option>
                <option value="Snacks">Snacks</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Street Food">Street Food</option>
                <option value="Salad">Salad</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dietary preference *</label>
              <select
                name="dietaryPreference"
                value={form.dietaryPreference}
                onChange={handleChange}
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="None">None</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label>Image URL *</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>

            <div className="form-group">
              <label>Offer</label>
              <input
                type="text"
                name="offer"
                value={form.offer}
                onChange={handleChange}
                placeholder="e.g. 20% off"
              />
            </div>

            <div className="form-group form-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />
                Available
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-save-button" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update item" : "Add item"}
            </button>
            <button
              type="button"
              className="admin-cancel-button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="admin-loading">Loading food items...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="admin-item-name">
                      <div className="admin-item-thumb">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <span style={{ display: item.image ? "none" : "flex" }}>
                          {item.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        {item.offer && <span className="admin-item-offer">{item.offer}</span>}
                      </div>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>₹{Number(item.price || 0).toFixed(0)}</td>
                  <td>
                    <button
                      type="button"
                      className={`admin-status-badge ${item.isAvailable ? "available" : "unavailable"}`}
                      onClick={() => handleToggleAvailability(item._id)}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() => handleEdit(item)}
                        aria-label="Edit"
                      >
                        <Pencil size={16} strokeWidth={1.8} />
                      </button>
                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDelete(item._id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;