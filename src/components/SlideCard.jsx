import candleImg from "../assets/candle-real.png";
import balloonsImg from "../assets/balloons-real.png";
import stethoscopeImg from "../assets/stethoscope-real.png";
import starImg from "../assets/star-real.png";
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

const SlideCard = ({ data, fade = true }) => {
  const theme = getTheme(data.type, data.mainName);
  const config = THEME_CONFIG[data.type] || THEME_CONFIG.memorial;
  const isMemorial = data.type === 'memorial' && data.id !== 'empty';
  const isBirthday = data.type === 'birthday';
  const isHealing = data.type === 'healing';
  const isSuccess = data.type === 'success';

  const dualImageLayoutTypes = ['memorial', 'birthday', 'healing', 'success'];
  const showTopIcon = data.id !== 'empty' && !dualImageLayoutTypes.includes(data.type);

  // Kiosk-Grade Image Props - ROBUST & SCALABLE
  const imgProps = {
    loading: "eager",
    decoding: "sync",
    fetchPriority: "high",
    className: "h-[12vh] md:h-[16vh] max-h-[160px] w-auto object-contain shrink-0 drop-shadow-2xl transition-all duration-700"
  };

  return (
    <div className={`w-full h-full max-h-full flex flex-col relative overflow-hidden transition-all duration-700 ease-in-out transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

      {/* Outer Glow & Gradient Container */}
      <div className={`p-[1vh] w-full h-full rounded-[3vmin] bg-gradient-to-br ${config.gradient} shadow-[0_2vh_8vh_-2vh] ${config.shadow} transition-all duration-500 overflow-hidden flex flex-col`}>

        {/* Inner Card (Glassmorphism) */}
        <div className={`bg-white/95 backdrop-blur-sm flex-1 rounded-[2.2vmin] border-[0.3vh] ${config.border} p-[3.5vh] pb-[12vh] flex flex-col items-center relative overflow-hidden text-center shadow-inner`}>

          {/* Decorative Background Elements */}
          <div className={`absolute -top-[20vh] -right-[20vh] w-[50vh] h-[50vh] bg-gradient-to-br ${config.gradient} opacity-5 blur-[10vh] rounded-full`} />
          <div className={`absolute -bottom-[20vh] -left-[20vh] w-[50vh] h-[50vh] bg-gradient-to-br ${config.gradient} opacity-5 blur-[10vh] rounded-full`} />

          {/* MIDDLE STAGE: The "Hero" content area */}
          <div className={`flex-1 flex flex-col items-center w-full min-h-0 px-[2vw] z-10 ${isMemorial ? 'justify-center gap-[min(2.5vh,20px)]' : 'justify-start pt-[2vh] gap-[6vh]'}`}>

            {/* Branding Header */}
            {data.id !== 'empty' && (
              <h2 className="text-[clamp(1rem,3.0vmin,1.8rem)] font-black text-lev-burgundy tracking-[0.15em] drop-shadow-sm leading-none uppercase shrink-0">
                קפיטריית החסד מוקדשת
              </h2>
            )}

            {/* Optional Icon (Holiday etc.) */}
            {data.id !== 'empty' && showTopIcon && (
              <div className="relative h-[8vh] flex items-center justify-center shrink-0 my-[1vh]">
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20 blur-[4vh] rounded-full animate-pulse scale-150`} />
                <div className={`${theme.color} filter drop-shadow-xl transform scale-[1.5] animate-float-pulse`}>
                  {theme.icon}
                </div>
              </div>
            )}

            {/* Dedication Title */}
            {data.title && (
              <div className={`text-[clamp(1.2rem,3.5vmin,2.5rem)] font-bold text-center tracking-[0.05em] uppercase ${config.title} leading-tight text-balance drop-shadow-sm shrink-0`}>
                {data.title}
              </div>
            )}

            {/* Name + Subtext Group */}
            <div className={`flex flex-col items-center w-full shrink-0 ${isMemorial ? 'gap-0' : 'gap-[4vh]'}`}>
              <div className="flex items-center justify-center gap-[3.5vw] md:gap-[5vw] w-full max-w-[98%] mx-auto min-h-0 shrink-0">
                <div className="flex justify-center shrink-0">
                  {isMemorial && <img src={candleImg} alt="Candle" {...imgProps} />}
                  {isBirthday && <img src={balloonsImg} alt="Balloons" {...imgProps} />}
                  {isHealing && <img src={stethoscopeImg} alt="Stethoscope" {...imgProps} />}
                  {isSuccess && <img src={starImg} alt="Star" {...imgProps} />}
                </div>

                <h1 className={`text-[clamp(1.5rem,5vmin,5rem)] font-black text-center break-words text-balance leading-[1.1] tracking-tighter drop-shadow-2xl flex-none max-w-[65%] ${config.name}`}>
                  {data.mainName}
                </h1>

                <div className="flex justify-center shrink-0">
                  {isMemorial && <img src={candleImg} alt="Candle" {...imgProps} />}
                  {isBirthday && <img src={balloonsImg} alt="Balloons" {...imgProps} />}
                  {isHealing && <img src={stethoscopeImg} alt="Stethoscope" {...imgProps} />}
                  {isSuccess && <img src={starImg} alt="Star" {...imgProps} />}
                </div>
              </div>

              {/* Sub-Text */}
              <h3 className={`text-[clamp(1.2rem,4vmin,3rem)] font-bold text-center text-balance px-[2vw] leading-tight text-lev-burgundy/90 w-full break-words drop-shadow-sm shrink-0 ${config.subText}`}>
                {data.subText}
              </h3>
            </div>

            {/* Memorial Date Pill - Anchored to bottom of Middle Stage */}
            {isMemorial && data.hebrewDate && (
              <div className="mt-auto mb-[10vh] shrink-0 z-10 text-[clamp(1rem,2.5vmin,2.2rem)] font-black bg-white/40 px-[5vw] py-[0.8vh] rounded-full border-2 border-white/60 shadow-md leading-none text-amber-900 whitespace-nowrap">
                {data.hebrewDate}
              </div>
            )}
          </div>

          {/* BOTTOM STAGE */}
          <div className="absolute bottom-0 left-0 w-full p-[2vh] flex flex-col items-center z-20 pointer-events-none">

            {/* Slide Primary Footer (Only if Memorial) */}
            {isMemorial && (
              <div className={`text-[clamp(2rem,6.5vmin,4.5rem)] font-black tracking-[0.3em] pl-[0.3em] whitespace-nowrap drop-shadow-2xl leading-none mb-[1vh] ${config.footer}`}>
                ת.נ.צ.ב.ה
              </div>
            )}

            {/* Donor Branding */}
            {(data.donorName || data.donorLogo) && (
              <div className="w-fit max-w-[90%] bg-white/80 backdrop-blur-xl px-[2.5vw] py-[0.8vh] rounded-[2vmin] border border-white shadow-lg flex items-center gap-[2.5vw] animate-in fade-in slide-in-from-bottom-4 duration-1000 pointer-events-none">

                {data.donorLogo && (
                  <div className="bg-white p-[0.6vh] rounded-[1.2vmin] shadow-sm border border-gray-100 flex items-center justify-center shrink-0 h-[8vh] min-w-[8vh]">
                    <img
                      src={data.donorLogo}
                      alt="Donor"
                      className="h-full w-auto object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-start justify-center text-right py-[0.5vh]">
                  <span className="text-[clamp(10px,1.5vmin,16px)] font-black text-gray-400 tracking-[0.15em] uppercase mb-[0.3vh] leading-none">
                    נתרם ע"י
                  </span>
                  {data.donorName && (
                    <span className={`text-[clamp(1.2rem,2.8vmin,2.4rem)] font-black ${config.footer} opacity-95 tracking-tight truncate max-w-[45vw] leading-tight`}>
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
