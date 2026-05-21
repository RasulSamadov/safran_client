// src/components/menu/MenuAdmin.jsx
// Admin panel — add, edit, delete menu items & categories

import { useState, useEffect, useCallback } from "react";
import { MenuAPI } from "../../service/menuApi";
import "./menu.css";

// ==================== ICONS ====================
const Icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Refresh: ({ spinning }) => <svg className={spinning ? "madm-spin" : ""} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>,
};

// ==================== ITEM FORM MODAL ====================
const ItemModal = ({ item, categories, onSave, onClose }) => {
  const isEdit = !!item;
  const [form, setForm] = useState({
    category: item?.category || (categories.length > 0 ? categories[0] : ""),
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    sortOrder: item?.sortOrder || 0,
    isActive: item?.isActive !== undefined ? item.isActive : true,
  });
  const [newCategory, setNewCategory] = useState("");
  const [useNewCat, setUseNewCat] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const finalCategory = useNewCat ? newCategory.trim() : form.category;
    if (!finalCategory) { setSaving(false); return; }

    const payload = {
      ...form,
      category: finalCategory,
      price: parseFloat(form.price) || 0,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    await onSave(item?.id || null, payload);
    setSaving(false);
  };

  return (
    <div className="madm-overlay">
      <div className="madm-backdrop" onClick={onClose} />
      <div className="madm-modal">
        <div className="madm-modal-header">
          <h3>{isEdit ? "Redaktə et" : "Yeni məhsul"}</h3>
          <button className="madm-btn madm-btn-ghost" onClick={onClose}><Icons.X /></button>
        </div>

        <form onSubmit={handleSubmit} className="madm-modal-body">
          {/* Category */}
          <div className="madm-field">
            <label>Kateqoriya *</label>
            {!useNewCat ? (
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  style={{ flex: 1 }}
                  required
                >
                  <option value="">Seç...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="button" className="madm-btn" onClick={() => setUseNewCat(true)}>
                  <Icons.Plus /> Yeni
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Yeni kateqoriya adı"
                  required
                  style={{ flex: 1 }}
                />
                <button type="button" className="madm-btn" onClick={() => setUseNewCat(false)}>Mövcud</button>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="madm-field">
            <label>Məhsul adı *</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Məs: Toyuq Şorbası"
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="madm-field">
            <label>Təsvir (ixtiyari)</label>
            <input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Məs: Toyuqlu, kartoflu"
              maxLength={300}
            />
          </div>

          {/* Price + Sort Order */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="madm-field">
              <label>Qiymət (₼) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
                required
              />
            </div>
            <div className="madm-field">
              <label>Sıra nömrəsi</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => handleChange("sortOrder", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Active toggle */}
          <label className="madm-toggle">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
            <span>Aktiv (menyuda görünsün)</span>
          </label>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
            <button type="submit" className="madm-btn madm-btn-primary" disabled={saving} style={{ flex: 1 }}>
              <Icons.Save /> {saving ? "Saxlanılır..." : isEdit ? "Yenilə" : "Əlavə et"}
            </button>
            <button type="button" className="madm-btn" onClick={onClose}>Ləğv et</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MAIN ADMIN ====================
const MenuAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MenuAPI.getAll();
      setItems(data);
    } catch (err) {
      console.error("Failed to load menu:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Get unique categories
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort();

  // Filter
  const filtered = items
    .filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          (item.name || "").toLowerCase().includes(term) ||
          (item.category || "").toLowerCase().includes(term) ||
          (item.description || "").toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by category first, then sortOrder
      const catCmp = (a.category || "").localeCompare(b.category || "");
      if (catCmp !== 0) return catCmp;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });

  // Group filtered by category for display
  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category || "Digər";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Save handler (create or update)
  const handleSave = async (id, data) => {
    if (id) {
      const success = await MenuAPI.update(id, data);
      if (success) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
        showMsg("success", "Yeniləndi!");
      } else {
        showMsg("error", "Xəta baş verdi.");
      }
    } else {
      const newId = await MenuAPI.create(data);
      if (newId) {
        setItems((prev) => [...prev, { ...data, id: newId }]);
        showMsg("success", "Əlavə edildi!");
      } else {
        showMsg("error", "Xəta baş verdi.");
      }
    }
    setShowModal(false);
    setEditItem(null);
  };

  // Delete handler
  const handleDelete = async (id) => {
    const success = await MenuAPI.delete(id);
    if (success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showMsg("success", "Silindi!");
    } else {
      showMsg("error", "Silinmədi.");
    }
    setDeleteConfirm(null);
  };

  // Toggle active
  const toggleActive = async (item) => {
    const newActive = !item.isActive;
    const success = await MenuAPI.update(item.id, { isActive: newActive });
    if (success) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: newActive } : i)));
    }
  };

  // Category counts
  const catCounts = items.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="madm-page">
      <div className="madm-container">
        {/* Header */}
        <div className="madm-header">
          <div>
            <h1>Menyu İdarəetmə</h1>
            <div className="madm-header-sub">
              {items.length} məhsul · {categories.length} kateqoriya
            </div>
          </div>
          <div className="madm-actions">
            <button className="madm-btn madm-btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
              <Icons.Plus /> Yeni məhsul
            </button>
            <button className="madm-btn" onClick={fetchItems} disabled={loading}>
              <Icons.Refresh spinning={loading} /> Yenilə
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`madm-message ${message.type}`}>{message.text}</div>
        )}

        {/* Category chips */}
        <div className="madm-chips">
          <button
            className={`madm-chip ${categoryFilter === "all" ? "active" : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            Hamısı ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`madm-chip ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat} ({catCounts[cat] || 0})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="madm-search-wrap">
          <Icons.Search />
          <input
            className="madm-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Axtar... (ad, kateqoriya, təsvir)"
          />
        </div>

        {/* Items by category */}
        {loading ? (
          <div className="madm-empty">
            <Icons.Refresh spinning={true} />
            <p>Yüklənir...</p>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="madm-empty">
            <p>{searchTerm || categoryFilter !== "all" ? "Heç nə tapılmadı." : "Menyu boşdur. İlk məhsulu əlavə edin!"}</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="madm-cat-section">
              <div className="madm-cat-header">
                <h2>{cat}</h2>
                <span className="madm-cat-count">{catItems.length} məhsul</span>
              </div>

              <div className="madm-table-wrap">
                <table className="madm-table">
                  <thead>
                    <tr>
                      <th>Ad</th>
                      <th>Təsvir</th>
                      <th>Qiymət</th>
                      <th>Sıra</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => (
                      <tr key={item.id} className={!item.isActive ? "madm-row-inactive" : ""}>
                        <td className="madm-item-name">{item.name}</td>
                        <td className="madm-item-desc">{item.description || "—"}</td>
                        <td className="madm-item-price">{item.price}₼</td>
                        <td style={{ color: "#94a3b8", fontSize: 12 }}>{item.sortOrder}</td>
                        <td>
                          <button
                            className={`madm-status-btn ${item.isActive ? "active" : "inactive"}`}
                            onClick={() => toggleActive(item)}
                            title={item.isActive ? "Deaktiv et" : "Aktiv et"}
                          >
                            {item.isActive ? <><Icons.Eye /> Aktiv</> : <><Icons.EyeOff /> Gizli</>}
                          </button>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="madm-row-actions">
                            <button
                              className="madm-btn madm-btn-ghost"
                              onClick={() => { setEditItem(item); setShowModal(true); }}
                              title="Redaktə et"
                            >
                              <Icons.Edit />
                            </button>
                            {deleteConfirm === item.id ? (
                              <button
                                className="madm-btn madm-btn-danger-sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                Əminsiniz?
                              </button>
                            ) : (
                              <button
                                className="madm-btn madm-btn-ghost madm-btn-ghost-danger"
                                onClick={() => setDeleteConfirm(item.id)}
                                title="Sil"
                              >
                                <Icons.Trash />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ItemModal
          item={editItem}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        />
      )}
    </div>
  );
};

export default MenuAdmin;