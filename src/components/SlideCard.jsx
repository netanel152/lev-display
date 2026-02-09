import logo from "../assets/original-logo.jpg";
import { getTheme } from "../utils/slideUtils";

const THEME_CONFIG = {
  memorial: {
    gradient: "from-amber-700 via-orange-600 to-yellow-600",
    shadow: "shadow-orange-500/50",
    border: "border-amber-200",
    title: "text-amber-800/70",
    name: "text-lev-burgundy",
    subText: "text-lev-burgundy/80",
    footer: "text-amber-800"
  },
  healing: {
    gradient: "from-emerald-400 via-teal-500 to-green-600",
    shadow: "shadow-emerald-500/50",
    border: "border-emerald-200",
    title: "text-emerald-700",
    name: "text-emerald-900",
    subText: "text-teal-800/90",
    footer: "text-emerald-700"
  },
  birthday: {
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    shadow: "shadow-purple-500/50",
    border: "border-pink-200",
    title: "text-purple-700",
    name: "text-pink-900",
    subText: "text-indigo-800/90",
    footer: "text-purple-700"
  },
  success: {
    gradient: "from-blue-600 via-cyan-500 to-sky-400",
    shadow: "shadow-blue-500/50",
    border: "border-blue-200",
    title: "text-blue-700",
    name: "text-blue-900",
    subText: "text-cyan-800/90",
    footer: "text-blue-700"
  },
  holiday: {
    gradient: "from-orange-400 via-red-500 to-purple-600",
    shadow: "shadow-red-500/50",
    border: "border-orange-200",
    title: "text-red-700",
    name: "text-orange-900",
    subText: "text-purple-800/90",
    footer: "text-red-700"
  }
};

const getMainFontSize = (text) => {
  const len = text?.length || 0;
  if (len < 12) return "text-[8vmin]";
  return "text-[5vmin]";
};

const SlideCard = ({ data, fade = true }) => {
  const theme = getTheme(data.type, data.mainName);
  const config = THEME_CONFIG[data.type] || THEME_CONFIG.memorial;
  const isMemorial = data.type === 'memorial' && data.id !== 'empty';
  const isSuccess = data.type === 'success';

  const displayTitle = isSuccess && data.title && !data.title.includes('להצלחת')
    ? `להצלחת ${data.title}`
    : data.title;

  return (
    <div className={`w-full h-full flex flex-col transition-all duration-700 ease-in-out transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      
      {/* Outer Glow & Gradient Container */}
      <div className={`p-[1vh] w-full h-full rounded-[5vh] bg-gradient-to-br ${config.gradient} shadow-[0_2vh_8vh_-2vh] ${config.shadow} transition-all duration-500 overflow-hidden`}>
        
        {/* Inner Card (Glassmorphism) */}
        <div className={`bg-white/95 backdrop-blur-sm w-full h-full rounded-[4vh] border-[0.3vh] ${config.border} p-[4vh] flex flex-col justify-between relative overflow-hidden`}>
          
          {/* Decorative Background Elements */}
          <div className={`absolute -top-[20vh] -right-[20vh] w-[50vh] h-[50vh] bg-gradient-to-br ${config.gradient} opacity-10 blur-[10vh] rounded-full`} />
          <div className={`absolute -bottom-[20vh] -left-[20vh] w-[50vh] h-[50vh] bg-gradient-to-br ${config.gradient} opacity-10 blur-[10vh] rounded-full`} />

          {/* 1. Top Section: Logo & Icon */}
          <div className="flex-none flex flex-col items-center gap-[1vh] z-10">
            <div className="bg-white/50 backdrop-blur-sm p-[1vh] rounded-[2vh] shadow-lg border border-white/40">
              <img
                src={logo}
                alt="לב חב'ד"
                className="h-[12vh] w-auto object-contain transition-all duration-500 rounded-lg"
              />
            </div>
            {data.id !== 'empty' && (
              <div className="flex flex-col items-center gap-[0.5vh]">
                <div className="relative h-[8vh] flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 blur-[4vh] rounded-full animate-pulse scale-150`} />
                  <div className={`${theme.color} filter drop-shadow-xl transform scale-[1.5] animate-float-pulse`}>
                    {theme.icon}
                  </div>
                </div>
                <h2 className="text-lev-burgundy font-bold text-[2.8vmin] tracking-tight drop-shadow-sm whitespace-nowrap">קפיטריית החסד מוקדשת</h2>
              </div>
            )}
          </div>

          {/* 2. Center Section: Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center gap-[2vh] z-10 px-[2vw] min-h-0">
            {displayTitle && (
              <div className={`text-[3.2vmin] font-bold tracking-[0.1em] uppercase ${config.title} text-center`}>
                {displayTitle}
              </div>
            )}

            <h1 className={`${getMainFontSize(data.mainName)} font-black text-center leading-[1.1] tracking-tight drop-shadow-md break-words w-full ${config.name}`}>
              {data.mainName}
            </h1>

            <h3 className="text-[3.5vmin] font-bold text-center leading-relaxed text-lev-burgundy/80 w-full">
              {data.subText}
            </h3>

            {data.notes && !isMemorial && (
              <h4 className="text-[2vmin] font-bold text-gray-500 italic opacity-60 text-center">
                {data.notes}
              </h4>
            )}
          </div>

          {/* 3. Bottom Section: Footer & Donors */}
          <div className="flex-none flex flex-col items-center z-10 w-full mt-auto gap-[1vh]">
            {isMemorial ? (
              <div className="flex flex-col items-center gap-[0.5vh]">
                {data.hebrewDate && (
                  <div className="text-[2.5vmin] font-semibold text-amber-700/70 italic tracking-widest text-center">
                    {data.hebrewDate}
                  </div>
                )}
                <div className={`text-[3vmin] font-black tracking-[0.4em] leading-none pr-[0.4em] drop-shadow-lg ${config.footer}`}>
                  ת.נ.צ.ב.ה
                </div>
              </div>
            ) : (
              data.footerText && (
                <div className={`text-[6vmin] font-black tracking-wide text-center uppercase ${config.footer}`}>
                  {data.footerText}
                </div>
              )
            )}

            {/* Donor Branding */}
            {(data.donorName || data.donorLogo) && (
              <div className="pt-[1vh] border-t border-gray-100/30 w-full flex flex-col items-center gap-[0.5vh]">
                <span className="text-[1.8vmin] font-bold text-gray-400 tracking-[0.2em] uppercase">נתרם ע"י</span>
                
                <div className="w-full flex justify-center items-center gap-[2vw] px-[2vw]">
                  {data.donorLogo && (
                    <div className="bg-white p-[0.5vh] rounded-[1vh] shadow-sm border border-gray-100/50">
                      <img 
                        src={data.donorLogo} 
                        alt={data.donorName || "לוגו תורם"} 
                        className="h-[6vh] w-auto object-contain transition-all rounded-md" 
                      />
                    </div>
                  )}
                  {data.donorName && (
                    <span className={`text-[3.5vmin] font-black ${config.footer} opacity-90 text-center leading-tight`}>
                      {data.donorName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;