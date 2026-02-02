import { useState, useEffect, useMemo } from "react";
import { 
  Plus, LogOut, Flame, HeartPulse, Cake, Star, Settings, 
  Pencil, Trash2, Search, Save, MonitorPlay 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { subscribeToItems, addItem, updateItem, deleteItem, subscribeToSettings, updateSettings } from "../services/dataService";
import { STORAGE_KEYS } from "../constants";
import ConfirmModal from "../components/ConfirmModal";
import AdminItemForm from "../components/AdminItemForm";

const AdminPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({
    slideDuration: 5000,
    donationUrl: "",
    contactPhone: "",
    contactEmail: ""
  });
  
  // Local settings state for the form (to allow "Save" action)
  const [localSettings, setLocalSettings] = useState({ ...globalSettings });

  // Tabs: 'memorial', 'healing', 'birthday', 'success', 'settings'
  const [activeTab, setActiveTab] = useState('memorial');

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    console.log("[AdminPage] Initializing subscriptions...");
    const unsubscribeItems = subscribeToItems((newItems) => {
      console.log(`[AdminPage] Items updated: ${newItems.length} items`);
      setItems(newItems);
    });

    const unsubscribeSettings = subscribeToSettings((newSettings) => {
      if (newSettings) {
        console.log("[AdminPage] Settings updated from remote");
        setGlobalSettings(prev => ({ ...prev, ...newSettings }));
        setLocalSettings(prev => ({ ...prev, ...newSettings }));
      }
    });

    return () => {
      unsubscribeItems();
      unsubscribeSettings();
    };
  }, []);

  const handleLogout = () => {
    console.log("[AdminPage] User logging out");
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    navigate("/");
  };

  // --- Settings Logic ---
  const handleLocalSettingChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    console.log("[AdminPage] Saving settings...");
    try {
      // Ensure slideDuration is number
      const settingsToSave = {
        ...localSettings,
        slideDuration: Number(localSettings.slideDuration)
      };
      await updateSettings(settingsToSave);
      toast.success('הגדרות נשמרו בהצלחה');
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error('שגיאה בשמירת הגדרות');
    }
  };

  // --- Delete Logic ---
  const confirmDelete = (id) => {
    console.log(`[AdminPage] Requesting delete for item: ${id}`);
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      console.log(`[AdminPage] Executing delete for item: ${itemToDelete}`);
      await deleteItem(itemToDelete);
      toast.success('ההקדשה נמחקה');
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
    console.log("[AdminPage] Opening new item form");
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    console.log(`[AdminPage] Opening edit form for item: ${item.id}`);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (formData, imageFile) => {
    console.log("[AdminPage] Saving item form data...");
    // If we need to ensure date is present for sorting, we might check formData.date
    // The Form component handles the construction of hebrewDate and date
    
    // Ensure the type matches the active tab if we are in a specific tab context (optional but good UX)
    // Actually, let's trust the form's selection, or default the form to the active tab if it's new.
    const finalData = { ...formData };
    if (!editingItem && activeTab !== 'settings') {
        finalData.type = activeTab;
    }

    try {
      if (editingItem) {
        console.log(`[AdminPage] Updating existing item: ${editingItem.id}`);
        await updateItem(editingItem.id, finalData, imageFile);
      } else {
        console.log("[AdminPage] Creating new item");
        await addItem(finalData, imageFile);
      }
      toast.success('ההקדשה נשמרה בהצלחה!');
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error('שגיאה בשמירת הפריט');
    }
  };

  // --- Filtering ---
  const filteredItems = useMemo(() => {
    if (activeTab === 'settings') return [];
    const results = items.filter(item => item.type === activeTab);
    // Log only when tab changes effectively or items change significantly to avoid spam
    // but here inside useMemo it runs on every render dependency change.
    // We'll skip logging inside useMemo to avoid side effects/spam.
    return results;
  }, [items, activeTab]);
  
  // Log active tab change
  useEffect(() => {
      console.log(`[AdminPage] Switched to tab: ${activeTab}`);
  }, [activeTab]);

  const tabs = [
    { id: 'memorial', label: 'לעילוי נשמת', icon: Flame, color: 'text-orange-600', activeColor: 'bg-orange-100 text-orange-700' },
    { id: 'healing', label: 'לרפואת', icon: HeartPulse, color: 'text-green-600', activeColor: 'bg-green-100 text-green-700' },
    { id: 'birthday', label: 'יום הולדת', icon: Cake, color: 'text-pink-600', activeColor: 'bg-pink-100 text-pink-700' },
    { id: 'success', label: 'להצלחה', icon: Star, color: 'text-blue-600', activeColor: 'bg-blue-100 text-blue-700' },
    { id: 'settings', label: 'הגדרות', icon: Settings, color: 'text-gray-600', activeColor: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-admin flex flex-col" dir="rtl">
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
          initialData={{...editingItem, type: editingItem?.type || (activeTab !== 'settings' ? activeTab : 'memorial')}}
          isEditing={!!editingItem}
        />
      )}

      {/* Floating Logout Button */}
      <button 
        onClick={handleLogout} 
        className="fixed top-4 left-4 z-[60] bg-white/80 backdrop-blur-md border border-gray-200 text-gray-500 hover:text-red-600 p-2.5 rounded-xl shadow-sm transition-all hover:shadow-md hover:bg-white flex items-center gap-2 text-sm font-bold group"
      >
        <LogOut size={18} className="transform scale-x-[-1] group-hover:-translate-x-1 transition-transform" />
        <span className="hidden md:inline">יציאה</span>
      </button>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-center items-center relative">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-lev-burgundy text-white p-1.5 rounded-lg shadow-sm">
               <Settings size={20} />
            </div>
            <span>ניהול מערכת לב חב"ד</span>
          </h1>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 mt-3 flex custom-x-scrollbar gap-3 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap font-bold text-sm border
                  ${isActive 
                    ? tab.activeColor + ' border-transparent shadow-md scale-105' 
                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700'
                  }
                `}
              >
                <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-24">
        
        {/* Content Area */}
        {activeTab === 'settings' ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6 md:p-8 animate-fade-in">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <Settings className="text-gray-400" /> הגדרות כלליות
             </h2>
             
             <div className="space-y-6">
                {/* Duration */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">זמן תצוגה לשקופית (שניות)</label>
                   <div className="flex items-center gap-4">
                     <input 
                       type="range" 
                       min="3" max="30" step="1"
                       value={localSettings.slideDuration / 1000}
                       onChange={(e) => handleLocalSettingChange('slideDuration', e.target.value * 1000)}
                       className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lev-blue"
                     />
                     <span className="w-16 text-center font-mono font-bold bg-blue-50 text-blue-700 py-1 rounded-md">
                       {localSettings.slideDuration / 1000}s
                     </span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">טלפון לאיש קשר</label>
                    <input 
                      type="text"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                      value={localSettings.contactPhone}
                      onChange={(e) => handleLocalSettingChange('contactPhone', e.target.value)}
                      placeholder="050-0000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">אימייל לאיש קשר</label>
                    <input 
                      type="email"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                      value={localSettings.contactEmail}
                      onChange={(e) => handleLocalSettingChange('contactEmail', e.target.value)}
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">קישור לתרומה (QR Code)</label>
                   <input 
                      type="url"
                      dir="ltr"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
                      value={localSettings.donationUrl}
                      onChange={(e) => handleLocalSettingChange('donationUrl', e.target.value)}
                      placeholder="https://pay.example.com/..."
                    />
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button 
                    onClick={saveSettings}
                    className="flex items-center gap-2 bg-lev-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                    <Save size={18} /> שמור הגדרות
                  </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Table Header / Stats */}
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-gray-500 text-sm font-medium">
                 נמצאו {filteredItems.length} הקדשות
               </h2>
            </div>

            {/* Smart Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
               {filteredItems.length === 0 ? (
                 <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p>לא נמצאו הקדשות בקטגוריה זו.</p>
                    <button onClick={openNewItemForm} className="mt-4 text-lev-blue font-bold hover:underline">
                      צור הקדשה חדשה
                    </button>
                 </div>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm">
                     <thead className="bg-gray-50 text-gray-500 font-medium">
                       <tr>
                         <th className="px-4 py-3 text-right">שם מלא</th>
                         <th className="px-4 py-3 text-right hidden sm:table-cell">טקסט נוסף</th>
                         <th className="px-4 py-3 text-right">תאריך עברי</th>
                         <th className="px-4 py-3 text-right hidden md:table-cell">תורם</th>
                         <th className="px-4 py-3 w-[100px]">פעולות</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y">
                       {filteredItems.map(item => (
                         <tr key={item.id} className="group hover:bg-gray-50 transition">
                           <td className="px-4 py-3">
                             <div className="font-bold text-gray-900">{item.mainName}</div>
                           </td>
                           <td className="px-4 py-3 text-gray-600 hidden sm:table-cell max-w-[200px] truncate">
                             {item.subText}
                           </td>
                           <td className="px-4 py-3 text-gray-600">
                             {item.hebrewDate}
                           </td>
                           <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                             {item.donorName ? (
                               <div className="flex items-center gap-2">
                                 {item.donorLogo && <img src={item.donorLogo} className="w-4 h-4 object-contain" alt="" />}
                                 <span className="truncate max-w-[120px]">{item.donorName}</span>
                               </div>
                             ) : '-'}
                           </td>
                           <td className="px-4 py-3">
                             <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => openEditForm(item)}
                                 className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                 title="ערוך"
                               >
                                 <Pencil size={16} />
                               </button>
                               <button 
                                 onClick={() => confirmDelete(item.id)}
                                 className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                 title="מחק"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Buttons (Only on items tabs) */}
      {activeTab !== 'settings' && (
        <div className="fixed bottom-6 left-6 flex flex-col sm:flex-row gap-3 z-40">
          <button 
            onClick={() => navigate("/display")} 
            className="bg-white text-gray-700 px-6 py-4 rounded-full shadow-2xl border border-gray-100 hover:bg-gray-50 hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-gray-200 active:scale-95 flex items-center gap-2 font-bold group"
          >
            <MonitorPlay size={24} className="text-lev-blue group-hover:scale-110 transition-transform" />
            <span>תצוגת מסך</span>
          </button>
          
          <button 
            onClick={openNewItemForm} 
            className="bg-lev-blue text-white px-6 py-4 rounded-full shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 flex items-center gap-2 font-bold group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>הוסף הקדשה</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;