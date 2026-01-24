import { useState, useEffect } from "react";
import { Plus, Trash2, LogOut, Heart, Pencil, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getHebrewDate } from "../utils/hebrewDate";
import { subscribeToItems, addItem, updateItem, deleteItem } from "../services/dataService";
import { STORAGE_KEYS, MOCK_DATA } from "../constants";

const AdminPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToItems((newItems) => {
      setItems(newItems);
    });
    return () => unsubscribe();
  }, []);

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
    console.log("[AdminPage] Logging out");
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (confirm("בטוח למחוק?")) {
      console.log(`[AdminPage] Deleting item ${id}`);
      try {
        await deleteItem(id);
        toast.error('ההקדשה נמחקה');
      } catch (error) {
        console.error("Failed to delete item:", error);
        toast.error('שגיאה במחיקת הפריט');
      }
    }
  };

  const handleEdit = (item) => {
    console.log(`[AdminPage] Opening edit form for item ${item.id}`);
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
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("[AdminPage] Saving item...");
    const finalSubText = newItem.subText || newItem.hebrewDate;
    const itemData = { ...newItem, subText: finalSubText };

    try {
      if (editId) {
        console.log(`[AdminPage] Updating existing item ${editId}`);
        await updateItem(editId, itemData, imageFile);
      } else {
        console.log("[AdminPage] Creating new item");
        await addItem(itemData, imageFile);
      }
      toast.success('ההקדשה נשמרה בהצלחה!');
      closeForm();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error('שגיאה בשמירת הפריט');
    }
  };

  const closeForm = () => {
    console.log("[AdminPage] Closing form");
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
    setImageFile(null);
    setIsFormOpen(false);
  };

  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const hebrewVal = getHebrewDate(dateVal);
    setNewItem({ ...newItem, date: dateVal, hebrewDate: hebrewVal });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-admin">
      <header className="bg-lev-burgundy text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Heart size={20} fill="white" /> ניהול לב חב"ד
        </h1>
        <div className="flex gap-2">
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
                  {item.hebrewDate && <span className="text-xs text-gray-600 font-medium">{item.hebrewDate}</span>}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{item.mainName}</h3>
                <p className="text-gray-700 text-sm">{item.subText}</p>
                {item.donorName && <p className="text-xs text-blue-700 mt-1 font-medium">תורם: {item.donorName}</p>}
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
                <label className="block text-sm text-gray-800 font-medium mb-1">סוג אירוע</label>
                <select className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900" value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
                  <option value="memorial">לזיכרון (נר)</option>
                  <option value="birthday">יום הולדת (בלונים)</option>
                  <option value="healing">לרפואה (דופק)</option>
                </select>
              </div>

              {/* טקסטים עליונים */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-800 font-medium mb-1">כותרת עליונה</label>
                  <input className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900 placeholder:text-gray-400" value={newItem.footerText} onChange={(e) => setNewItem({ ...newItem, footerText: e.target.value })} placeholder="למשל: פעילות קפיטריית..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-800 font-medium mb-1">כותרת ההקדשה</label>
                  <input className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900 placeholder:text-gray-400" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="למשל: מוקדשת ל..." />
                </div>
              </div>

              {/* תאריכים */}
              <div>
                <label className="block text-sm text-gray-800 font-medium mb-1">תאריך</label>
                <div className="flex gap-2">
                  <input type="date" className="w-1/3 p-3 bg-gray-50 rounded-lg border text-gray-900" value={newItem.date} onChange={handleDateChange} />
                  <input placeholder="עברי" className="w-2/3 p-3 bg-gray-50 rounded-lg border text-lev-blue font-medium placeholder:text-gray-400" value={newItem.hebrewDate} onChange={(e) => setNewItem({ ...newItem, hebrewDate: e.target.value })} />
                </div>
              </div>

              {/* פרטי שם */}
              <div>
                <label className="block text-sm text-gray-800 font-medium mb-1">שם מלא</label>
                <input required className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900" value={newItem.mainName} onChange={(e) => setNewItem({ ...newItem, mainName: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm text-gray-800 font-medium mb-1">טקסט נוסף (ז"ל / שתחי')</label>
                <input className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900" value={newItem.subText} onChange={(e) => setNewItem({ ...newItem, subText: e.target.value })} />
              </div>

              {/* פרטי תורם */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-bold text-gray-800 mb-2">פרטי תורם (אופציונלי)</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 font-medium mb-1">שם התורם</label>
                    <input className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900 placeholder:text-gray-400" value={newItem.donorName} onChange={(e) => setNewItem({ ...newItem, donorName: e.target.value })} placeholder="למשל: משפחת כהן" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 font-medium mb-1 flex items-center gap-1"><ImageIcon size={12} /> לוגו תורם (URL או העלאה)</label>

                    {/* אפשרות 1: הדבקת קישור */}
                    <input
                      className="w-full p-3 bg-gray-50 rounded-lg border text-left ltr mb-2 text-gray-900 placeholder:text-gray-400"
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
                              setImageFile(file);
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