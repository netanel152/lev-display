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
  if (len < 10) return "text-6xl md:text-8xl lg:text-9xl";
  if (len <= 20) return "text-5xl md:text-7xl lg:text-8xl";
  if (len <= 35) return "text-4xl md:text-6xl lg:text-7xl";
  return "text-3xl md:text-5xl lg:text-6xl";
};

const getSubFontSize = (text) => {
  const len = text?.length || 0;
  if (len < 20) return "text-2xl md:text-4xl lg:text-5xl";
  if (len <= 50) return "text-xl md:text-3xl lg:text-4xl";
  if (len <= 100) return "text-lg md:text-2xl lg:text-3xl";
  return "text-base md:text-xl lg:text-2xl";
};

const SlideCard = ({ data, fade = true }) => {
  const theme = getTheme(data.type, data.mainName);
  const config = THEME_CONFIG[data.type] || THEME_CONFIG.memorial;
  const isMemorial = data.type === 'memorial';
  const isSuccess = data.type === 'success';

  const displayTitle = isSuccess && data.title && !data.title.includes('להצלחת')
    ? `להצלחת ${data.title}`
    : data.title;

  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

            {/* Outer Glow & Gradient Container */}
            <div className={`p-1 md:p-3 w-full h-full rounded-[2.5rem] md:rounded-[4.5rem] bg-gradient-to-br ${config.gradient} shadow-[0_15px_60px_-15px] ${config.shadow} transition-all duration-500 overflow-hidden`}>
              
              {/* Inner Card (Glassmorphism) */}
              <div className={`bg-white/95 backdrop-blur-sm w-full h-full rounded-[2rem] md:rounded-[4rem] border md:border-2 ${config.border} p-5 md:p-10 flex flex-col items-center justify-between relative overflow-hidden`}>
                          {/* Decorative Background Elements */}
          <div className={`absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br ${config.gradient} opacity-10 blur-3xl rounded-full`} />
          <div className={`absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br ${config.gradient} opacity-10 blur-3xl rounded-full`} />

          {/* 1. Top Section: Logo & Icon */}
          <div className="shrink-0 flex flex-col items-center gap-4 md:gap-6 z-10">
            <div className="bg-white/50 backdrop-blur-sm p-2 md:p-3 rounded-2xl md:rounded-[2rem] shadow-xl border border-white/40">
              <img
                src={logo}
                alt="לב חב'ד"
                className="h-14 md:h-28 lg:h-36 w-auto object-contain transition-all duration-500 rounded-lg md:rounded-2xl"
              />
            </div>
            <div className="relative mt-1 md:mt-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 blur-3xl rounded-full animate-pulse scale-150`} />
              <div className={`${theme.color} filter drop-shadow-2xl transform scale-[0.7] md:scale-[1.0] lg:scale-[1.3] animate-float-pulse`}>
                {theme.icon}
              </div>
            </div>
          </div>

          {/* 2. Center Section: Smart Typography Area (Flex Grow) */}
          <div className="flex-1 w-full flex flex-col items-center justify-center overflow-y-auto scrollbar-hide z-10 px-4 md:px-10">
            <div className="w-full flex flex-col items-center gap-4 md:gap-8 py-4">
              {displayTitle && (
                <div className={`text-base md:text-3xl lg:text-4xl font-bold tracking-[0.1em] uppercase ${config.title} text-center`}>
                  {displayTitle}
                </div>
              )}

              <h1 className={`${getMainFontSize(data.mainName)} font-black text-center leading-[1.05] tracking-tight drop-shadow-md break-words w-full ${config.name}`}>
                {data.mainName}
              </h1>

              <h3 className={`${getSubFontSize(data.subText)} font-bold text-center leading-relaxed ${config.subText} w-full`}>
                {data.subText}
              </h3>

              {data.notes && !isMemorial && (
                <h4 className="text-xs md:text-2xl lg:text-3xl font-bold text-gray-500 italic mt-2 md:mt-4 opacity-60 text-center">
                  {data.notes}
                </h4>
              )}
            </div>
          </div>

          {/* 3. Bottom Section: Footer / Memorial */}
          <div className="shrink-0 w-full flex flex-col items-center mt-4 md:mt-10 z-10">
            {isMemorial ? (
              <div className="flex flex-col items-center gap-2 md:gap-6">
                {data.hebrewDate && (
                  <div className="text-base md:text-3xl lg:text-4xl font-semibold text-amber-700/70 italic tracking-widest text-center">
                    {data.hebrewDate}
                  </div>
                )}
                <div className={`text-2xl md:text-5xl lg:text-8xl font-black tracking-[0.1em] md:tracking-[0.4em] leading-none pr-[0.1em] md:pr-[0.4em] drop-shadow-lg ${config.footer}`}>
                  ת.נ.צ.ב.ה
                </div>
              </div>
            ) : (
              data.footerText && (
                <div className={`text-base md:text-5xl lg:text-7xl font-black tracking-wide text-center uppercase ${config.footer}`}>
                  {data.footerText}
                </div>
              )
            )}

                        {/* Donor Branding - Smart Adaptive Layout */}
                        {(data.donorName || data.donorLogo) && (
                          <div className="mt-2 md:mt-6 pt-2 md:pt-4 border-t border-gray-100/50 w-full flex flex-col items-center gap-1 md:gap-3 z-10">
                            <span className="text-[10px] md:text-lg lg:text-xl font-bold text-gray-400 tracking-[0.2em] uppercase">נתרם ע"י</span>
                            
                            <div className={`w-full flex ${data.donorName && data.donorLogo ? 'flex-col md:flex-row-reverse md:justify-around' : 'flex-col'} items-center gap-2 md:gap-6 px-2 md:px-10`}>
                              {data.donorLogo && (
                                <div className="flex-1 flex justify-center md:justify-end">
                                  <div className="bg-white p-1 md:p-2 rounded-xl shadow-md border border-gray-100/50">
                                    <img 
                                      src={data.donorLogo} 
                                      alt={data.donorName || "לוגו תורם"} 
                                      className="h-8 md:h-16 lg:h-24 w-auto object-contain transition-all rounded-lg" 
                                    />
                                  </div>
                                </div>
                              )}
                              {data.donorName && (
                                <div className={`flex-1 flex justify-center ${data.donorLogo ? 'md:justify-start' : 'md:justify-center'}`}>
                                  <span className={`text-base md:text-3xl lg:text-4xl font-black ${config.footer} opacity-90 text-center md:text-right leading-tight`}>
                                    {data.donorName}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;