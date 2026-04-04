import { useEffect, useState } from "react";
import API from "../services/api";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler
} from "chart.js";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler
);

// ── Icons ──────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", stroke = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke ? "none" : color}
    stroke={stroke ? color : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  records: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  analytics: "M18 20V10M12 20V4M6 20v-6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  income: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  expense: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  balance: "M3 3h18v18H3zM3 9h18M9 21V9",
  trend: "M23 6l-9.5 9.5-5-5L1 18",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  search: "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5zm0 0L16 22",
  filter: "M22 3H2l8 9.46V19l4 2V12.46L22 3z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  plus: "M12 5v14M5 12h14",
  arrow_up: "M7 17l9.2-9.2M17 17V7H7",
  arrow_down: "M17 7l-9.2 9.2M7 7v10h10",
};

// ── Sidebar nav items ──────────────────────────────────────────────────
const navItems = [
  { key: "dashboard", label: "Dashboard", icon: icons.dashboard },
  { key: "records", label: "Records", icon: icons.records },
  { key: "analytics", label: "Analytics", icon: icons.analytics },
  { key: "users", label: "Users", icon: icons.users },
];

// ── Stat Card ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, iconPath, color, trend }) {
  const colors = {
    green: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: "#10b981", glow: "rgba(16,185,129,0.15)" },
    red:   { bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.2)",  icon: "#f87171", glow: "rgba(248,113,113,0.1)" },
    blue:  { bg: "rgba(99,102,241,0.1)",   border: "rgba(99,102,241,0.2)",   icon: "#818cf8", glow: "rgba(99,102,241,0.1)" },
    amber: { bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)",   icon: "#fbbf24", glow: "rgba(251,191,36,0.1)" },
  };
  const c = colors[color] || colors.green;
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 16,
      padding: "22px 24px",
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      flex: 1,
      minWidth: 0,
      boxShadow: `0 4px 24px ${c.glow}`,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${c.glow}`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 24px ${c.glow}`; }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: c.bg, border: `1px solid ${c.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon d={iconPath} color={c.icon} size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
        {sub && <div style={{ fontSize: "0.75rem", color: trend === "up" ? "#10b981" : trend === "down" ? "#f87171" : "#64748b" }}>
          {trend === "up" && "↑ "}{trend === "down" && "↓ "}{sub}
        </div>}
      </div>
    </div>
  );
}

// ── Transaction row ────────────────────────────────────────────────────
function TxRow({ tx, onEdit, onDelete, userRole }) {
  const isIncome = tx.type === "income";
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: isIncome ? "rgba(16,185,129,0.12)" : "rgba(248,113,113,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon d={isIncome ? icons.arrow_up : icons.arrow_down}
              color={isIncome ? "#10b981" : "#f87171"} size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "0.9rem" }}>{tx.title}</div>
            <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: 2 }}>{tx.category}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: "0.95rem",
          color: isIncome ? "#10b981" : "#f87171",
        }}>
          {isIncome ? "+" : "−"}₹{Number(tx.amount).toLocaleString("en-IN")}
        </span>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          background: isIncome ? "rgba(16,185,129,0.1)" : "rgba(248,113,113,0.1)",
          color: isIncome ? "#10b981" : "#f87171",
          border: `1px solid ${isIncome ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.2)"}`,
          borderRadius: 20, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 600, textTransform: "capitalize",
        }}>{tx.type}</span>
      </td>
      <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "0.82rem" }}>
        {tx.date ? new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
      </td>
      {(userRole === "admin" || userRole === "analyst") && (
        <td style={{ padding: "14px 16px", textAlign: "right" }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {userRole === "admin" && (
              <>
                <button onClick={() => onEdit(tx)} style={btnStyle("#818cf8")} title="Edit">
                  <Icon d={icons.edit} size={14} color="#818cf8" />
                </button>
                <button onClick={() => onDelete(tx._id)} style={btnStyle("#f87171")} title="Delete">
                  <Icon d={icons.trash} size={14} color="#f87171" />
                </button>
              </>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
const btnStyle = (color) => ({
  background: `rgba(${color === "#818cf8" ? "129,140,248" : "248,113,113"},0.1)`,
  border: `1px solid ${color}33`, borderRadius: 8,
  padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center",
  transition: "all 0.15s",
});

// ── Add/Edit Modal ─────────────────────────────────────────────────────
function RecordModal({ mode, record, onClose, onSave }) {
  const [form, setForm] = useState(record || { title: "", amount: "", type: "income", category: "", date: "", notes: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputSt = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "11px 14px", color: "#e2e8f0",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none",
    marginBottom: 14,
  };
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 32, width: 420, maxWidth: "92vw",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff", marginBottom: 24 }}>
          {mode === "edit" ? "Edit Record" : "New Record"}
        </div>
        <input style={inputSt} placeholder="Title" value={form.title} onChange={e => set("title", e.target.value)} />
        <input style={inputSt} placeholder="Amount (₹)" type="number" value={form.amount} onChange={e => set("amount", e.target.value)} />
        <select style={{...inputSt, appearance: "none"}} value={form.type} onChange={e => set("type", e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input style={inputSt} placeholder="Category" value={form.category} onChange={e => set("category", e.target.value)} />
        <input style={inputSt} type="date" value={form.date ? form.date.split("T")[0] : ""} onChange={e => set("date", e.target.value)} />
        <textarea style={{...inputSt, resize: "vertical", minHeight: 72}} placeholder="Notes (optional)" value={form.notes} onChange={e => set("notes", e.target.value)} />
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "#64748b", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 600,
          }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{
            flex: 1, padding: "12px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #10b981, #059669)", color: "white",
            cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700,
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────
function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [records, setRecords] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal] = useState(null); // {mode: 'add'|'edit', record?}
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const rawUser = localStorage.getItem("user");
    const user = (rawUser && rawUser !== "undefined") 
    ? JSON.parse(rawUser) 
    : { name: "User", role: "viewer" };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [r1, r2, r3, r4] = await Promise.all([
          API.get("/records/analytics"),
          API.get("/records"),
          API.get("/records/analytics/category"),
          API.get("/records/analytics/monthly"),
        ]);
        setSummary(r1.data);
        setRecords(r2.data);
        setCategoryData(r3.data);
        setMonthlyData(r4.data);
      } catch (e) { console.error(e); }
    };
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try { await API.delete(`/records/${id}`); setRecords(r => r.filter(x => x._id !== id)); } catch (e) {}
  };
  const handleSave = async (form) => {
    try {
      if (modal.mode === "edit") {
        const { data } = await API.put(`/records/${form._id}`, form);
        setRecords(r => r.map(x => x._id === data._id ? data : x));
      } else {
        const { data } = await API.post("/records", form);
        setRecords(r => [data, ...r]);
      }
      setModal(null);
    } catch (e) {}
  };

  const filteredRecords = records.filter(r => {
    const matchSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || r.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || r.type === filterType;
    return matchSearch && matchType;
  });

  // Chart configs
  const pieConfig = {
    labels: categoryData.map(d => d._id?.category || d._id),
    datasets: [{
      data: categoryData.map(d => d.total),
      backgroundColor: ["#10b981","#818cf8","#f59e0b","#f87171","#34d399","#a78bfa","#60a5fa"],
      borderColor: "#0f172a", borderWidth: 2,
    }],
  };
  const lineConfig = {
    labels: monthlyData.map(d => `${d._id?.month ?? ""}/${d._id?.year ?? ""}`),
    datasets: [{
      label: "Amount",
      data: monthlyData.map(d => d.total),
      borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.08)",
      tension: 0.4, fill: true, pointBackgroundColor: "#10b981", pointRadius: 4,
    }],
  };
  const chartOptions = (dark = true) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#64748b", font: { family: "'DM Sans'" } } } },
    scales: dark ? {
      x: { ticks: { color: "#475569" }, grid: { color: "rgba(255,255,255,0.04)" } },
      y: { ticks: { color: "#475569" }, grid: { color: "rgba(255,255,255,0.04)" } },
    } : {},
  });

  const roleColor = { admin: "#10b981", analyst: "#818cf8", viewer: "#fbbf24" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080d1a; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        table { border-collapse: collapse; width: 100%; }
        select option { background: #0f172a; color: #e2e8f0; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#080d1a" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <aside style={{
          width: sidebarOpen ? 230 : 70,
          background: "rgba(10,15,30,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column",
          transition: "width 0.25s ease",
          overflow: "hidden",
          position: "sticky", top: 0, height: "100vh", flexShrink: 0,
          backdropFilter: "blur(20px)",
        }}>
          {/* Brand */}
          <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(16,185,129,0.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            {sidebarOpen && <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", whiteSpace: "nowrap" }}>Fin<span style={{ color: "#10b981" }}>Vault</span></span>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => {
              const active = activeNav === item.key;
              return (
                <button key={item.key} onClick={() => setActiveNav(item.key)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: sidebarOpen ? "11px 14px" : "11px 0",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: 12, border: "none", cursor: "pointer",
                  background: active ? "rgba(16,185,129,0.12)" : "transparent",
                  color: active ? "#10b981" : "#475569",
                  transition: "all 0.15s",
                  width: "100%",
                }} onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
                   onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; } else { e.currentTarget.style.color = "#10b981"; } }}>
                  <Icon d={item.icon} color={active ? "#10b981" : "#475569"} size={18} />
                  {sidebarOpen && <span style={{ fontWeight: 500, fontSize: "0.88rem", whiteSpace: "nowrap" }}>{item.label}</span>}
                  {active && sidebarOpen && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />}
                </button>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {sidebarOpen && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}>{user.name?.[0]?.toUpperCase() || "U"}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email}</div>
                  <div style={{ fontSize: "0.68rem", color: roleColor[user.role] || "#64748b", textTransform: "capitalize", fontWeight: 600 }}>{user.role}</div>
                </div>
              </div>
            )}
            <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: sidebarOpen ? "10px 14px" : "10px 0", justifyContent: sidebarOpen ? "flex-start" : "center",
              width: "100%", border: "none", background: "transparent",
              color: "#475569", cursor: "pointer", borderRadius: 10, transition: "all 0.15s",
            }} onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; }} onMouseLeave={e => { e.currentTarget.style.color = "#475569"; }}>
              <Icon d={icons.logout} size={17} color="currentColor" />
              {sidebarOpen && <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────── */}
        <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>

          {/* Topbar */}
          <div style={{
            position: "sticky", top: 0, zIndex: 50,
            background: "rgba(8,13,26,0.9)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, display: "flex" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#f1f5f9", textTransform: "capitalize" }}>{activeNav}</div>
                <div style={{ fontSize: "0.72rem", color: "#475569" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
                <Icon d={icons.bell} size={17} color="#64748b" />
              </button>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "white", fontSize: "0.85rem", flexShrink: 0, boxShadow: "0 2px 12px rgba(16,185,129,0.35)" }}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 28px 48px" }}>

            {/* DASHBOARD VIEW */}
            {activeNav === "dashboard" && (
              <>
                {/* Stat Cards */}
                <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                  <StatCard label="Total Income" value={`₹${Number(summary.totalIncome || 0).toLocaleString("en-IN")}`} iconPath={icons.income} color="green" sub="This period" trend="up" />
                  <StatCard label="Total Expenses" value={`₹${Number(summary.totalExpense || 0).toLocaleString("en-IN")}`} iconPath={icons.expense} color="red" sub="This period" trend="down" />
                  <StatCard label="Net Balance" value={`₹${Number(summary.balance || 0).toLocaleString("en-IN")}`} iconPath={icons.balance} color="blue" sub="Running total" />
                  <StatCard label="Transactions" value={records.length} iconPath={icons.records} color="amber" sub="Total records" />
                </div>

                {/* Charts */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20, marginBottom: 24 }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem", marginBottom: 20 }}>Category Breakdown</div>
                    <div style={{ height: 220 }}>
                      {categoryData.length > 0 ? <Pie data={pieConfig} options={{ ...chartOptions(false), plugins: { legend: { position: "bottom", labels: { color: "#64748b", font: { family: "'DM Sans'" }, padding: 14 } } } }} /> : <div style={{ color: "#475569", textAlign: "center", paddingTop: 80, fontSize: "0.85rem" }}>No data yet</div>}
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem", marginBottom: 20 }}>Monthly Trends</div>
                    <div style={{ height: 220 }}>
                      {monthlyData.length > 0 ? <Line data={lineConfig} options={chartOptions()} /> : <div style={{ color: "#475569", textAlign: "center", paddingTop: 80, fontSize: "0.85rem" }}>No data yet</div>}
                    </div>
                  </div>
                </div>

                {/* Recent */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem" }}>Recent Transactions</div>
                    <button onClick={() => setActiveNav("records")} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>View All →</button>
                  </div>
                  <table>
                    <tbody>
                      {records.slice(0, 5).map(r => <TxRow key={r._id} tx={r} onEdit={rec => setModal({ mode: "edit", record: rec })} onDelete={handleDelete} userRole={user.role} />)}
                    </tbody>
                  </table>
                  {records.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: "40px 0", fontSize: "0.85rem" }}>No transactions yet</div>}
                </div>
              </>
            )}

            {/* RECORDS VIEW */}
            {activeNav === "records" && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#f1f5f9", fontSize: "1.05rem" }}>All Records</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {/* Search */}
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                        <Icon d={icons.search} size={15} color="#475569" />
                      </span>
                      <input placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 12px 9px 36px", color: "#e2e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", outline: "none", width: 200 }} />
                    </div>
                    {/* Filter */}
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", color: "#e2e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", outline: "none" }}>
                      <option value="all">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    {user.role === "admin" && (
                      <button onClick={() => setModal({ mode: "add" })} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, padding: "9px 18px", color: "white", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}>
                        <Icon d={icons.plus} size={15} color="white" /> Add Record
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        {["Transaction", "Amount", "Type", "Date", ...(user.role === "admin" ? ["Actions"] : [])].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: h === "Amount" ? "right" : "left", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map(r => <TxRow key={r._id} tx={r} onEdit={rec => setModal({ mode: "edit", record: rec })} onDelete={handleDelete} userRole={user.role} />)}
                    </tbody>
                  </table>
                  {filteredRecords.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: "48px 0", fontSize: "0.85rem" }}>No records found</div>}
                </div>
              </div>
            )}

            {/* ANALYTICS VIEW */}
            {activeNav === "analytics" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <StatCard label="Total Income" value={`₹${Number(summary.totalIncome || 0).toLocaleString("en-IN")}`} iconPath={icons.income} color="green" />
                  <StatCard label="Total Expenses" value={`₹${Number(summary.totalExpense || 0).toLocaleString("en-IN")}`} iconPath={icons.expense} color="red" />
                  <StatCard label="Net Balance" value={`₹${Number(summary.balance || 0).toLocaleString("en-IN")}`} iconPath={icons.balance} color="blue" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem", marginBottom: 20 }}>Category Breakdown</div>
                    <div style={{ height: 260 }}><Pie data={pieConfig} options={{ ...chartOptions(false), plugins: { legend: { position: "right", labels: { color: "#64748b", font: { family: "'DM Sans'" } } } } }} /></div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem", marginBottom: 20 }}>Monthly Trends</div>
                    <div style={{ height: 260 }}><Line data={lineConfig} options={chartOptions()} /></div>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem", marginBottom: 20 }}>Category Totals (Bar)</div>
                  <div style={{ height: 240 }}>
                    <Bar data={{ labels: categoryData.map(d => d._id?.category || d._id), datasets: [{ label: "Amount", data: categoryData.map(d => d.total), backgroundColor: "rgba(16,185,129,0.6)", borderColor: "#10b981", borderWidth: 2, borderRadius: 8 }] }} options={chartOptions()} />
                  </div>
                </div>
              </div>
            )}

            {/* USERS VIEW — admin only */}
            {activeNav === "users" && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 32, textAlign: "center" }}>
                {user.role === "admin"
                  ? <div style={{ color: "#64748b" }}>
                      <Icon d={icons.users} size={40} color="#10b981" />
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "1.1rem", marginTop: 16, marginBottom: 8 }}>User Management</div>
                      <div style={{ color: "#475569", fontSize: "0.88rem" }}>Connect your users API endpoint to manage accounts here.</div>
                    </div>
                  : <div style={{ color: "#f87171" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔒</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e2e8f0", fontSize: "1rem", marginBottom: 6 }}>Access Restricted</div>
                      <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Only admins can manage users.</div>
                    </div>
                }
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {modal && <RecordModal mode={modal.mode} record={modal.record} onClose={() => setModal(null)} onSave={handleSave} />}
    </>
  );
}

export default AdminDashboard;