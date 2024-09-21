function getTradingCharts() {
  const root = getComputedStyle(document.documentElement);

  return {
    autosize: true,
    symbol: "BINANCE:BTCUSDT",
    interval: "4H",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    container_id: "chart-widget",
    backgroundColor: "rgba(0, 0, 0, 1)",
    gridColor: "rgba(0, 0, 255, 0.06)",
    allow_symbol_change: true,
    save_image: true,
    details: true,
    calendar: false,
    calendar: false,
    support_host: "https://www.tradingview.com",
  };
}

function initialiseWidget() {
  const widgetConfig = getTradingCharts();
  createWidget(
    "chart-widget",
    widgetConfig,
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
  );
}

initialiseWidget();
