import { useState, useEffect, useMemo } from "react";
import {
  Plus, LogOut, Flame, HeartPulse, Cake, Star, Settings,
  Pencil, Trash2, Search, Save, MonitorPlay, HandHeart, StickyNote
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { subscribeToItems, addItem, updateItem, deleteItem, subscribeToSettings, updateSettings } from "../services/dataService";
import { logout } from "../services/authService";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "../constants";
import ConfirmModal from "../components/ConfirmModal";
import AdminItemForm from "../components/AdminItemForm";

const AdminPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({ ...DEFAULT_SETTINGS });

  const [localSettings, setLocalSettings] = useState({ ...DEFAULT_SETTINGS });
  const [activeTab, setActiveTab] = useState('memorial');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsubscribeItems = subscribeToItems(setItems);
    const unsubscribeSettings = subscribeToSettings((newSettings) => {
      if (newSettings) {
        setGlobalSettings(prev => ({ ...prev, ...newSettings }));
        setLocalSettings(prev => ({ ...prev, ...newSettings }));
      }
    });
    return () => { unsubscribeItems(); unsubscribeSettings(); };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback
      localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
      navigate("/");
    }
  };

  const handleLocalSettingChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    try {
      const settingsToSave = { ...localSettings, slideDuration: Number(localSettings.slideDuration) };
      await updateSettings(settingsToSave);
      toast.success('הגדרות נשמרו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בשמירת הגדרות');
    }
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete);
      toast.success('ההקדשה נמחקה');
    } catch (error) {
      toast.error('שגיאה במחיקת הפריט');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openNewItemForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (formData, imageFile) => {
    const finalData = { ...formData };
    if (!editingItem && activeTab !== 'settings') {
      finalData.type = activeTab;
    }

    try {
      if (editingItem) {
        await updateItem(editingItem.id, finalData, imageFile);
      } else {
        await addItem(finalData, imageFile);
      }
      toast.success('ההקדשה נשמרה בהצלחה!');
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('שגיאה בשמירת הפריט');
    }
  };

  const filteredItems = useMemo(() => {
    if (activeTab === 'settings') return [];
    return items.filter(item => item.type === activeTab);
  }, [items, activeTab]);

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
          initialData={{ ...editingItem, type: editingItem?.type || (activeTab !== 'settings' ? activeTab : 'memorial') }}
          isEditing={!!editingItem}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-lev-burgundy text-white p-1.5 rounded-lg shadow-sm shrink-0">
              <Settings size={18} />
            </div>
            <span className="truncate">ניהול מערכת לב חב"ד</span>
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all font-bold text-sm"
          >
            <LogOut size={18} className="transform scale-x-[-1]" />
            <span className="hidden sm:inline">התנתק</span>
          </button>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="max-w-7xl mx-auto px-4 pt-4 border-t">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">ניהול תוכן / בחר קטגוריה</h2>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap font-bold text-xs md:text-sm border shrink-0
                    ${isActive
                      ? tab.activeColor + ' border-transparent shadow-sm'
                      : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-32">
        {activeTab === 'settings' ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="text-gray-400" size={20} /> הגדרות כלליות
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">זמן תצוגה (שניות)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="3" max="30" step="1"
                    value={localSettings.slideDuration / 1000}
                    onChange={(e) => handleLocalSettingChange('slideDuration', e.target.value * 1000)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lev-burgundy"
                  />
                  <span className="w-12 text-center font-mono font-bold text-lev-burgundy bg-lev-burgundy/5 py-1 rounded">
                    {localSettings.slideDuration / 1000}s
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">טלפון</label>
                  <input
                    type="text" value={localSettings.contactPhone}
                    onChange={(e) => handleLocalSettingChange('contactPhone', e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">אימייל</label>
                  <input
                    type="email" value={localSettings.contactEmail}
                    onChange={(e) => handleLocalSettingChange('contactEmail', e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">קישור לתרומה</label>
                <input
                  type="url" dir="ltr" value={localSettings.donationUrl}
                  onChange={(e) => handleLocalSettingChange('donationUrl', e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none font-mono text-sm"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MonitorPlay size={16} className="text-lev-burgundy" /> תוכן הקדשה ברירת מחדל (כשאין הקדשות באותו יום)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">כותרת עליונה</label>
                    <input
                      type="text" value={localSettings.defaultSlideTitle}
                      onChange={(e) => handleLocalSettingChange('defaultSlideTitle', e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">שם מרכזי</label>
                    <input
                      type="text" value={localSettings.defaultSlideMainName}
                      onChange={(e) => handleLocalSettingChange('defaultSlideMainName', e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">תיאור / סאב-טקסט</label>
                    <input
                      type="text" value={localSettings.defaultSlideSubText}
                      onChange={(e) => handleLocalSettingChange('defaultSlideSubText', e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">טקסט תחתון (פוטר)</label>
                    <input
                      type="text" value={localSettings.defaultSlideFooterText}
                      onChange={(e) => handleLocalSettingChange('defaultSlideFooterText', e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-lev-burgundy/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="w-full flex items-center justify-center gap-2 bg-lev-burgundy text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-lev-burgundy/20 mt-4"
              >
                <Save size={18} /> שמור הגדרות
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-end px-1">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                  {filteredItems.length} פריטים רשומים
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {filteredItems.length === 0 ? (
                <div className="py-20 text-center text-gray-300 flex flex-col items-center gap-4">
                  <Search size={48} className="opacity-10" />
                  <p className="font-medium">אין הקדשות בקטגוריה זו</p>
                  <button onClick={openNewItemForm} className="text-lev-burgundy font-bold hover:underline">הוסף את הראשונה</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-tighter md:tracking-widest">
                        <th className="px-4 py-4">שם</th>
                        <th className="px-4 py-4 hidden sm:table-cell">תיאור</th>
                        <th className="px-4 py-4">תאריך</th>
                        <th className="px-4 py-4 hidden md:table-cell">תוקף</th>
                        <th className="px-4 py-4 text-center">פעולות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredItems.map(item => {
                        const expiry = item.expirationTimestamp;
                        let expiryText = "ללא תוקף";
                        if (expiry) {
                          const date = expiry.seconds ? new Date(expiry.seconds * 1000) : new Date(expiry);
                          expiryText = date.toLocaleDateString('he-IL');
                        }

                        return (
                          <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-gray-900 text-sm md:text-base">{item.mainName}</div>
                                {item.donorName && <HandHeart size={14} className="text-lev-burgundy shrink-0" title="יש פרטי תורם" />}
                                {item.notes && <StickyNote size={14} className="text-blue-500 shrink-0" title="יש הערות" />}
                              </div>
                              <div className="text-[10px] text-gray-400 sm:hidden truncate max-w-[120px]">{item.subText}</div>
                            </td>
                            <td className="px-4 py-4 text-gray-500 text-sm hidden sm:table-cell max-w-[150px] lg:max-w-[250px] truncate">
                              {item.subText}
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-xs md:text-sm font-medium text-gray-700">{item.hebrewDate}</div>
                              <div className="text-[10px] text-gray-400">{item.gregorianDateString || '-'}</div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${expiry ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                {expiryText}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => openEditForm(item)} className="p-2 text-gray-400 hover:text-lev-burgundy hover:bg-lev-burgundy/5 rounded-lg transition-all">
                                  <Pencil size={16} />
                                </button>
                                <button onClick={() => confirmDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile-Friendly Floating Footer Actions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 w-full max-w-lg z-40">
        <button
          onClick={() => navigate("/display")}
          className="flex-1 bg-white text-gray-700 h-14 rounded-2xl shadow-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-bold group"
        >
          <MonitorPlay size={20} className="text-lev-burgundy group-hover:scale-110 transition-transform" />
          <span className="text-sm">למסך התצוגה</span>
        </button>

        <button
          onClick={openNewItemForm}
          className="flex-[2] bg-lev-burgundy text-white h-14 rounded-2xl shadow-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 font-bold group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm">הוסף הקדשה</span>
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
