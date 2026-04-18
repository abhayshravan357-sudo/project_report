import { useState, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Pin, Maximize2, Minimize2,
  LayoutDashboard, Cpu, Database, Activity,
  TrendingUp, Settings, Zap, Table2
} from "lucide-react";

// ─── NOTES DATA — Dashboard.java (Aurum Capital Trading Terminal) ─────────────

const NOTES = [
  {
    id: "overview",
    icon: LayoutDashboard,
    label: "What is Dashboard.java?",
    color: "#fde68a", textColor: "#78350f", pinColor: "#d97706",
    title: "The whole app in one class",
    short: "Dashboard.java builds and runs the entire Aurum Capital trading terminal window.",
    detail: `Dashboard.java is the heart of the application. It is a Java class that uses JavaFX — a library for building desktop apps — to create the full trading terminal you see on screen.

When the app starts, the show() method is called. It:
• Builds each panel (sidebar, header, charts, table)
• Assembles them into one BorderPane (the main frame)
• Opens a maximised window titled "Aurum Capital | Institutional Trading Terminal"
• Starts the live market engine and the clock

Think of it like a stage director — it calls every actor (panel) to their position and shouts "Action!"

The class is in the package com.jewelry.ui, meaning it lives in the ui folder of the jewelry project.`,
    defaultPos: { x: 60, y: 90 }, rotate: -2,
  },
  {
    id: "layout",
    icon: Settings,
    label: "BorderPane Layout",
    color: "#fed7aa", textColor: "#7c2d12", pinColor: "#ea580c",
    title: "BorderPane — the 5-zone frame",
    short: "The screen is divided into Top, Left, Right, Bottom, and Center zones.",
    detail: `JavaFX's BorderPane splits the window into 5 regions:

TOP → createHeader()
The thin bar at the very top. Shows "NODE: SNJB-KBJ-01" on the left and "OPERATOR:Admin" on the right. A Region spacer between them pushes them apart.

LEFT → createSidebar()
The 260px wide dark panel with the "AURUM CAPITAL" branding and all 5 navigation buttons.

RIGHT → createExecutionDesk()
The 320px wide Order Execution panel with the BUY/SELL form and the execution log list.

BOTTOM → createFooterTicker()
The thin live-feed bar at the bottom showing gold/silver volatility in real time.

CENTER → createDashboardOverview()
Everything in the middle — KPI cards, charts, and the portfolio table. This region swaps out when you click sidebar buttons.

Analogy: BorderPane is like a newspaper layout — masthead at top, ads on sides, main article in the middle.`,
    code: `mainLayout.setTop(header);
mainLayout.setLeft(sidebar);
mainLayout.setRight(executionDesk);
mainLayout.setBottom(footer);
mainLayout.setCenter(centerContent); // swappable!`,
    defaultPos: { x: 430, y: 60 }, rotate: 1.5,
  },
  {
    id: "sidebar",
    icon: Activity,
    label: "Sidebar Navigation",
    color: "#bbf7d0", textColor: "#14532d", pinColor: "#16a34a",
    title: "createSidebar() — nav buttons",
    short: "5 navigation buttons that swap the center panel when clicked.",
    detail: `The sidebar is a VBox (vertical box) with the brand logo at top and 5 nav buttons below.

Each button is created with createNavButton() which styles it as either active (gold border + gold text) or inactive (grey text, transparent background).

When a button is clicked:
1. updateNav() highlights it and un-highlights all others
2. The center panel is replaced with the correct view:
   - Market Desk → createDashboardOverview()
   - AUM Portfolio → new PortfolioScreen().getView()
   - Client Accounts → new InvestorDirectory().getView()
   - Trade Ledger → new MarketTerminal().getView()
   - System Config → createPlaceholderView()

A Region spacer with VBox.setVgrow(ALWAYS) pushes the Logout button to the very bottom.

Analogy: The sidebar is like a TV remote — each button switches the channel (center view).`,
    code: `btnDashboard.setOnAction(e -> {
  updateNav(btnDashboard, btnPortfolio, ...);
  mainLayout.setCenter(createDashboardOverview());
});

btnPortfolio.setOnAction(e -> {
  updateNav(btnPortfolio, btnDashboard, ...);
  mainLayout.setCenter(
    new PortfolioScreen().getView()
  );
});`,
    defaultPos: { x: 810, y: 55 }, rotate: -1,
  },
  {
    id: "kpi",
    icon: TrendingUp,
    label: "KPI Cards",
    color: "#bae6fd", textColor: "#0c4a6e", pinColor: "#0284c7",
    title: "createKpiCard() — the 6 stat boxes",
    short: "Six cards showing live AUM, P&L, margin, gold price, silver price, and trade count.",
    detail: `The dashboard's first row is a 3-column GridPane holding 6 KPI (Key Performance Indicator) cards.

Each card is built by createKpiCard(title, label, color):
• A small grey title label at the top (e.g. "TOTAL AUM (INR)")
• A large coloured value label below (e.g. "₹28,688,008" in gold)

The label references (aumLbl, pnlLbl, goldPriceLbl, etc.) are declared as instance variables at the top of the class. The market engine updates these labels every 1.8 seconds via Platform.runLater() — which safely updates the UI from a background thread.

The P&L label changes colour: green (#00ff88) when positive, red (#ff4444) when negative.

ColumnConstraints sets each column to exactly 33.33% width so all three cards are equal.

Analogy: Like a car dashboard — each gauge is always visible and updates in real time.`,
    code: `// Instance variables at top of class:
private Label aumLbl    = new Label("₹0.00");
private Label pnlLbl    = new Label("+₹0.00");
private Label goldPriceLbl = new Label("₹0.00");

// Updated every 1.8s by market engine:
goldPriceLbl.setText(
  String.format("₹%,.0f", currentGold)
);`,
    defaultPos: { x: 75, y: 420 }, rotate: 2,
  },
  {
    id: "engine",
    icon: Cpu,
    label: "Market Engine",
    color: "#fecdd3", textColor: "#881337", pinColor: "#e11d48",
    title: "startMarketEngine() — the live brain",
    short: "A background thread that updates prices, charts, and P&L every 1.8 seconds.",
    detail: `startMarketEngine() launches a separate background Thread that runs an infinite loop.

Every 1,800 milliseconds (1.8 seconds) it:
1. Adds random volatility to currentGold and currentSilver prices
2. Occasionally picks a random news headline
3. Calls Platform.runLater() to safely push all updates to the UI thread

Inside Platform.runLater():
• New data points are added to goldSeries and silverSeries (the chart data)
• Old data points beyond 20 entries are removed (prevents memory leak)
• All 6 KPI labels are updated with new prices
• Every PortfolioAsset recalculates its live value and P&L
• The footer ticker is updated with volatility numbers

The thread is set as a Daemon thread — this means it automatically dies when the main app closes, so it never blocks shutdown.

Analogy: Like a heartbeat — every 1.8 seconds the whole app gets fresh data pumped through it.`,
    code: `Thread engineThread = new Thread(() -> {
  while (true) {
    Thread.sleep(1800);
    currentGold += (random * 60) - 28;
    
    Platform.runLater(() -> {
      // Safe UI updates here:
      goldPriceLbl.setText(...);
      goldSeries.getData().add(...);
      // recalculate portfolio...
    });
  }
});
engineThread.setDaemon(true);
engineThread.start();`,
    defaultPos: { x: 500, y: 380 }, rotate: -1.5,
  },
  {
    id: "table",
    icon: Table2,
    label: "Portfolio Table",
    color: "#e9d5ff", textColor: "#4c1d95", pinColor: "#7c3aed",
    title: "createPortfolioTable() — holdings ledger",
    short: "A live-updating table showing all gold and silver holdings with P&L.",
    detail: `The portfolio table is a JavaFX TableView bound to portfolioList — an ObservableList. Any changes to the list automatically update the table display (no manual refresh needed).

Columns:
• ASSET ID — the tag (e.g. AU-BR-24K) in gold text
• COMMODITY — GOLD or SILVER
• VOLUME/WEIGHT — weight in grams formatted with commas
• COST BASIS — the original purchase price per unit
• LIVE MTM VALUE — current market value (updates every 1.8s)
• UNREALIZED P&L — profit or loss, green if positive, red if negative
• ACTION — a LIQUIDATE button that removes the row and logs the trade

The P&L column uses a custom CellFactory — a small renderer that checks if the value contains "+" and applies green or red styling accordingly.

Each PortfolioAsset has liveValProp and profitProp — SimpleStringProperty objects. The table columns bind to these, so when the market engine calls updateCalculations(), the table cells update automatically.

Analogy: Like a live Excel sheet — data flows in from the engine and the cells update themselves.`,
    code: `// PortfolioAsset inner class:
SimpleStringProperty liveValProp = new SimpleStringProperty();
SimpleStringProperty profitProp  = new SimpleStringProperty();

void updateCalculations(double goldRate, double silverRate) {
  double currentVal = (currentRate / divisor) * weight;
  double pnl = currentVal - costBasis;
  liveValProp.set(String.format("₹%,.0f", currentVal));
  profitProp.set((pnl >= 0 ? "+" : "") + ...);
}`,
    defaultPos: { x: 880, y: 400 }, rotate: 1,
  },
  {
    id: "charts",
    icon: Activity,
    label: "Live Charts",
    color: "#d1fae5", textColor: "#064e3b", pinColor: "#059669",
    title: "createChartContainer() — area charts",
    short: "Two live area charts showing gold and silver intraday price movement.",
    detail: `createChartContainer() builds a JavaFX AreaChart — a line chart with the area below the line filled in.

It takes:
• title — displayed above the chart
• series — the XYChart.Series data object to plot
• strokeColor — the line colour (gold #D4AF37 or silver #A0A0A0)
• fillColor — the gradient fill below the line

The X axis is a CategoryAxis (time strings like "12:34:55"). The Y axis is a NumberAxis with setForceZeroInRange(false) so it auto-scales to the actual price range rather than always starting at zero.

The market engine adds a new data point every 1.8 seconds. To prevent the chart growing forever, old entries beyond 20 points are removed from the front — creating a sliding window effect.

Styling is done with CSS lookups (chart.lookup(".chart-plot-background")) inside Platform.runLater() because JavaFX chart nodes are only available after the scene is rendered.

Analogy: Like a paper chart recorder — a pen draws the price in real time and old paper scrolls off the left edge.`,
    code: `// Add new point every 1.8s:
goldSeries.getData().add(
  new XYChart.Data<>(time, currentGold)
);

// Remove oldest to keep window at 20:
if (goldSeries.getData().size() > 20)
  goldSeries.getData().remove(0);`,
    defaultPos: { x: 255, y: 640 }, rotate: -0.5,
  },
  {
    id: "execution",
    icon: Zap,
    label: "Execution Desk",
    color: "#fef9c3", textColor: "#713f12", pinColor: "#ca8a04",
    title: "createExecutionDesk() — order panel",
    short: "The right panel where you select an asset, enter quantity, and hit BUY or SELL.",
    detail: `The execution desk is a VBox (vertical stack) with:

1. ORDER EXECUTION title at the top

2. A form VBox containing:
   • ComboBox — dropdown with "MCX GOLD 1KG" and "MCX SILVER 30KG"
   • TextField — enter quantity in lots
   • HBox with two buttons side by side:
     BUY MKT (dark green background, green text)
     SELL MKT (dark red background, red text)

3. A trade log ListView below — shows the last 20 executed trades in reverse order (newest first).

When BUY or SELL is clicked, executeTrade() is called:
• Formats a log string: [12:04:55] BUY 2 LOT MCX GOLD 1KG
• Inserts it at position 0 of executionLog (top of list)
• Trims the list to 20 entries
• Increments dailyTrades and updates the volumeLbl KPI card

HBox.setHgrow(ALWAYS) on both buttons makes them share the width equally.

Analogy: Like a trading terminal's order ticket — fill in the form and click the big green or red button.`,
    code: `private void executeTrade(
    String side, String asset, String qty) {
  String time = new SimpleDateFormat(
    "HH:mm:ss").format(new Date());
  String log = String.format(
    "[%s] %s %s LOT %s", time, side, qty, asset);
  executionLog.add(0, log);       // newest first
  if (executionLog.size() > 20)
    executionLog.remove(20);      // trim to 20
  dailyTrades++;
  volumeLbl.setText(
    String.valueOf(dailyTrades)); // update KPI
}`,
    defaultPos: { x: 660, y: 650 }, rotate: 1.5,
  },
];

// ─── STICKY NOTE COMPONENT ───────────────────────────────────────────────────

function StickyNote({ note, onFocus, zIndex }) {
  const [expanded, setExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const dragControls = useDragControls();
  const Icon = note.icon;

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={() => onFocus(note.id)}
      initial={{ x: note.defaultPos.x, y: note.defaultPos.y, rotate: note.rotate, scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      whileHover={{ scale: expanded ? 1 : 1.025 }}
      style={{ position: "absolute", zIndex, width: expanded ? 410 : 235, cursor: "grab", touchAction: "none" }}
    >
      {/* Pin */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div className="w-5 h-5 rounded-full shadow-lg flex items-center justify-center"
          style={{ background: note.pinColor }}>
          <Pin size={10} className="text-white" style={{ transform: "rotate(45deg)" }} />
        </div>
        <div className="w-0.5 h-3" style={{ background: note.pinColor + "70" }} />
      </div>

      <motion.div layout className="rounded-sm shadow-2xl overflow-hidden" style={{ background: note.color }}>

        {/* Drag handle */}
        <div className="flex items-center justify-between px-4 pt-6 pb-2 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => { dragControls.start(e); e.stopPropagation(); }}>
          <div className="flex items-center gap-2">
            <Icon size={13} style={{ color: note.pinColor }} />
            <span className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: note.pinColor, fontFamily: "monospace" }}>
              {note.label}
            </span>
          </div>
          <button onClick={() => { setExpanded(!expanded); setShowCode(false); }}
            className="p-1 rounded hover:bg-black/10 transition-colors">
            {expanded
              ? <Minimize2 size={11} style={{ color: note.textColor }} />
              : <Maximize2 size={11} style={{ color: note.textColor }} />}
          </button>
        </div>

        {/* Title + short */}
        <div className="px-4 pb-3">
          <h2 className="text-xl font-bold leading-tight mb-1"
            style={{ color: note.textColor, fontFamily: "'Caveat', cursive" }}>
            {note.title}
          </h2>
          <p className="text-[13px] leading-5"
            style={{ color: note.textColor + "bb", fontFamily: "'Caveat', cursive" }}>
            {note.short}
          </p>
        </div>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              {note.code && (
                <div className="flex mx-4 mb-2 border-b" style={{ borderColor: note.textColor + "20" }}>
                  {["Explanation", "Code"].map((tab) => {
                    const isActive = tab === "Code" ? showCode : !showCode;
                    return (
                      <button key={tab}
                        onClick={() => setShowCode(tab === "Code")}
                        className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
                        style={{
                          fontFamily: "monospace",
                          color: isActive ? note.pinColor : note.textColor + "55",
                          borderBottom: isActive ? `2px solid ${note.pinColor}` : "2px solid transparent",
                        }}>
                        {tab}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="px-4 pb-5">
                {!showCode ? (
                  <div className="space-y-2">
                    {note.detail.trim().split("\n\n").map((p, i) => (
                      <p key={i} className="text-[14px] leading-6 whitespace-pre-line"
                        style={{ color: note.textColor + "dd", fontFamily: "'Caveat', cursive" }}>
                        {p.trim()}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="rounded overflow-x-auto" style={{ background: note.textColor + "12" }}>
                    <pre className="p-3 text-[10px] font-mono leading-5 whitespace-pre-wrap"
                      style={{ color: note.pinColor }}>
                      {note.code}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tape strips */}
        <div className="flex gap-2 px-4 pb-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1 rounded-full flex-1" style={{ background: note.textColor + "15" }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function DashboardReportWall() {
  const [zOrders, setZOrders] = useState(() =>
    Object.fromEntries(NOTES.map((n, i) => [n.id, i + 1]))
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const topZ = useRef(NOTES.length + 1);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const focusNote = (id) => {
    topZ.current += 1;
    setZOrders(prev => ({ ...prev, [id]: topZ.current }));
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}
      className="min-h-screen overflow-hidden relative select-none"
      style={{
        background: "#3b2412",
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.12) 39px, rgba(0,0,0,0.12) 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px),
          radial-gradient(ellipse at 15% 60%, rgba(160,100,40,0.35) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 20%, rgba(110,70,30,0.4) 0%, transparent 50%)
        `,
        minHeight: "130vh",
      }}>

      {/* Crosshair */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute h-px w-full" style={{ top: mousePos.y, background: "rgba(255,220,120,0.07)" }} />
        <div className="absolute w-px h-full" style={{ left: mousePos.x, background: "rgba(255,220,120,0.07)" }} />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div>
          <h1 className="text-base font-black tracking-widest uppercase text-amber-200/70" style={{ fontFamily: "monospace" }}>
            AURUM CAPITAL — Dashboard.java Explainer
          </h1>
          <p className="text-[9px] text-amber-200/35 uppercase tracking-widest font-mono mt-0.5">
            Click ↗ to expand · Drag to rearrange · Code tab for Java snippets
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-sm border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
            {NOTES.length} notes pinned
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative" style={{ minHeight: "130vh", paddingTop: "70px" }}>
        {NOTES.map((note) => (
          <StickyNote key={note.id} note={note} onFocus={focusNote} zIndex={zOrders[note.id]} />
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-black/50 border-t border-white/5 flex items-center px-8 z-40">
        <span className="text-[8px] font-mono text-amber-200/25 uppercase tracking-widest">
          Dashboard.java // Aurum Capital Trading Terminal // Annotation Board // ABHAY_S_SAWANT
        </span>
      </div>
    </div>
  );
}
