import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.reloadTimer = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Kiosk Critical Error:", error, errorInfo);
    
    // Set a timer to reload the page after 5 seconds
    this.reloadTimer = setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-lev-yellow flex flex-col items-center justify-center text-center p-10 select-none" dir="rtl">
          <div className="max-w-md flex flex-col items-center gap-8">
            {/* Using a simple placeholder/icon if the logo asset fails or is unavailable */}
            <div className="w-32 h-32 bg-lev-burgundy rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-xl animate-pulse">
              !
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-lev-burgundy">אופס! אירעה שגיאה</h1>
              <p className="text-xl font-bold text-lev-burgundy/80">
                המערכת זיהתה תקלה ותתאפס באופן אוטומטי בעוד מספר שניות...
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-lev-burgundy rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-lev-burgundy rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-lev-burgundy rounded-full animate-bounce"></div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-8 py-3 bg-lev-burgundy text-white font-bold rounded-full hover:bg-opacity-90 transition shadow-lg"
            >
              רענן עכשיו
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
