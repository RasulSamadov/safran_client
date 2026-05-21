// src/services/menuApi.js
// Self-contained menu API — same pattern as inquiryApi.js

// ==================== CONFIGURATION ====================
// Set your Apps Script Web App URL here OR call setMenuSheetUrl() at runtime
let SHEET_URL = 'https://script.google.com/macros/s/AKfycbyc8Q4RhUT8C0CPvVpx00F2rqGEZtF9gKqtIP6t0SN_3-YroOYvLwKcZetPwHJRqhec/exec';

export const setMenuSheetUrl = (url) => {
  SHEET_URL = url;
  localStorage.setItem('menuSheetUrl', url);
};

export const getMenuSheetUrl = () => {
  if (SHEET_URL) return SHEET_URL;
  const stored = localStorage.getItem('menuSheetUrl');
  if (stored) { SHEET_URL = stored; return stored; }
  // Fallback: check other keys your app might use
  const legacy = localStorage.getItem('inquirySheetUrl') || localStorage.getItem('googleSheetUrl');
  if (legacy) { SHEET_URL = legacy; return legacy; }
  return '';
};

// ==================== API HELPERS ====================
const apiCall = async (payload) => {
  const sheetUrl = getMenuSheetUrl();
  if (!sheetUrl) {
    console.warn('Sheet URL not configured');
    return { result: 'error', message: 'Sheet URL not configured' };
  }
  try {
    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    return await response.json();
  } catch (error) {
    console.error('Menu API Error:', error);
    return { result: 'error', message: error.message || 'Unknown error' };
  }
};

const apiCallGet = async (params) => {
  const sheetUrl = getMenuSheetUrl();
  if (!sheetUrl) {
    return { result: 'error', message: 'Sheet URL not configured' };
  }
  try {
    const url = new URL(sheetUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    const response = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
    return await response.json();
  } catch (error) {
    console.error('Menu API Error:', error);
    return { result: 'error', message: error.message || 'Unknown error' };
  }
};

// ==================== MENU API ====================
export const MenuAPI = {
  // Get all menu items (public + admin)
  getAll: async () => {
    const result = await apiCallGet({ entity: 'menu' });
    if (result.result === 'success') return result.data || [];
    return [];
  },

  // Create a single menu item
  create: async (item) => {
    const result = await apiCall({
      method: 'create',
      entity: 'menu',
      ...item
    });
    return result.result === 'success' ? result.id || null : null;
  },

  // Update a menu item
  update: async (id, updates) => {
    const result = await apiCall({
      method: 'update',
      entity: 'menu',
      id,
      ...updates
    });
    return result.result === 'success';
  },

  // Delete a menu item
  delete: async (id) => {
    const result = await apiCall({
      method: 'delete',
      entity: 'menu',
      id
    });
    return result.result === 'success';
  },

  // Bulk create items
  bulkCreate: async (items) => {
    const result = await apiCall({
      method: 'bulkCreate',
      entity: 'menu',
      items
    });
    return result.result === 'success' ? result.count || 0 : 0;
  },

  // Replace all items (full sync)
  replaceAll: async (items) => {
    const result = await apiCall({
      method: 'replaceAll',
      entity: 'menu',
      items
    });
    return result.result === 'success';
  }
};

export default MenuAPI;