import { Pencil, Trash2 } from 'lucide-react';

const AdminItemRow = ({ item, onEdit, onDelete }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case "memorial": return "bg-orange-100 text-orange-700";
      case "birthday": return "bg-pink-100 text-pink-700";
      case "healing": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case "memorial": return "זיכרון";
      case "birthday": return "יום הולדת";
      case "healing": return "רפואה";
      default: return type;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
      <div className="flex gap-4 items-center overflow-hidden">
        {item.donorLogo && (
          <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
            <img src={item.donorLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
              {getTypeName(item.type)}
            </span>
            {item.hebrewDate && <span className="text-xs text-gray-600 font-medium">{item.hebrewDate}</span>}
          </div>
          <h3 className="font-bold text-lg text-gray-900 truncate">{item.mainName}</h3>
          <p className="text-gray-700 text-sm truncate">{item.subText}</p>
          {item.donorName && <p className="text-xs text-blue-700 mt-1 font-medium truncate">תורם: {item.donorName}</p>}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="text-blue-500 p-2 hover:bg-blue-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="ערוך"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-500 p-2 hover:bg-red-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-200"
          aria-label="מחק"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdminItemRow;
