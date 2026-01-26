import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import PreviewModal from './PreviewModal';
import { getHebrewDate } from '../utils/hebrewDate';

const AdminItemForm = ({ onClose, onSave, initialData, isEditing }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        type: initialData.type || "memorial",
        mainName: initialData.mainName || "",
        subText: initialData.subText || "",
        date: initialData.date || "",
        hebrewDate: initialData.hebrewDate || "",
        notes: initialData.notes || "",
        donorName: initialData.donorName || "",
        donorLogo: initialData.donorLogo || "",
        title: initialData.title || "",
        footerText: initialData.footerText || "",
      };
    }
    return {
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
    };
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const hebrewDate = getHebrewDate(newDate);
    setFormData(prev => ({ ...prev, date: newDate, hebrewDate }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("donorLogo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, imageFile);
  };

  return (
    <>
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
      />

      <div
        className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{isEditing ? "עריכת הקדשה" : "הוספת הקדשה חדשה"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm text-gray-800 font-medium mb-1">סוג אירוע</label>
              <select
                className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="memorial">לזיכרון (נר)</option>
                <option value="birthday">יום הולדת (בלונים)</option>
                <option value="healing">לרפואה (דופק)</option>
              </select>
            </div>

            {/* Top Texts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-800 font-medium mb-1">כותרת עליונה</label>
                <input
                  className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900 placeholder:text-gray-400"
                  value={formData.footerText}
                  onChange={(e) => handleChange("footerText", e.target.value)}
                  placeholder="למשל: פעילות קפיטריית..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-800 font-medium mb-1">כותרת ההקדשה</label>
                <input
                  className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900 placeholder:text-gray-400"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="למשל: מוקדשת ל..."
                />
              </div>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm text-gray-800 font-medium mb-1">תאריך</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-1/3 p-3 bg-gray-50 rounded-lg border text-gray-900"
                  value={formData.date}
                  onChange={handleDateChange}
                />
                <input
                  placeholder="עברי"
                  className="w-2/3 p-3 bg-gray-50 rounded-lg border text-lev-blue font-medium placeholder:text-gray-400"
                  value={formData.hebrewDate}
                  onChange={(e) => handleChange("hebrewDate", e.target.value)}
                />
              </div>
            </div>

            {/* Name Details */}
            <div>
              <label className="block text-sm text-gray-800 font-medium mb-1">שם מלא</label>
              <input
                required
                className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900"
                value={formData.mainName}
                onChange={(e) => handleChange("mainName", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-800 font-medium mb-1">טקסט נוסף (ז"ל / שתחי')</label>
              <input
                className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900"
                value={formData.subText}
                onChange={(e) => handleChange("subText", e.target.value)}
              />
            </div>

            {/* Donor Details */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-bold text-gray-800 mb-2">פרטי תורם (אופציונלי)</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 font-medium mb-1">שם התורם</label>
                  <input
                    className="w-full p-3 bg-gray-50 rounded-lg border text-gray-900 placeholder:text-gray-400"
                    value={formData.donorName}
                    onChange={(e) => handleChange("donorName", e.target.value)}
                    placeholder="למשל: משפחת כהן"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                    <ImageIcon size={12} /> לוגו תורם (URL או העלאה)
                  </label>

                  {/* URL Input */}
                  <input
                    className="w-full p-3 bg-gray-50 rounded-lg border text-left ltr mb-2 text-gray-900 placeholder:text-gray-400"
                    value={formData.donorLogo}
                    onChange={(e) => handleChange("donorLogo", e.target.value)}
                    placeholder="https://..."
                  />

                  {/* File Upload */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition w-full sm:w-auto justify-center">
                      <ImageIcon size={16} />
                      העלה לוגו
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {formData.donorLogo && (
                      <div className="text-xs text-green-600 font-bold">
                        לוגו נבחר!
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {formData.donorLogo && (
                    <div className="mt-2 p-2 border rounded-lg bg-white inline-block">
                      <img src={formData.donorLogo} alt="Preview" className="h-12 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex-none px-4 py-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-bold transition"
              >
                תצוגה מקדימה
              </button>
              <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold">ביטול</button>
              <button type="submit" className="flex-1 py-3 bg-lev-blue text-white rounded-lg font-bold">שמור</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminItemForm;
