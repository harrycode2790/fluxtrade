import { useEffect, useRef } from "react";

export default function CoinSlider() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear old scripts if any
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript"; // <-- important
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { description: "Tesla", proName: "NASDAQ:TSLA" },
        { description: "Apple Inc", proName: "NASDAQ:AAPL" },
        { description: "Nvidia", proName: "NASDAQ:NVDA" },
        { description: "Microsoft", proName: "NASDAQ:MSFT" },
        { description: "AMD", proName: "NASDAQ:AMD" },
        { description: "Meta", proName: "NASDAQ:META" },
        { description: "Netflix", proName: "NASDAQ:NFLX" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "compact",
      locale: "en",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
