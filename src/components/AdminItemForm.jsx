import { useState, useEffect } from "react";
import { ImageIcon, X } from "lucide-react";
import PreviewModal from "./PreviewModal";
import {
  HEBREW_DAYS,
  HEBREW_MONTHS,
  HEBREW_YEARS,
  getGregorianFromHebrew,
} from "../utils/hebrewDate";

const AdminItemForm = ({ onClose, onSave, initialData, isEditing }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Local state for Hebrew Date Picker
  const [hDay, setHDay] = useState("");
  const [hMonth, setHMonth] = useState("");
  const [hYear, setHYear] = useState("");

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        type: initialData.type || "memorial",
        mainName: initialData.mainName || "",
        subText: initialData.subText || "",
        date: initialData.date || "", // Gregorian string for sorting/auto-calc
        hebrewDate: initialData.hebrewDate || "", // Full string
        gregorianDateString: initialData.gregorianDateString || "", // Manual civil date
        displayDuration: initialData.displayDuration || "forever",
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
      gregorianDateString: "",
      displayDuration: "forever",
      notes: "",
      donorName: "",
      donorLogo: "",
      title: "",
      footerText: "",
    };
  });

  const [imageFile, setImageFile] = useState(null);

  // Initialize Hebrew Date picker defaults
  useEffect(() => {
    if (isEditing && initialData?.hebrewDate) {
      // Expected format: "ט' בתשרי תשפ"ה" or similar
      const parts = initialData.hebrewDate.split(" ");
      if (parts.length >= 3) {
        const d = parts[0];
        let m = parts[1];
        if (m.startsWith("ב")) m = m.substring(1);
        const y = parts[parts.length - 1];

        if (HEBREW_DAYS.includes(d)) setHDay(d);
        const foundMonth = HEBREW_MONTHS.find(
          (month) => month === m || m.includes(month),
        );
        if (foundMonth) setHMonth(foundMonth);

        // Find matching year including potentially slightly different quote chars
        const foundYear = HEBREW_YEARS.find(
          (year) =>
            year === y ||
            year.replace(/["'״]/g, "") === y.replace(/["'״]/g, ""),
        );
        if (foundYear) setHYear(foundYear);
      }
    } else if (!isEditing) {
      // Defaults for new item
      setHYear(HEBREW_YEARS[0]); // Current/Latest year
    }
  }, [isEditing, initialData]);

  // Update formData whenever date parts change
  useEffect(() => {
    if (hDay && hMonth && hYear) {
      const fullHebrewString = `${hDay} ב${hMonth} ${hYear}`;
      const gregDate = getGregorianFromHebrew(hDay, hMonth, hYear);
      const gregDateString = gregDate.toISOString().split("T")[0]; // YYYY-MM-DD

      setFormData((prev) => ({
        ...prev,
        hebrewDate: fullHebrewString,
        date: gregDateString,
      }));
    }
  }, [hDay, hMonth, hYear]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "type" && value === "success" && !prev.title) {
        newData.title = "להצלחת";
      }
      return newData;
    });
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

    let expirationTimestamp = null;
    if (formData.displayDuration !== "forever") {
      const now = new Date();
      if (formData.displayDuration === "1week") now.setDate(now.getDate() + 7);
      else if (formData.displayDuration === "2weeks")
        now.setDate(now.getDate() + 14);
      else if (formData.displayDuration === "1month")
        now.setMonth(now.getMonth() + 1);

      expirationTimestamp = now;
    }

    onSave({ ...formData, expirationTimestamp }, imageFile);
  };

  return (
    <>
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
      />

      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        dir="rtl"
      >
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b shrink-0">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "עריכת הקדשה" : "הוספת הקדשה חדשה"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <form
              id="item-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Left Column (Desktop) - Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    סוג אירוע
                  </label>
                  <select
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lev-blue/20 focus:border-lev-blue outline-none transition-all cursor-pointer"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="memorial">לזיכרון (נר)</option>
                    <option value="birthday">יום הולדת (בלונים)</option>
                    <option value="healing">לרפואה (דופק)</option>
                    <option value="success">להצלחה (כוכב)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      תאריך לועזי (ידני)
                    </label>
                    <input
                      type="date"
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lev-blue/20 focus:border-lev-blue outline-none transition-all cursor-pointer"
                      value={formData.gregorianDateString}
                      onChange={(e) =>
                        handleChange("gregorianDateString", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      משך תצוגה
                    </label>
                    <select
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lev-blue/20 focus:border-lev-blue outline-none transition-all cursor-pointer"
                      value={formData.displayDuration}
                      onChange={(e) =>
                        handleChange("displayDuration", e.target.value)
                      }
                    >
                      <option value="forever">
                        ללא הגבלה (לפי תאריך עברי)
                      </option>
                      <option value="1week">למשך שבוע</option>
                      <option value="2weeks">למשך שבועיים</option>
                      <option value="1month">למשך חודש</option>
                    </select>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    תאריך האירוע (עברי)
                  </label>
                  <div className="flex gap-3">
                    <div className="w-1/4">
                      <select
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-lev-blue/20 outline-none text-center"
                        value={hDay}
                        onChange={(e) => setHDay(e.target.value)}
                        required
                      >
                        <option value="">יום</option>
                        {HEBREW_DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/3">
                      <select
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-lev-blue/20 outline-none text-center"
                        value={hMonth}
                        onChange={(e) => setHMonth(e.target.value)}
                        required
                      >
                        <option value="">חודש</option>
                        {HEBREW_MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-lev-blue/20 outline-none text-center"
                        value={hYear}
                        onChange={(e) => setHYear(e.target.value)}
                        required
                      >
                        <option value="">שנה</option>
                        {HEBREW_YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.hebrewDate && (
                    <p className="text-sm text-lev-blue font-medium mt-3 text-center bg-blue-50 py-1 rounded">
                      {formData.hebrewDate}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      שם מלא (להצגה בגדול)
                    </label>
                    <input
                      required
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lev-blue/20 focus:border-lev-blue outline-none transition-all placeholder:text-gray-400"
                      value={formData.mainName}
                      onChange={(e) => handleChange("mainName", e.target.value)}
                      placeholder="למשל: מנחם מענדל כהן"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      טקסט נוסף (מתחת לשם)
                    </label>
                    <input
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lev-blue/20 focus:border-lev-blue outline-none transition-all placeholder:text-gray-400"
                      value={formData.subText}
                      onChange={(e) => handleChange("subText", e.target.value)}
                      placeholder="למשל: בן הרב פלוני ז”ל"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (Desktop) - Optional & Branding */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">
                      כותרת עליונה (מופיע בחלק העליון של השקופית)
                    </label>
                    <input
                      className="w-full p-4 md:p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-lev-blue/10 focus:border-lev-blue outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                      value={formData.footerText}
                      onChange={(e) =>
                        handleChange("footerText", e.target.value)
                      }
                      placeholder="למשל: לב חב״ד מאחלים"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">
                      כותרת ההקדשה (מעל השם המרכזי)
                    </label>
                    <input
                      className="w-full p-4 md:p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-lev-blue/10 focus:border-lev-blue outline-none transition-all text-lg font-medium placeholder:text-gray-300"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="למשל: לעילוי נשמת / לרפואת"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-200 border-dashed">
                  <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon size={18} className="text-lev-blue" />
                    מיתוג תורם (אופציונלי)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">
                        שם התורם / הקדשה
                      </label>
                      <input
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-lev-blue/20 outline-none"
                        value={formData.donorName}
                        onChange={(e) =>
                          handleChange("donorName", e.target.value)
                        }
                        placeholder="למשל: נתרם ע״י משפחת..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">
                        לוגו (קובץ או קישור)
                      </label>
                      <div className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-lev-blue/20 outline-none text-left ltr text-sm mb-2"
                            value={formData.donorLogo}
                            onChange={(e) =>
                              handleChange("donorLogo", e.target.value)
                            }
                            placeholder="https://..."
                          />
                          <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition w-full">
                            <ImageIcon size={16} />
                            בחר קובץ תמונה
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>

                        <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                          {formData.donorLogo ? (
                            <img
                              src={formData.donorLogo}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-300 text-center">
                              אין לוגו
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              תצוגה מקדימה
            </button>
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition"
            >
              ביטול
            </button>
            <button
              type="submit"
              form="item-form"
              className="px-8 py-3 bg-lev-blue text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              שמור שינויים
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminItemForm;
