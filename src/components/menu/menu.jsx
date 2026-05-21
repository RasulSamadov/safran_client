// src/components/menu/Menu.jsx
// Public menu page — customers scan QR and see this

import { useState, useEffect } from "react";
import { MenuAPI } from "../../service/menuApi";
import "./menu.css";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await MenuAPI.getAll();
        // Only show active items
        const active = data.filter((item) => item.isActive !== false);
        setItems(active);
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Group items by category, respecting sortOrder
  const grouped = items
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .reduce((acc, item) => {
      const cat = item.category || "Digər";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

  const categories = Object.keys(grouped);

  // Scroll to category
  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const el = document.getElementById("cat-" + cat.replace(/\s+/g, "-"));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="menu-loading-spinner" />
        <p>Menyu yüklənir...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="menu-loading">
        <p>Menyu hazırda boşdur.</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <div className="menu-header-inner">
          <h1 className="menu-logo">SAFRAN LOUNGE</h1>
          <p className="menu-tagline">PREMIUM MENYU</p>
        </div>
      </header>

      {/* Category nav — sticky on mobile */}
      <nav className="menu-nav">
        <div className="menu-nav-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu-nav-item ${activeCategory === cat ? "active" : ""}`}
              onClick={() => scrollToCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu content */}
      <main className="menu-content">
        {categories.map((cat) => (
          <section key={cat} id={"cat-" + cat.replace(/\s+/g, "-")} className="menu-category">
            <div className="menu-category-header">
              <div className="menu-category-line" />
              <h2 className="menu-category-title">{cat}</h2>
              <div className="menu-category-line" />
            </div>

            <div className="menu-items">
              {grouped[cat].map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-info">
                    <span className="menu-item-name">{item.name}</span>
                    <span className="menu-item-dots" />
                    <span className="menu-item-price">{item.price}m</span>
                  </div>
                  {item.description && (
                    <p className="menu-item-desc">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="menu-footer">
        <p>Safran Lounge • Premium Menyu</p>
      </footer>
    </div>
  );
};

export default Menu;