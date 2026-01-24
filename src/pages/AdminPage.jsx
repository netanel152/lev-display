import React, { useState, useEffect } from "react";
import { Plus, Trash2, LogOut, Heart, Pencil, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getHebrewDate } from "../utils/hebrewDate";
import oneTouchLogo from "../assets/onetouch-logo.svg";

const DEFAULT_ITEMS = [
  {
    id: 1,
    type: "memorial",
    mainName: "אברהם זערור",
    subText: 'בן אפרים ז"ל',
    hebrewDate: 'כ"ה בתשרי תשפ"ד',
    notes: 'ת.נ.צ.ב.ה',
    donorName: "One Touch",
    donorLogo: oneTouchLogo,
  },
  {
    id: 2,
    type: "birthday",
    mainName: "חיים מושקא",
    subText: "שתחי׳ - בת 5",
    footerText: 'באהבה ממשפחת לב חב"ד',
  },
  {
    id: 3,
    type: "healing",
    mainName: "ישראל בן שרה",
    subText: "לרפואה שלמה וקרובה",
    footerText: 'פעילות קפיטריית החסד לב חב"ד',
  },
];

const AdminPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("displayItems");
    if (saved) return JSON.parse(saved);
    return DEFAULT_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem("displayItems", JSON.stringify(items));
  }, [items]);

  const handleRestoreDefaults = () => {
    if (confirm("האם לשחזר את נתוני הדוגמה? זה ימחק את הרשימה הנוכחית.")) {
      setItems(DEFAULT_ITEMS);
    }
  };

  const [newItem, setNewItem] = useState({
    type: "memorial",
    mainName: "",
    subText: "",
    date: "",
    hebrewDate: "",
    notes: "",
    donorName: "",
    donorLogo: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleDelete = (id) => {
    if (confirm("בטוח למחוק?")) {
      setItems(items.filter((item) => item.id !== id));
      toast.error('ההקדשה נמחקה');
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      type: item.type,
      mainName: item.mainName,
      subText: item.subText,
      date: item.date || "",
      hebrewDate: item.hebrewDate || "",
      notes: item.notes || "",
      donorName: item.donorName || "",
      donorLogo: item.donorLogo || "",
      title: item.title || "",
      footerText: item.footerText || "",
    });
    setEditId(item.id);
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const finalSubText = newItem.subText || newItem.hebrewDate;

    if (editId) {
      setItems(items.map(item =>
        item.id === editId
          ? { ...newItem, subText: finalSubText, id: editId }
          : item
      ));
    } else {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      setItems([...items, { ...newItem, subText: finalSubText, id: newId }]);
    }
    toast.success('ההקדשה נשמרה בהצלחה!');
    closeForm();
  };

  const closeForm = () => {
    setNewItem({
      type: "memorial",
      mainName: "",
      subText: "",
      date: "",
      hebrewDate: "",
      notes: "",
      donorName: "",
      donorLogo: "",
      title: "",
      footerText: "",
    });
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const hebrewVal = getHebrewDate(dateVal);
    setNewItem({ ...newItem, date: dateVal, hebrewDate: hebrewVal });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <header className="bg-lev-burgundy text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Heart size={20} fill="white" /> ניהול לב חב"ד
        </h1>
        <div className="flex gap-2">
          <button onClick={handleRestoreDefaults} className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 flex items-center gap-1" title="שחזר נתוני דוגמה">
            <RotateCcw size={16} />
          </button>
          <button onClick={handleLogout} className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 flex items-center gap-1">
            <LogOut size={16} /> יציאה
          </button>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              {item.donorLogo && (
                <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                  <img src={item.donorLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === "memorial" ? "bg-orange-100 text-orange-700" : item.type === "birthday" ? "bg-pink-100 text-pink-700" : "bg-green-100 text-green-700"}`}>
                    {item.type === "memorial" ? "זיכרון" : item.type === "birthday" ? "יום הולדת" : "רפואה"}
                  </span>
                  {item.hebrewDate && <span className="text-xs text-gray-400">{item.hebrewDate}</span>}
                </div>
                <h3 className="font-bold text-lg">{item.mainName}</h3>
                <p className="text-gray-500 text-sm">{item.subText}</p>
                {item.donorName && <p className="text-xs text-blue-600 mt-1">תורם: {item.donorName}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-full"><Pencil size={20} /></button>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setIsFormOpen(true)} className="fixed bottom-6 left-6 bg-lev-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"><Plus size={28} /></button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editId ? "עריכת הקדשה" : "הוספת הקדשה חדשה"}</h2>
            <form onSubmit={handleSave} className="space-y-4">

              <div>
                <label className="block text-sm text-gray-600 mb-1">סוג אירוע</label>
                <select className="w-full p-3 bg-gray-50 rounded-lg border" value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
                  <option value="memorial">לזיכרון (נר)</option>
                  <option value="birthday">יום הולדת (בלונים)</option>
                  <option value="healing">לרפואה (דופק)</option>
                </select>
              </div>

              {/* טקסטים עליונים */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">כותרת עליונה</label>
                  <input className="w-full p-3 bg-gray-50 rounded-lg border" value={newItem.footerText} onChange={(e) => setNewItem({ ...newItem, footerText: e.target.value })} placeholder="למשל: פעילות קפיטריית..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">כותרת ההקדשה</label>
                  <input className="w-full p-3 bg-gray-50 rounded-lg border" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="למשל: מוקדשת ל..." />
                </div>
              </div>

              {/* תאריכים */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">תאריך</label>
                <div className="flex gap-2">
                  <input type="date" className="w-1/3 p-3 bg-gray-50 rounded-lg border" value={newItem.date} onChange={handleDateChange} />
                  <input placeholder="עברי" className="w-2/3 p-3 bg-gray-50 rounded-lg border text-lev-blue" value={newItem.hebrewDate} onChange={(e) => setNewItem({ ...newItem, hebrewDate: e.target.value })} />
                </div>
              </div>

              {/* פרטי שם */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">שם מלא</label>
                <input required className="w-full p-3 bg-gray-50 rounded-lg border" value={newItem.mainName} onChange={(e) => setNewItem({ ...newItem, mainName: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">טקסט נוסף (ז"ל / שתחי')</label>
                <input className="w-full p-3 bg-gray-50 rounded-lg border" value={newItem.subText} onChange={(e) => setNewItem({ ...newItem, subText: e.target.value })} />
              </div>

              {/* פרטי תורם */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-bold text-gray-700 mb-2">פרטי תורם (אופציונלי)</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">שם התורם</label>
                    <input className="w-full p-3 bg-gray-50 rounded-lg border" value={newItem.donorName} onChange={(e) => setNewItem({ ...newItem, donorName: e.target.value })} placeholder="למשל: משפחת כהן" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1"><ImageIcon size={12} /> לוגו תורם (URL או העלאה)</label>

                    {/* אפשרות 1: הדבקת קישור */}
                    <input
                      className="w-full p-3 bg-gray-50 rounded-lg border text-left ltr mb-2"
                      value={newItem.donorLogo}
                      onChange={(e) => setNewItem({ ...newItem, donorLogo: e.target.value })}
                      placeholder="https://..."
                    />

                    {/* אפשרות 2: העלאת קובץ */}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                        <ImageIcon size={16} />
                        העלה לוגו
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewItem({ ...newItem, donorLogo: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {newItem.donorLogo && (
                        <div className="text-xs text-green-600 font-bold">
                          לוגו נבחר!
                        </div>
                      )}
                    </div>

                    {/* תצוגה מקדימה של הלוגו אם קיים */}
                    {newItem.donorLogo && (
                      <div className="mt-2 p-2 border rounded-lg bg-white inline-block">
                        <img src={newItem.donorLogo} alt="Preview" className="h-12 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={closeForm} className="flex-1 py-3 text-gray-500 font-bold">ביטול</button>
                <button type="submit" className="flex-1 py-3 bg-lev-blue text-white rounded-lg font-bold">שמור</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;