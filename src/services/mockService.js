import { STORAGE_KEYS, MOCK_DATA } from "../constants";
import { safeJSONParse } from "../utils/storage";

const getItems = () => {
  return safeJSONParse(localStorage.getItem(STORAGE_KEYS.DISPLAY_ITEMS), MOCK_DATA);
};

const saveItems = (items) => {
  localStorage.setItem(STORAGE_KEYS.DISPLAY_ITEMS, JSON.stringify(items));
  // Dispatch a custom event so the current tab also updates if listening
  window.dispatchEvent(new Event('storage'));
};

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const subscribeToItems = (callback) => {
  // Initial load
  callback(getItems());

  // Listen for storage changes (from other tabs)
  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.DISPLAY_ITEMS || e.type === 'storage') { // e.type check for manual dispatch
      callback(getItems());
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  // Custom event listener for same-tab updates if needed (though direct calls usually handle this, 'storage' event is mainly for cross-tab)
  // For same-tab, the caller usually updates their state after the promise resolves, or we rely on the callback being called again.
  // In this mock service, since we return promises, the component might re-fetch or we can just invoke callback.
  // We'll stick to 'storage' event which fires on other tabs. 
  // However, for single-page app behavior, we might want to trigger the callback manually in add/update/delete.

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export const addItem = async (item, imageFile) => {
  try {
    const items = getItems();
    let imageUrl = item.donorLogo || "";

    if (imageFile) {
      imageUrl = await convertFileToBase64(imageFile);
    }

    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = { ...item, id: newId, donorLogo: imageUrl };
    
    const updatedItems = [...items, newItem];
    saveItems(updatedItems);
    
    return newItem;
  } catch (error) {
    console.error("Error adding mock item:", error);
    throw error;
  }
};

export const updateItem = async (id, data, imageFile) => {
  try {
    const items = getItems();
    let imageUrl = data.donorLogo || "";

    if (imageFile) {
      imageUrl = await convertFileToBase64(imageFile);
    }

    const updatedItems = items.map(item => 
      item.id === id ? { ...data, id, donorLogo: imageUrl } : item
    );

    saveItems(updatedItems);
    return { ...data, id, donorLogo: imageUrl };
  } catch (error) {
    console.error("Error updating mock item:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const items = getItems();
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
    return true;
  } catch (error) {
    console.error("Error deleting mock item:", error);
    throw error;
  }
};
