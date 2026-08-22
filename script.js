const STORAGE_KEY = "trading-journal-trades";

const form = document.getElementById("trade-form");
const tradeBody = document.getElementById("trade-body");
const statsEl = document.getElementById("stats");
const searchInput = document.getElementById("search");
const strategyFilter = document.getElementById("strategy-filter");
const chartCanvas = document.getElementById("equity-chart");
const ctx = chartCanvas.getContext("2d");

const defaultDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

document.getElementById("date").value = defaultDateTime();

const readTrades = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const writeTrades = (trades) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
};

const calculatePnL = (type, entryPrice, exitPrice, size) => {
  return type === "BUY"
    ? (exitPrice - entryPrice) * size
    : (entryPrice - exitPrice) * size;
};

const calculateRR = (entryPrice, takeProfit, stopLoss) => {
  const reward = Math.abs(entryPrice - takeProfit);
  const risk = Math.abs(entryPrice - stopLoss);
  return risk === 0 ? 0 : reward / risk;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

const sortByDateAsc = (trades) =>
  [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const getStats = (trades) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const winRate = totalTrades ? (winningTrades / totalTrades) * 100 : 0;
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const averageRR = totalTrades
    ? trades.reduce((sum, t) => sum + (t.rrRatio || 0), 0) / totalTrades
    : 0;
  return { totalTrades, winRate, totalPnL, averageRR };
};

const renderStats = (trades) => {
  const { totalTrades, winRate, totalPnL, averageRR } = getStats(trades);
  statsEl.innerHTML = `
    <div class="stat"><p>Total PnL</p><strong>${formatCurrency(totalPnL)}</strong></div>
    <div class="stat"><p>Win Rate</p><strong>${winRate.toFixed(2)}%</strong></div>
    <div class="stat"><p>Total Trades</p><strong>${totalTrades}</strong></div>
    <div class="stat"><p>Average RR</p><strong>${averageRR.toFixed(2)}</strong></div>
  `;
};

const renderStrategyFilter = (trades) => {
  const selected = strategyFilter.value;
  const strategies = [...new Set(trades.map((t) => (t.strategyTag || "").trim()).filter(Boolean))];
  strategyFilter.innerHTML = `<option value="">All Strategies</option>${strategies
    .map((s) => `<option value="${s}">${s}</option>`)
    .join("")}`;
  strategyFilter.value = strategies.includes(selected) ? selected : "";
};

const drawChart = (trades) => {
  const sorted = sortByDateAsc(trades);
  let cumulative = 0;
  const points = [{ x: 0, y: 0 }];

  sorted.forEach((t, index) => {
    cumulative += t.pnl;
    points.push({ x: index + 1, y: cumulative });
  });

  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 30;
  ctx.clearRect(0, 0, width, height);

  if (points.length < 2) {
    ctx.fillStyle = "#9fb0db";
    ctx.fillText("Add trades to see your equity curve.", padding, height / 2);
    return;
  }

  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const ySpan = maxY - minY || 1;

  const mapX = (x) => padding + (x / (points.length - 1 || 1)) * (width - padding * 2);
  const mapY = (y) => height - padding - ((y - minY) / ySpan) * (height - padding * 2);

  ctx.strokeStyle = "rgba(159,176,219,0.25)";
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.strokeStyle = "#16c784";
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = mapX(p.x);
    const y = mapY(p.y);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  const last = points[points.length - 1];
  ctx.fillStyle = "#16c784";
  ctx.beginPath();
  ctx.arc(mapX(last.x), mapY(last.y), 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#9fb0db";
  ctx.fillText(`Max: ${formatCurrency(maxY)}`, padding, 16);
  ctx.fillText(`Min: ${formatCurrency(minY)}`, width - 130, 16);
};

const getFilteredTrades = (trades) => {
  const search = searchInput.value.trim().toLowerCase();
  const strategy = strategyFilter.value;
  return trades.filter((trade) => {
    const matchesSearch = (trade.pair || "").toLowerCase().includes(search);
    const matchesStrategy = strategy ? trade.strategyTag === strategy : true;
    return matchesSearch && matchesStrategy;
  });
};

const deleteTrade = (id) => {
  const trades = readTrades().filter((t) => t.id !== id);
  writeTrades(trades);
  render();
};

const renderTable = (allTrades) => {
  const filtered = getFilteredTrades(allTrades);

  if (!filtered.length) {
    tradeBody.innerHTML = `<tr><td colspan="9">No trades found.</td></tr>`;
    return;
  }

  tradeBody.innerHTML = filtered
    .map((trade) => {
      const pnlClass = trade.pnl > 0 ? "pnl-pos" : trade.pnl < 0 ? "pnl-neg" : "";
      const badgeClass = trade.type === "BUY" ? "badge-buy" : "badge-sell";
      return `
      <tr>
        <td>${formatDate(trade.date)}</td>
        <td>${trade.pair}</td>
        <td><span class="badge ${badgeClass}">${trade.type}</span></td>
        <td>${trade.entryPrice}</td>
        <td>${trade.exitPrice}</td>
        <td class="${pnlClass}">${trade.pnl > 0 ? "+" : ""}${formatCurrency(trade.pnl)}</td>
        <td>${trade.rrRatio > 0 ? trade.rrRatio.toFixed(2) : "-"}</td>
        <td>${trade.strategyTag || "-"}</td>
        <td><button class="delete-btn" data-id="${trade.id}">Delete</button></td>
      </tr>
      `;
    })
    .join("");
};

const render = () => {
  const trades = readTrades();
  renderStats(trades);
  renderStrategyFilter(trades);
  renderTable(trades);
  drawChart(trades);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const entryPrice = Number(data.get("entryPrice"));
  const exitPrice = Number(data.get("exitPrice"));
  const size = Number(data.get("size"));
  const stopLossValue = data.get("stopLoss");
  const takeProfitValue = data.get("takeProfit");
  const stopLoss = stopLossValue === "" ? NaN : Number(stopLossValue);
  const takeProfit = takeProfitValue === "" ? NaN : Number(takeProfitValue);

  if ([entryPrice, exitPrice, size].some((n) => Number.isNaN(n))) {
    alert("Please fill required numeric fields correctly.");
    return;
  }

  const type = data.get("type");
  const pnl = calculatePnL(type, entryPrice, exitPrice, size);
  const rrRatio =
    Number.isNaN(stopLoss) || Number.isNaN(takeProfit)
      ? 0
      : calculateRR(entryPrice, takeProfit, stopLoss);

  const trade = {
    id: crypto.randomUUID(),
    pair: String(data.get("pair") || "").toUpperCase().trim(),
    type,
    entryPrice,
    exitPrice,
    stopLoss: Number.isNaN(stopLoss) ? 0 : stopLoss,
    takeProfit: Number.isNaN(takeProfit) ? 0 : takeProfit,
    size,
    pnl,
    rrRatio,
    strategyTag: String(data.get("strategyTag") || "").trim(),
    notes: String(data.get("notes") || "").trim(),
    date: String(data.get("date") || new Date().toISOString()),
  };

  const trades = readTrades();
  trades.unshift(trade);
  writeTrades(trades);
  form.reset();
  document.getElementById("date").value = defaultDateTime();
  render();
});

searchInput.addEventListener("input", render);
strategyFilter.addEventListener("change", render);

tradeBody.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-id]");
  if (!button) return;
  deleteTrade(button.getAttribute("data-id"));
});

render();
