import "./CategoryBar.css";

const categories = [
  "All",
  "Main Course",
  "Starters",
  "Breakfast",
  "Street Food",
  "Snacks",
  "Sides",
  "Beverages",
  "Desserts"
];

function CategoryBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-bar">
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;