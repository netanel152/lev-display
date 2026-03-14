import { useState, useEffect, useMemo } from "react";
import {
  Plus, LogOut, Flame, HeartPulse, Cake, Star, Settings,
  Pencil, Trash2, Search, Save, MonitorPlay, HandHeart, StickyNote, PartyPopper
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { subscribeToItems, addItem, updateItem, deleteItem, subscribeToSettings, updateSettings } from "../services/dataService";
import { logout } from "../services/authService";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "../constants";
import { getYearHolidays } from "../utils/hebrewDate";
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
      toast.error('שגיאה בשמירת ההגדרות');
    }
  };

  const confirmDelete = (id) => {
    // Prevent deleting built-in holidays
    if (id && id.toString().startsWith('builtin-')) {
      toast.error('לא ניתן למחוק חג מובנה. ניתן רק לערוך את הטקסט שלו.');
      return;
    }
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

  const openEditForm = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (data) => {
    try {
      if (editingItem && editingItem.id) {
        // If it was a built-in holiday, we "add" it as a new override item or update existing
        if (editingItem.id.toString().startsWith('builtin-')) {
          await addItem(data);
          toast.success('הגדרות החג נשמרו בהצלחה');
        } else {
          await updateItem(editingItem.id, data);
          toast.success('ההקדשה עודכנה בהצלחה');
        }
      } else {
        await addItem(data);
        toast.success('הקדשה חדשה נוספה בהצלחה');
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error('שגיאה בשמירת ההקדשה');
    }
  };

  const filteredItems = useMemo(() => {
    if (activeTab === 'settings') return [];
    
    let baseItems = items.filter(item => item.type === activeTab);

    if (activeTab === 'holiday') {
      const builtInHolidays = getYearHolidays();
      
      const merged = builtInHolidays.map(builtin => {
        const override = baseItems.find(manual => 
          manual.mainName === builtin.mainName && 
          manual.hebrewDate === builtin.hebrewDate
        );
        return override || builtin;
      });

      const extraManual = baseItems.filter(manual => 
        !builtInHolidays.some(builtin => 
          builtin.mainName === manual.mainName && 
          builtin.hebrewDate === manual.hebrewDate
        )
      );

      baseItems = [...merged, ...extraManual].sort((a, b) => 
        new Date(a.gregorianDateString || a.date) - new Date(b.gregorianDateString || b.date)
      );
    } else {
      baseItems.sort((a, b) => new Date(b.createdAt?.seconds || 0) - new Date(a.createdAt?.seconds || 0));
    }

    return baseItems;
  }, [items, activeTab]);

  const tabs = [
    { id: 'memorial', label: 'לעילוי נשמת', icon: Flame, color: 'text-orange-600', activeColor: 'bg-orange-100 text-orange-700' },
    { id: 'healing', label: 'לרפואה', icon: HeartPulse, color: 'text-emerald-600', activeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'birthday', label: 'יום הולדת', icon: Cake, color: 'text-pink-600', activeColor: 'bg-pink-100 text-pink-700' },
    { id: 'success', label: 'להצלחה', icon: Star, color: 'text-blue-600', activeColor: 'bg-blue-100 text-blue-700' },
    { id: 'holiday', label: 'חגים', icon: PartyPopper, color: 'text-orange-600', activeColor: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 font-admin flex flex-col" dir="rtl">
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="מחיקת הקדשה"
        message="האם אתה בטוח שברצונך למחוק הקדשה זו? פעולה זו אינה ניתנת לביטול."
      />

      {isFormOpen && (
        <AdminItemForm
          initialData={editingItem}
          isEditing={!!(editingItem && editingItem.id && !editingItem.id.toString().startsWith('builtin-'))}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveItem}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-lev-burgundy rounded-xl flex items-center justify-center shadow-lg shadow-lev-burgundy/20">
              <span className="text-white font-black text-xl">לב</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-none">מערכת ניהול - לב חב"ד</h1>
              <p className="text-xs md:text-sm text-gray-500 font-bold mt-1">פאנל שליטה בתצוגה הדיגיטלית</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/display")}
              className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-lev-blue hover:bg-blue-50 rounded-xl transition font-bold text-sm md:text-base border border-blue-100"
            >
              <MonitorPlay size={18} />
              <span className="hidden sm:inline">צפה בתצוגה</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-sm md:text-base border border-red-100"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">התנתק</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 shrink-0 space-y-2">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">ניהול תוכן / בחר קטגוריה</h2>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-2 scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold whitespace-nowrap min-w-fit flex-1 lg:flex-none ${isActive ? tab.activeColor + ' shadow-md scale-[1.02]' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Icon size={20} className={isActive ? tab.color : 'text-gray-400'} />
                    {tab.label}
                    {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-current hidden lg:block" />}
                  </button>
                );
              })}
              <div className="h-px bg-gray-200 my-2 hidden lg:block" />
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold whitespace-nowrap min-w-fit flex-1 lg:flex-none ${activeTab === 'settings' ? 'bg-gray-800 text-white shadow-md scale-[1.02]' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
              >
                <Settings size={20} className={activeTab === 'settings' ? 'text-gray-300' : 'text-gray-400'} />
                הגדרות מערכת
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'settings' ? (
              <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">הגדרות מערכת</h2>
                    <p className="text-sm text-gray-500 font-bold mt-0.5">ניהול פרטי תצוגה גלובליים</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">טקסט ספונסרים (בתחתית המסך)</label>
                      <input
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold"
                        value={localSettings.sponsorsText || ""}
                        onChange={(e) => handleLocalSettingChange('sponsorsText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">זמן הצגה לכל שקופית (בשניות)</label>
                      <input
                        type="number"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold"
                        value={localSettings.slideDuration || 0}
                        onChange={(e) => handleLocalSettingChange('slideDuration', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">קישור לתרומות (QR Code)</label>
                      <input
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold ltr"
                        value={localSettings.donationUrl || ""}
                        onChange={(e) => handleLocalSettingChange('donationUrl', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">טלפון ליצירת קשר</label>
                      <input
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold ltr"
                        value={localSettings.contactPhone || ""}
                        onChange={(e) => handleLocalSettingChange('contactPhone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">דוא"ל ליצירת קשר</label>
                      <input
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold ltr"
                        value={localSettings.contactEmail || ""}
                        onChange={(e) => handleLocalSettingChange('contactEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50/50 rounded-3xl border-2 border-lev-blue/10 border-dashed">
                      <h3 className="text-sm font-black text-lev-blue uppercase tracking-wider mb-4">הגדרות שקופית ברירת מחדל (כשאין הקדשות בתאריך הנוכחי)</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">כותרת עליונה</label>
                          <input
                            className="w-full p-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold"
                            value={localSettings.defaultSlideTitle || ""}
                            onChange={(e) => handleLocalSettingChange('defaultSlideTitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">שם מרכזי</label>
                          <input
                            className="w-full p-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold"
                            value={localSettings.defaultSlideMainName || ""}
                            onChange={(e) => handleLocalSettingChange('defaultSlideMainName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">טקסט משני</label>
                          <input
                            className="w-full p-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold"
                            value={localSettings.defaultSlideSubText || ""}
                            onChange={(e) => handleLocalSettingChange('defaultSlideSubText', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">טקסט תחתון</label>
                          <input
                            className="w-full p-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-lev-blue outline-none transition-all font-bold"
                            value={localSettings.defaultSlideFooterText || ""}
                            onChange={(e) => handleLocalSettingChange('defaultSlideFooterText', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex justify-end">
                  <button
                    onClick={saveSettings}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <Save size={20} />
                    שמור הגדרות מערכת
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-gray-900">
                    {tabs.find(t => t.id === activeTab)?.label}
                    <span className="text-sm font-bold text-gray-400 mr-2">({filteredItems.length})</span>
                  </h2>
                  {activeTab !== 'holiday' && (
                    <button
                      onClick={() => {
                        setEditingItem({ type: activeTab });
                        setIsFormOpen(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-lev-blue text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                      <Plus size={20} />
                      הוסף הקדשה חדשה
                    </button>
                  )}
                </div>

                {filteredItems.length === 0 ? (
                  <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">לא נמצאו הקדשות</h3>
                    <p className="text-gray-500 mt-2 font-bold">לחץ על הכפתור למעלה כדי להוסיף הקדשה חדשה לקטגוריה זו</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b">
                          <th className="px-4 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">שם ותיאור</th>
                          <th className="px-4 py-4 font-black text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">פרטים נוספים</th>
                          <th className="px-4 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">תאריך</th>
                          <th className="px-4 py-4 font-black text-gray-400 text-xs uppercase tracking-wider text-left">פעולות</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredItems.map(item => {
                          const expiry = item.expirationTimestamp?.seconds ? new Date(item.expirationTimestamp.seconds * 1000) : item.expirationTimestamp;
                          const isExpired = expiry && expiry < new Date();
                          const isBuiltIn = item.id && item.id.toString().startsWith('builtin-');

                          return (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="font-bold text-gray-900 text-sm md:text-base">{item.mainName}</div>
                                  {isBuiltIn && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-bold shrink-0">מובנה</span>}
                                  {item.notes && <StickyNote size={14} className="text-blue-500 shrink-0" title="יש הערות" />}
                                </div>
                                <div className="text-[10px] text-gray-400 sm:hidden truncate max-w-[120px]">{item.subText}</div>
                              </td>
                              <td className="px-4 py-4 text-gray-500 text-sm hidden md:table-cell max-w-[150px] lg:max-w-[250px] truncate font-medium italic">
                                {item.subText || '-'}
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm font-bold text-gray-700">{item.hebrewDate || '-'}</div>
                                <div className="text-[10px] text-gray-400">
                                  {item.gregorianDateString ? item.gregorianDateString.split('-').reverse().join('-') : '-'}
                                </div>
                                {expiry && (
                                  <div className="mt-1">
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${isExpired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                      {isExpired ? 'פג תוקף' : 'פעיל'}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-1 md:gap-2">
                                  <button
                                    onClick={() => openEditForm(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                                    title="ערוך"
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  {!isBuiltIn && (
                                    <button
                                      onClick={() => confirmDelete(item.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                      title="מחק"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
