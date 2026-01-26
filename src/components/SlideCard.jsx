import logo from "../assets/logo.png";
import { getFontSize, getTheme } from "../utils/slideUtils";

const SlideCard = ({ data, fade = true }) => {
  const theme = getTheme(data.type, data.mainName);

  return (
    <div
      className={`relative z-10 bg-white w-[90%] md:w-full max-w-6xl rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-lev-burgundy/10 flex flex-col items-center text-center p-4 md:p-10 transition-all duration-700 ease-in-out transform ${fade ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
    >
      <div className="flex flex-col items-center mt-2 md:mt-4 shrink-0">
        <img src={logo} alt="לב חב'ד" className="h-16 md:h-40 w-auto object-contain" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full space-y-4 md:space-y-6 my-4 md:my-8 overflow-hidden">
        <h2 className="text-lg md:text-5xl font-bold text-lev-burgundy/90">
          {data.footerText}
          <div className={`text-base md:text-4xl mt-1 md:mt-3 font-normal ${theme.color}`}>
            {data.title}
          </div>
        </h2>

        <div className="space-y-1 md:space-y-3 py-2 md:py-4 flex flex-col items-center w-full">
          <h1 className={`${getFontSize(data.mainName)} font-black text-lev-burgundy drop-shadow-md leading-tight transition-all duration-300 break-words max-w-full px-2`}>
            {data.mainName}
          </h1>
          <h3 className="text-xl md:text-7xl font-bold text-lev-burgundy opacity-90">
            {data.subText}
          </h3>
          {data.notes && (
            <h4 className="text-lg md:text-4xl font-bold text-lev-burgundy/80 mt-2 md:mt-4">
              {data.notes}
            </h4>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col-reverse md:flex-row justify-between items-center md:items-end px-2 md:px-6 mb-2 md:mb-6 shrink-0 gap-4 md:gap-0">
        <div className="flex flex-col items-center md:items-start justify-end h-auto md:h-32 w-full md:w-auto">
          {data.donorLogo ? (
            <div className="animate-fade-in flex flex-col items-center md:items-start">
              <span className="text-sm md:text-xl font-medium text-gray-500 block mb-1 mr-1">נתרם ע"י:</span>
              <img src={data.donorLogo} alt={data.donorName} className="h-12 md:h-24 w-auto object-contain" />
            </div>
          ) : data.donorName ? (
            <div className="bg-gray-50 px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-gray-100 shadow-sm w-full md:w-auto">
              <span className="text-xs md:text-sm text-gray-400 block mb-1 text-center md:text-right">נתרם ע"י:</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600 block text-center md:text-right">
                {data.donorName}
              </span>
            </div>
          ) : null}
        </div>

        <div className={`${theme.color} opacity-90 rotate-12 mb-2 md:mb-4 filter drop-shadow-sm transform scale-110 origin-bottom-left`}>
          {theme.icon}
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
