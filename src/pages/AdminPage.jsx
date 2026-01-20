import React, { useState } from "react";
import { Plus, Trash2, LogOut, Heart, Calendar, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHebrewDate } from "../utils/hebrewDate"; // היבוא החדש שלנו

const AdminPage = () => {
  const navigate = useNavigate();

  // הוספנו שדה date ו-hebrewDate לנתונים
  const [items, setItems] = useState([
    {
      id: 1,
      type: "memorial",
      mainName: "אברהם זערור",
      subText: 'בן אפרים ז"ל',
      hebrewDate: 'כ"ה בתשרי תשפ"ד',
      date: "",
      notes: "",
    },
  ]);

  const [newItem, setNewItem] = useState({
    type: "memorial",
    mainName: "",
    subText: "",
    date: "", // התאריך הלועזי (נשמר למערכת)
    hebrewDate: "", // התאריך העברי (לתצוגה)
    notes: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleDelete = (id) => {
    if (confirm("בטוח למחוק?")) {
      setItems(items.filter((item) => item.id !== id));
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
    });
    setEditId(item.id);
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // אם המשתמש לא כתב טקסט משני, נשתמש בתאריך העברי
    const finalSubText = newItem.subText || newItem.hebrewDate;

    if (editId) {
      // מצב עריכה
      setItems(items.map(item => 
        item.id === editId 
          ? { ...newItem, subText: finalSubText, id: editId } 
          : item
      ));
    } else {
      // מצב הוספה
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      setItems([...items, { ...newItem, subText: finalSubText, id: newId }]);
    }

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
    });
    setEditId(null);
    setIsFormOpen(false);
  };

  // פונקציה שמחשבת עברית ברגע שבוחרים תאריך לועזי
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const hebrewVal = getHebrewDate(dateVal);
    setNewItem({
      ...newItem,
      date: dateVal,
      hebrewDate: hebrewVal,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-lev-burgundy text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Heart size={20} fill="white" /> ניהול לב חב"ד
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 flex items-center gap-1"
        >
          <LogOut size={16} /> יציאה
        </button>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${item.type === "memorial" ? "bg-orange-100 text-orange-700" : item.type === "birthday" ? "bg-pink-100 text-pink-700" : "bg-green-100 text-green-700"}`}
                >
                  {item.type === "memorial"
                    ? "זיכרון"
                    : item.type === "birthday"
                      ? "יום הולדת"
                      : "רפואה"}
                </span>
                {/* הצגת התאריך העברי ברשימה אם קיים */}
                {item.hebrewDate && (
                  <span className="text-xs text-gray-400">
                    {item.hebrewDate}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg">{item.mainName}</h3>
              <p className="text-gray-500 text-sm">{item.subText}</p>
              {item.notes && (
                <p className="text-xs text-blue-500 mt-1 italic">
                  הערה: {item.notes}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 p-2 hover:bg-blue-50 rounded-full"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 p-2 hover:bg-red-50 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 left-6 bg-lev-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <Plus size={28} />
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "עריכת הקדשה" : "הוספת הקדשה חדשה"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  סוג אירוע
                </label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-lg border"
                  value={newItem.type}
                  onChange={(e) =>
                    setNewItem({ ...newItem, type: e.target.value })
                  }
                >
                  <option value="memorial">לזיכרון (נר)</option>
                  <option value="birthday">יום הולדת (בלונים)</option>
                  <option value="healing">לרפואה (דופק)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  תאריך האירוע (פטירה/יום הולדת)
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-1/3 p-3 bg-gray-50 rounded-lg border"
                    value={newItem.date}
                    onChange={handleDateChange}
                  />
                  {/* שדה לתאריך העברי שמחושב אוטומטית אבל ניתן לעריכה */}
                  <input
                    placeholder="התאריך העברי (מחושב אוטומטית)"
                    className="w-2/3 p-3 bg-gray-50 rounded-lg border font-bold text-lev-blue"
                    value={newItem.hebrewDate}
                    onChange={(e) =>
                      setNewItem({ ...newItem, hebrewDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  שם מלא
                </label>
                <input
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border"
                  value={newItem.mainName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, mainName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  טקסט נוסף (ז"ל / שתחי' / בן פלוני)
                </label>
                <input
                  className="w-full p-3 bg-gray-50 rounded-lg border"
                  value={newItem.subText}
                  onChange={(e) =>
                    setNewItem({ ...newItem, subText: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  הערות נוספות (לתצוגה)
                </label>
                <textarea
                  className="w-full p-3 bg-gray-50 rounded-lg border h-20 resize-none"
                  value={newItem.notes}
                  onChange={(e) =>
                    setNewItem({ ...newItem, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-3 text-gray-500 font-bold"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-lev-blue text-white rounded-lg font-bold"
                >
                  שמור
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
