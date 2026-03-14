import { useState, useEffect } from "react";
import { ImageIcon, X, Trash2, PartyPopper } from "lucide-react";
import PreviewModal from "./PreviewModal";
import { FIXED_TITLES } from "../constants";
import {
  HEBREW_DAYS,
  HEBREW_MONTHS,
  HEBREW_YEARS,
  getGregorianFromHebrew,
  CURRENT_HEBREW_YEAR,
} from "../utils/hebrewDate";

const AdminItemForm = ({ onClose, onSave, initialData, isEditing, isSaving = false }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Local state for Hebrew Date Picker
  const [hDay, setHDay] = useState("");
  const [hMonth, setHMonth] = useState("");
  const [hYear, setHYear] = useState("");

  const [formData, setFormData] = useState(() => {
    const baseData = initialData || {
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
      hidden: false,
      holidayOverride: "",
    };

    // Smart default: If it's a holiday, default to "during_holiday" duration
    const defaultDuration = baseData.type === 'holiday' ? "during_holiday" : (baseData.displayDuration || "forever");

    return {
      ...baseData,
      displayDuration: defaultDuration,
      title: baseData.title || FIXED_TITLES[baseData.type || "memorial"],
    };
  });

  const [imageFile, setImageFile] = useState(null);

  // Mapping of holidays to their traditional Hebrew dates (first day of holiday)
  const HOLIDAY_DATES = {
    "Chanukah": { day: "כ\"ה", month: "כסלו" },
    "Purim": { day: "י\"ד", month: "אדר" }, // Note: System handles Adar II logic if needed in utils
    "Pesach": { day: "ט\"ו", month: "ניסן" },
    "Shavuot": { day: "ו'", month: "סיוון" },
    "Rosh Hashana": { day: "א'", month: "תשרי" },
    "Sukkot": { day: "ט\"ו", month: "תשרי" }
  };

  // Auto-fill dates when a holiday is selected
  useEffect(() => {
    if (formData.type === 'holiday' && formData.holidayOverride && !isEditing) {
      const holidayInfo = HOLIDAY_DATES[formData.holidayOverride];
      if (holidayInfo) {
        setHDay(holidayInfo.day);
        setHMonth(holidayInfo.month);
        // Keep the current year as already set
      }
    }
  }, [formData.holidayOverride, formData.type]);

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
      // Defaults for new item - use exported current Hebrew year
      if (HEBREW_YEARS.includes(CURRENT_HEBREW_YEAR)) {
        setHYear(CURRENT_HEBREW_YEAR);
      } else {
        // Fallback to middle of list if for some reason current year isn't found
        setHYear(HEBREW_YEARS[Math.floor(HEBREW_YEARS.length / 2)]);
      }
    }
  }, [isEditing, initialData]);

  // Update formData whenever date parts change
  useEffect(() => {
    if (hDay && hMonth && hYear) {
      const fullHebrewString = `${hDay} ב${hMonth} ${hYear}`;
      const gregDate = getGregorianFromHebrew(hDay, hMonth, hYear);
      // Use en-CA to get YYYY-MM-DD in local time, matching DisplayPage logic
      const gregDateString = gregDate.toLocaleDateString('en-CA');

      setFormData((prev) => ({
        ...prev,
        hebrewDate: fullHebrewString,
        date: gregDateString,
        gregorianDateString: gregDateString,
      }));
    }
  }, [hDay, hMonth, hYear]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "type") {
        newData.title = FIXED_TITLES[value];
      }
      return newData;
    });
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Increased size for higher quality on high-res displays
          const MAX_SIZE = 1024;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          // Ensure smooth scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Best Practice for Logos: 
          // 1. If the source is PNG, keep it PNG to preserve transparency (alpha channel).
          // 2. If it's a photo (JPEG/other), use high-quality JPEG.
          let compressedBase64;
          if (file.type === "image/png" || file.type === "image/svg+xml") {
            compressedBase64 = canvas.toDataURL("image/png");

            // Safety check: If PNG is still too large (> 800KB), convert to high-quality JPEG
            if (compressedBase64.length > 800000) {
              compressedBase64 = canvas.toDataURL("image/jpeg", 0.9);
            }
          } else {
            // Increased quality to 0.9 for better sharpness and fewer artifacts
            compressedBase64 = canvas.toDataURL("image/jpeg", 0.9);
          }

          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        handleChange("donorLogo", compressedBase64);
        setImageFile(file);
      } catch (error) {
        console.error("Compression error:", error);
        const reader = new FileReader();
        reader.onloadend = () => {
          handleChange("donorLogo", reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let expirationTimestamp = null;
    if (formData.displayDuration !== "forever") {
      const now = new Date();
      
      if (formData.displayDuration === "during_holiday" && formData.durationDays) {
        // Set expiration to start date + holiday duration
        const startDate = new Date(formData.gregorianDateString || formData.date);
        startDate.setDate(startDate.getDate() + formData.durationDays);
        startDate.setHours(23, 59, 59, 999);
        expirationTimestamp = startDate;
      } else if (formData.displayDuration === "24hours") {
        now.setHours(23, 59, 59, 999);
        expirationTimestamp = now;
      } else if (formData.displayDuration === "1week") {
        now.setDate(now.getDate() + 7);
        expirationTimestamp = now;
      } else if (formData.displayDuration === "2weeks") {
        now.setDate(now.getDate() + 14);
        expirationTimestamp = now;
      } else if (formData.displayDuration === "1month") {
        now.setMonth(now.getMonth() + 1);
        expirationTimestamp = now;
      }
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 font-admin"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        dir="rtl"
      >
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className={`flex justify-between items-center p-6 border-b shrink-0 ${formData.type === 'holiday' ? 'bg-orange-50/50' : ''}`}>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? (formData.type === 'holiday' ? "עריכת חג" : "עריכת הקדשה") : (formData.type === 'holiday' ? "הוספת חג חדש" : "הוספת הקדשה חדשה")}
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
                {formData.type !== 'holiday' && (
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">
                      סוג אירוע
                    </label>
                    <select
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-lev-blue/10 focus:border-lev-blue outline-none transition-all cursor-pointer font-medium text-gray-800"
                      value={formData.type || "memorial"}
                      onChange={(e) => handleChange("type", e.target.value)}
                    >
                      <option value="memorial">לזיכרון</option>
                      <option value="birthday">יום הולדת</option>
                      <option value="healing">לרפואה</option>
                      <option value="success">להצלחה</option>
                    </select>
                  </div>
                )}

                {formData.type === "holiday" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-base font-bold text-orange-900 mb-2">
                      בחירת חג (עבור העיטורים בפינות)
                    </label>
                    <select
                      className="w-full p-4 bg-white border-2 border-orange-300 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all cursor-pointer font-black text-orange-900 shadow-sm"
                      value={formData.holidayOverride || ""}
                      onChange={(e) => handleChange("holidayOverride", e.target.value)}
                    >
                      <option value="">זיהוי אוטומטי (לפי התאריך)</option>
                      <option value="Chanukah">חנוכה (חג האורים)</option>
                      <option value="Purim">פורים (משנכנס אדר)</option>
                      <option value="Pesach">פסח (חג המצות)</option>
                      <option value="Shavuot">שבועות (מתן תורה)</option>
                      <option value="Rosh Hashana">ראש השנה</option>
                      <option value="Sukkot">סוכות (זמן שמחתנו)</option>
                    </select>
                    <p className="mt-2 text-xs text-orange-600 font-bold">הערה: העיטורים יופיעו בפינת המסך לפי החג שנבחר כאן.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">
                      תאריך לועזי
                    </label>
                    <input
                      type="date"
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-lev-blue/10 focus:border-lev-blue outline-none transition-all cursor-pointer font-medium text-gray-800"
                      value={formData.gregorianDateString || ""}
                      onChange={(e) =>
                        handleChange("gregorianDateString", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">
                      משך תצוגה
                    </label>
                    <select
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-lev-blue/10 focus:border-lev-blue outline-none transition-all cursor-pointer font-medium text-gray-800"
                      value={formData.displayDuration || "forever"}
                      onChange={(e) =>
                        handleChange("displayDuration", e.target.value)
                      }
                    >
                      {formData.type === 'holiday' && (
                        <option value="during_holiday">במשך ימי החג</option>
                      )}
                      <option value="24hours">למשך אותו יום</option>
                      <option value="1week">למשך שבוע</option>
                      <option value="2weeks">למשך שבועיים</option>
                      <option value="1month">למשך חודש</option>
                      <option value="forever">ללא הגבלה</option>
                    </select>
                  </div>
                </div>

                {/* Date Picker */}
                <div className={`p-6 rounded-2xl border-2 transition-colors ${formData.type === 'holiday' ? 'bg-orange-50/30 border-orange-100' : 'bg-gray-50 border-gray-200'}`}>
                  <label className="block text-base font-bold text-gray-900 mb-3">
                    תאריך האירוע (עברי)
                  </label>
                  <div className="flex gap-3">
                    <div className="w-1/4">
                      <select
                        className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-lev-blue/10 outline-none text-center font-bold text-gray-800"
                        value={hDay || ""}
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
                        className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-lev-blue/10 outline-none text-center font-bold text-gray-800"
                        value={hMonth || ""}
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
                        className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-lev-blue/10 outline-none text-center font-bold text-gray-800"
                        value={hYear || ""}
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
                    <p className={`text-lg font-bold mt-4 text-center py-2 rounded-xl border ${formData.type === 'holiday' ? 'text-orange-700 bg-orange-100/50 border-orange-200' : 'text-lev-blue bg-blue-100/50 border-blue-200'}`}>
                      {formData.hebrewDate}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">
                      {formData.type === 'holiday' ? "שם החג (טקסט מרכזי)" : "שם מלא (להצגה בגדול)"}
                    </label>
                    <input
                      required
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all placeholder:text-gray-400 font-bold text-lg ${formData.type === 'holiday'
                          ? 'bg-orange-50 border-orange-200 focus:ring-orange-500/10 focus:border-orange-500 text-orange-900'
                          : 'bg-gray-50 border-gray-200 focus:ring-lev-blue/10 focus:border-lev-blue text-gray-800'
                        }`}
                      value={formData.mainName || ""}
                      onChange={(e) => handleChange("mainName", e.target.value)}
                      placeholder={formData.type === 'holiday' ? "למשל: חג הפסח" : "למשל: מנחם מענדל כהן"}
                    />
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">
                      {formData.type === 'holiday' ? "ברכה / טקסט משני" : "טקסט נוסף (מתחת לשם)"}
                    </label>
                    <input
                      className={`w-full p-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all placeholder:text-gray-400 font-medium ${formData.type === 'holiday'
                          ? 'bg-orange-50 border-orange-200 focus:ring-orange-500/10 focus:border-orange-500 text-orange-900'
                          : 'bg-gray-50 border-gray-200 focus:ring-lev-blue/10 focus:border-lev-blue text-gray-800'
                        }`}
                      value={formData.subText || ""}
                      onChange={(e) => handleChange("subText", e.target.value)}
                      placeholder={formData.type === 'holiday' ? "למשל: חג כשר ושמח לכל בית ישראל" : "למשל: בן הרב פלוני ז”ל"}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (Desktop) - Optional & Branding */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-2">
                      {formData.type === 'holiday' ? "כותרת עליונה (מעל שם החג)" : "כותרת ההקדשה (למשל: לעילוי נשמת / לרפואת)"}
                    </label>
                    <input
                      className={`w-full p-4 md:p-5 border-2 rounded-2xl focus:ring-4 outline-none transition-all text-lg font-medium placeholder:text-gray-300 ${formData.type === 'holiday'
                          ? 'bg-orange-50 border-orange-200 focus:ring-orange-500/10 focus:border-orange-500 text-orange-900'
                          : 'bg-gray-50 border-gray-200 focus:ring-lev-blue/10 focus:border-lev-blue text-gray-800'
                        }`}
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder={formData.type === 'holiday' ? "למשל: חג שמח!" : "למשל: לעילוי נשמת / לרפואת"}
                    />
                  </div>

                  {/* Visibility Toggle */}
                  <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-red-700 leading-none">הפסקת הצגה</h3>
                      <p className="text-sm text-red-600/70 font-bold mt-1">הסתרת השקופית מהמסך ללא מחיקה</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={!!formData.hidden}
                        onChange={(e) => handleChange("hidden", e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>

                {formData.type !== 'holiday' ? (
                  <div className="bg-blue-50/30 p-6 rounded-3xl border-2 border-lev-blue/20 border-dashed animate-in fade-in duration-500">
                    <h3 className="text-lg font-bold text-lev-blue mb-4 flex items-center gap-2">
                      <ImageIcon size={20} />
                      מיתוג תורם (אופציונלי)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">
                          שם התורם / הקדשה
                        </label>
                        <input
                          className="w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-lev-blue/10 outline-none font-bold text-gray-800"
                          value={formData.donorName || ""}
                          onChange={(e) =>
                            handleChange("donorName", e.target.value)
                          }
                          placeholder="למשל: נתרם ע״י משפחת..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">
                          לוגו (קובץ או קישור)
                        </label>
                        <div className="flex gap-3 items-start">
                          <div className="flex-1">
                            <input
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-lev-blue/20 outline-none text-left ltr text-sm mb-2 font-mono"
                              value={formData.donorLogo || ""}
                              onChange={(e) =>
                                handleChange("donorLogo", e.target.value)
                              }
                              placeholder="https://..."
                            />
                            <label className="cursor-pointer bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition w-full shadow-sm">
                              <ImageIcon size={18} />
                              בחר קובץ תמונה
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>

                          <div className="relative group">
                            <div className="w-24 h-24 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-inner">
                              {formData.donorLogo ? (
                                <img
                                  src={formData.donorLogo}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-xs text-gray-400 text-center font-bold">
                                  אין לוגו
                                </span>
                              )}
                            </div>
                            {formData.donorLogo && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleChange("donorLogo", "");
                                  setImageFile(null);
                                }}
                                className="absolute -top-2 -left-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110 z-10"
                                title="הסר לוגו"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50/50 p-8 rounded-3xl border-2 border-orange-200 border-dashed flex flex-col items-center justify-center text-center space-y-4 h-[300px] animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shadow-inner">
                      <PartyPopper size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-orange-900">עיצוב חג פעיל</h3>
                      <p className="text-sm text-orange-700 font-bold mt-2 leading-relaxed">
                        במצב חג, המערכת משתמשת בעיצוב מיוחד הכולל עיטורים בפינות המסך.
                      </p>
                    </div>
                  </div>
                )}
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
              disabled={isSaving}
              className={`px-8 py-3 bg-lev-blue text-white font-bold rounded-xl transition shadow-lg shadow-blue-200 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isSaving ? "שומר..." : "שמור שינויים"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminItemForm;
