import { STORAGE_KEYS, MOCK_DATA } from "../constants";
import { safeJSONParse } from "../utils/storage";

const getItems = () => {
  return safeJSONParse(localStorage.getItem(STORAGE_KEYS.DISPLAY_ITEMS), MOCK_DATA);
};

const saveItems = (items) => {
  localStorage.setItem(STORAGE_KEYS.DISPLAY_ITEMS, JSON.stringify(items));
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
  callback(getItems());

  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.DISPLAY_ITEMS || e.type === 'storage') {
      callback(getItems());
    }
  };

  window.addEventListener('storage', handleStorageChange);
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

// Updated default settings to include mock contact info
const DEFAULT_SETTINGS = {
  slideDuration: 5000,
  donationUrl: "https://www.levchabad.org/donate",
  contactPhone: "050-7690577",
  contactEmail: "office@LevChabad.org.il"
};

const getSettings = () => {
  return safeJSONParse(localStorage.getItem(STORAGE_KEYS.APP_SETTINGS), DEFAULT_SETTINGS);
};

const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new Event('storage'));
};

export const subscribeToSettings = (callback) => {
  callback(getSettings());

  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.APP_SETTINGS || e.type === 'storage') {
      callback(getSettings());
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
};

export const updateSettings = async (newSettings) => {
  const current = getSettings();
  saveSettings({ ...current, ...newSettings });
  return getSettings();
};