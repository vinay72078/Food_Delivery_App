import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { getFoodItems } from "../api/api";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import { useCart } from "../context/CartContext";
import "./Home.css";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        const data = await getFoodItems();
        setFoodItems(Array.isArray(data) ? data : data.foodItems || []);
      } catch (err) {
        setError("Unable to load food items.");
      } finally {
        setLoading(false);
      }
    };

    loadFoodItems();
  }, []);

  const filteredItems = foodItems.filter((item) => {
    const name = item.name || "";
    const category = item.category || "";

    const matchesSearch = `${name} ${category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleViewAll = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-location">
                <MapPin size={16} strokeWidth={1.8} />
                <span>Delivering fresh food near you</span>
              </div>

              <h1>
                Good food,
                <br />
                <span>made simple.</span>
              </h1>

              <p>
                Discover delicious meals from your favorite local kitchens
                and get them delivered to your door.
              </p>

              <div className="hero-search">
                <Search size={19} strokeWidth={1.8} />
                <input
                  id="food-search-input"
                  type="text"
                  placeholder="Search for food or category"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-card">
                <div className="hero-card-glow" />
                <div className="hero-card-circle hero-card-circle-1" />
                <div className="hero-card-circle hero-card-circle-2" />
                <div className="hero-card-emoji hero-card-emoji-1">🍕</div>
                <div className="hero-card-emoji hero-card-emoji-2">🍔</div>
                <div className="hero-card-emoji hero-card-emoji-3">🥗</div>
                <div className="hero-card-emoji hero-card-emoji-4">🍜</div>

                <div className="hero-card-badge">
                  <span className="hero-card-badge-dot" />
                  Fresh today
                </div>

                <div className="hero-card-content">
                  <span className="hero-card-label">Today's selection</span>
                  <strong>{foodItems.length || "—"} dishes</strong>
                  <span className="hero-card-subtitle">
                    Fresh choices, ready to order.
                  </span>
                  <button
                    type="button"
                    className="hero-card-button"
                    onClick={handleViewAll}
                  >
                    Browse menu
                    <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-container">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">Our menu</span>
                <h2>Popular dishes</h2>
              </div>

              <button className="view-menu-button" type="button" onClick={handleViewAll}>
                View all
                <ArrowRight size={17} strokeWidth={1.8} />
              </button>
            </div>

            <CategoryBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {loading && (
              <div className="menu-message">
                Loading delicious food...
              </div>
            )}

            {!loading && error && (
              <div className="menu-message menu-error">
                {error}
              </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <div className="menu-message">
                No food items found.
              </div>
            )}

            {!loading && !error && filteredItems.length > 0 && (
              <div className="food-grid">
                {filteredItems.map((item) => (
                  <article className="food-card" key={item._id || item.id}>
                    <div className="food-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="food-image-placeholder">
                          {item.name?.charAt(0)?.toUpperCase() || "F"}
                        </div>
                      )}
                    </div>

                    <div className="food-card-content">
                      <div className="food-card-top">
                        <span className="food-category">
                          {item.category || "Food"}
                        </span>

                        {item.rating && (
                          <span className="food-rating">
                            ★ {item.rating}
                          </span>
                        )}
                      </div>

                      <h3>{item.name}</h3>

                      {item.description && (
                        <p>{item.description}</p>
                      )}

                      <div className="food-card-bottom">
                        <strong>
                          ₹{Number(item.price || 0).toFixed(0)}
                        </strong>

                        <button
                          type="button"
                          className="add-food-button"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-container">
            <div className="about-content">
              <span className="section-eyebrow">Why Foodie</span>
              <h2>Simple ordering. Great food.</h2>
              <p>
                Browse the menu, choose what you love, and get your meal
                delivered without the clutter.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;