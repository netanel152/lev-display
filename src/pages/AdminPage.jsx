import { useState, useEffect } from "react";
import { Plus, Heart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getHebrewDate } from "../utils/hebrewDate";
import { subscribeToItems, addItem, updateItem, deleteItem, subscribeToSettings, updateSettings } from "../services/dataService";
import { STORAGE_KEYS } from "../constants";
import ConfirmModal from "../components/ConfirmModal";
import AdminItemForm from "../components/AdminItemForm";
import AdminItemRow from "../components/AdminItemRow";

const AdminPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [slideDuration, setSlideDuration] = useState(5);

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsubscribeItems = subscribeToItems((newItems) => {
      setItems(newItems);
    });

    const unsubscribeSettings = subscribeToSettings((settings) => {
      if (settings && settings.slideDuration) {
        setSlideDuration(settings.slideDuration / 1000);
      }
    });

    return () => {
      unsubscribeItems();
      unsubscribeSettings();
    };
  }, []);

  const handleDurationChange = (e) => {
    const newVal = parseInt(e.target.value, 10);
    setSlideDuration(newVal);
    updateSettings({ slideDuration: newVal * 1000 });
  };

  const handleLogout = () => {
    console.log("[AdminPage] Logging out");
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    navigate("/");
  };

  // --- Delete Logic ---
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    
    console.log(`[AdminPage] Deleting item ${itemToDelete}`);
    try {
      await deleteItem(itemToDelete);
      toast.error('ההקדשה נמחקה');
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error('שגיאה במחיקת הפריט');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // --- Form Logic ---
  const openNewItemForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    console.log(`[AdminPage] Opening edit form for item ${item.id}`);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (formData, imageFile) => {
    console.log("[AdminPage] Saving item...");
    
    // Auto-fill hebrew date if date changes (simplified logic simulation)
    // In a real scenario, the form component should probably handle this using the util,
    // or we check here if it's missing. For now, let's respect what came from the form.
    // However, the original code had `handleDateChange` which updated `hebrewDate`.
    // Let's add a quick check: if there is a date but no hebrew date, try to fill it.
    if (formData.date && !formData.hebrewDate) {
        formData.hebrewDate = getHebrewDate(formData.date);
    }

    const finalSubText = formData.subText || formData.hebrewDate;
    const itemData = { ...formData, subText: finalSubText };

    try {
      if (editingItem) {
        console.log(`[AdminPage] Updating existing item ${editingItem.id}`);
        await updateItem(editingItem.id, itemData, imageFile);
      } else {
        console.log("[AdminPage] Creating new item");
        await addItem(itemData, imageFile);
      }
      toast.success('ההקדשה נשמרה בהצלחה!');
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error('שגיאה בשמירת הפריט');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-admin flex flex-col">
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="מחיקת הקדשה"
        message="האם אתה בטוח שברצונך למחוק את ההקדשה הזו? פעולה זו אינה ניתנת לביטול."
        onConfirm={executeDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="מחק"
        cancelText="ביטול"
        type="danger"
      />

      {isFormOpen && (
        <AdminItemForm 
          key={editingItem ? editingItem.id : 'new'}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveItem}
          initialData={editingItem}
          isEditing={!!editingItem}
        />
      )}

      <header className="bg-lev-burgundy text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <Heart size={20} fill="white" /> ניהול לב חב"ד
        </h1>
        <div className="flex gap-2">
          <button onClick={handleLogout} className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 flex items-center gap-1">
            <LogOut size={16} /> יציאה
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="pt-6 px-4 pb-40 max-w-2xl mx-auto space-y-4">
          {/* Settings Card */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-3 border-b pb-2">הגדרות תצוגה</h2>
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium whitespace-nowrap">זמן הצגת שקופית:</label>
              <input
                type="range"
                min="3"
                max="20"
                value={slideDuration}
                onChange={handleDurationChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lev-blue"
              />
              <span className="w-12 text-center font-bold text-lev-blue bg-blue-50 py-1 rounded-md">{slideDuration} ש'</span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <AdminItemRow 
                key={item.id} 
                item={item} 
                onEdit={openEditForm} 
                onDelete={confirmDelete} 
              />
            ))}
          </div>
        </div>
      </main>

      <button 
        onClick={openNewItemForm} 
        className="fixed bottom-6 left-6 bg-lev-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-40 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="הוסף הקדשה חדשה"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default AdminPage;
