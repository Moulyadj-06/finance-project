// function AnalystDashboard() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!user || user.role !== "analyst") {
//     return <h2>Access Denied</h2>;
//   }

//   return (
//     <div>
//       <h1>Analyst Dashboard</h1>
//       <p>Welcome, {user.name}!</p>
//     </div>
//   );
// }

// export default AnalystDashboard; // ✅ default export

import { useEffect, useState } from "react";
import API from "../services/api";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

const getSafeUser = () => {
  try {
    const r = localStorage.getItem("user");
    if (!r || r === "undefined") return { name:"User", role:"analyst", email:"" };
    return JSON.parse(r);
  } catch { return { name:"User", role:"analyst", email:"" }; }
};

const Ic = ({ d, size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const I = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  records:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  analytics: "M18 20V10M12 20V4M6 20v-6",
  logout:    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  income:    "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  balance:   "M3 3h18v18H3zM3 9h18M9 21V9",
  bell:      "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  search:    "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5zM16 22l4.5-4.5",
  up:        "M7 17l9.2-9.2M17 17V7H7",
  down:      "M17 7l-9.2 9.2M7 7v10h10",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  tx:        "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
};

const navItems = [
  { key:"dashboard", label:"Dashboard", icon:I.dashboard },
  { key:"records",   label:"Records",   icon:I.records   },
  { key:"analytics", label:"Analytics", icon:I.analytics },
];

function StatCard({ label, value, icon, color, sub, trend }) {
  const C = {
    green: { bg:"rgba(16,185,129,0.12)", br:"rgba(16,185,129,0.25)", ic:"#10b981", glow:"rgba(16,185,129,0.15)" },
    red:   { bg:"rgba(248,113,113,0.1)",  br:"rgba(248,113,113,0.2)",  ic:"#f87171", glow:"rgba(248,113,113,0.1)" },
    blue:  { bg:"rgba(99,102,241,0.1)",   br:"rgba(99,102,241,0.2)",   ic:"#818cf8", glow:"rgba(99,102,241,0.1)" },
    amber: { bg:"rgba(251,191,36,0.1)",   br:"rgba(251,191,36,0.2)",   ic:"#fbbf24", glow:"rgba(251,191,36,0.1)" },
  }[color];
  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"22px 24px",display:"flex",alignItems:"flex-start",gap:16,flex:1,minWidth:160,boxShadow:`0 4px 24px ${C.glow}`,transition:"transform 0.2s",cursor:"default"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform=""}>
      <div style={{width:46,height:46,borderRadius:12,background:C.bg,border:`1px solid ${C.br}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Ic d={icon} color={C.ic} size={20}/>
      </div>
      <div>
        <div style={{fontSize:"0.7rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.55rem",fontWeight:800,color:"#f1f5f9",lineHeight:1.1,marginBottom:3}}>{value}</div>
        {sub && <div style={{fontSize:"0.72rem",color:trend==="up"?"#10b981":trend==="down"?"#f87171":"#64748b"}}>{trend==="up"&&"↑ "}{trend==="down"&&"↓ "}{sub}</div>}
      </div>
    </div>
  );
}

const Panel = ({children, style={}}) => (
  <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:24,...style}}>
    {children}
  </div>
);
const PTitle = ({children}) => (
  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#e2e8f0",fontSize:"0.95rem",marginBottom:18}}>{children}</div>
);

function AnalystDashboard() {
  const user = getSafeUser();

  // Hooks are always called
  const [summary, setSummary] = useState({});
  const [records, setRecords] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [loading, setLoading] = useState(true);

  // Redirect if role is not analyst
  useEffect(() => {
    if (user.role !== "analyst") {
      window.location.href = user.role === "admin" ? "/admin-dashboard" : "/viewer-dashboard";
    }
  }, [user.role]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [r1, r2, r3, r4] = await Promise.all([
          API.get("/records/analytics"),
          API.get("/records"),
          API.get("/records/analytics/category"),
          API.get("/records/analytics/monthly"),
        ]);
        setSummary(r1.data);
        setRecords(Array.isArray(r2.data) ? r2.data : []);
        setCategoryData(Array.isArray(r3.data) ? r3.data : []);
        setMonthlyData(Array.isArray(r4.data) ? r4.data : []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const fmt = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const categories = [...new Set(records.map(r => r.category).filter(Boolean))];
  const filtered = records.filter(r => {
    const ms = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || r.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const mt = filterType === "all" || r.type === filterType;
    const mc = filterCat  === "all" || r.category === filterCat;
    return ms && mt && mc;
  });

  const pieData = {
    labels: categoryData.map(d => d._id?.category || d._id || "Other"),
    datasets:[{ data:categoryData.map(d=>d.total), backgroundColor:["#10b981","#818cf8","#f59e0b","#f87171","#34d399","#a78bfa","#60a5fa"], borderColor:"#0f172a", borderWidth:2 }],
  };
  const lineData = {
    labels: monthlyData.map(d=>`${d._id?.month??""} /${d._id?.year??""}`),
    datasets:[{ label:"Amount", data:monthlyData.map(d=>d.total), borderColor:"#818cf8", backgroundColor:"rgba(129,140,248,0.08)", tension:0.4, fill:true, pointBackgroundColor:"#818cf8", pointRadius:4 }],
  };
  const barData = {
    labels: categoryData.map(d => d._id?.category || d._id || "Other"),
    datasets:[{ label:"Total (₹)", data:categoryData.map(d=>d.total), backgroundColor:"rgba(129,140,248,0.55)", borderColor:"#818cf8", borderWidth:2, borderRadius:8 }],
  };
  const chartOpts = (dark=true) => ({
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ labels:{ color:"#64748b", font:{ family:"'DM Sans'" } } } },
    scales: dark ? { x:{ ticks:{color:"#475569"}, grid:{color:"rgba(255,255,255,0.04)"} }, y:{ ticks:{color:"#475569"}, grid:{color:"rgba(255,255,255,0.04)"} } } : {},
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080d1a; font-family:'DM Sans',sans-serif; color:#e2e8f0; }
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:99px;}
        table{border-collapse:collapse;width:100%;} select option{background:#0f172a;color:#e2e8f0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .fade{animation:fadeUp 0.4s ease;}
        .nav-btn{display:flex;align-items:center;gap:12px;width:100%;border:none;cursor:pointer;background:transparent;color:#475569;border-radius:12px;padding:10px 14px;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
        .nav-btn:hover{background:rgba(255,255,255,0.04);color:#94a3b8;}
        .nav-btn.on{background:rgba(129,140,248,0.12);color:#818cf8;}
        .tx-row{border-bottom:1px solid rgba(255,255,255,0.04);}
        .tx-row:hover{background:rgba(255,255,255,0.02);}
        .tag{border-radius:20px;padding:3px 10px;font-size:0.72rem;font-weight:600;text-transform:capitalize;}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:"#080d1a"}}>
        {/* Sidebar */}
        <aside style={{width:224,background:"rgba(8,13,26,0.97)",borderRight:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
          <div style={{padding:"22px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 14px rgba(16,185,129,0.4)"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#fff"}}>Fin<span style={{color:"#10b981"}}>Vault</span></span>
          </div>

          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{background:"rgba(129,140,248,0.12)",border:"1px solid rgba(129,140,248,0.25)",borderRadius:8,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#818cf8"}}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"0.72rem",fontWeight:700,color:"#818cf8"}}>Analyst</span>
            </div>
          </div>

          <nav style={{flex:1,padding:"14px 10px",display:"flex",flexDirection:"column",gap:3}}>
            {navItems.map(item=>(
              <button key={item.key} className={`nav-btn${activeNav===item.key?" on":""}`} onClick={()=>setActiveNav(item.key)}>
                <Ic d={item.icon} color={activeNav===item.key?"#818cf8":"#475569"} size={18}/>
                <span style={{fontWeight:500,fontSize:"0.87rem"}}>{item.label}</span>
                {activeNav===item.key && <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#818cf8"}}/>}
              </button>
            ))}
            {/* Locked: users */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,color:"#2d3748",cursor:"not-allowed",marginTop:4}} title="Admin only">
              <Ic d={I.lock} color="#2d3748" size={18}/>
              <span style={{fontWeight:500,fontSize:"0.87rem"}}>Users</span>
            </div>
          </nav>

          <div style={{padding:"14px 10px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(255,255,255,0.03)",borderRadius:12,marginBottom:8,border:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#818cf8,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Syne',sans-serif",fontWeight:700,color:"white",fontSize:"0.82rem"}}>
                {user.name?.[0]?.toUpperCase()||"A"}
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:"0.82rem",fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name||user.email}</div>
                <div style={{fontSize:"0.68rem",color:"#818cf8",fontWeight:700}}>Analyst</div>
              </div>
            </div>
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",width:"100%",border:"none",background:"transparent",color:"#475569",cursor:"pointer",borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",fontWeight:500,transition:"color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#475569"}>
              <Ic d={I.logout} size={16} color="currentColor"/> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{flex:1,overflow:"auto",minWidth:0}}>
          <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(8,13,26,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.05rem",color:"#f1f5f9",textTransform:"capitalize"}}>{activeNav}</div>
              <div style={{fontSize:"0.7rem",color:"#475569"}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <Ic d={I.bell} size={17} color="#64748b"/>
              </button>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#818cf8,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"white",fontSize:"0.85rem",flexShrink:0,boxShadow:"0 2px 12px rgba(129,140,248,0.35)"}}>
                {user.name?.[0]?.toUpperCase()||"A"}
              </div>
            </div>
          </div>

          <div style={{padding:"26px 28px 56px"}} className="fade">

            {/* ── DASHBOARD ── */}
            {activeNav==="dashboard" && (
              <>
                <div style={{background:"rgba(129,140,248,0.07)",border:"1px solid rgba(129,140,248,0.18)",borderRadius:14,padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <Ic d={I.analytics} color="#818cf8" size={20}/>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.85rem",color:"#818cf8"}}>Analyst Access</div>
                    <div style={{fontSize:"0.75rem",color:"#475569",marginTop:2}}>You can view all records and analytics. Contact an admin to create or modify records.</div>
                  </div>
                </div>

                <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
                  {loading
                    ? [1,2,3,4].map(i=><div key={i} style={{flex:1,minWidth:160,height:96,borderRadius:16,background:"rgba(255,255,255,0.05)"}}/>)
                    : <>
                        <StatCard label="Total Income"   value={fmt(summary.totalIncome)}  icon={I.income}  color="green" sub="This period" trend="up"/>
                        <StatCard label="Total Expenses" value={fmt(summary.totalExpense)} icon={I.income}  color="red"   sub="This period" trend="down"/>
                        <StatCard label="Net Balance"    value={fmt(summary.balance)}      icon={I.balance} color="blue"  sub="Running total"/>
                        <StatCard label="Transactions"   value={records.length}            icon={I.tx}      color="amber" sub="Total records"/>
                      </>
                  }
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:20,marginBottom:24}}>
                  <Panel>
                    <PTitle>Category Breakdown</PTitle>
                    <div style={{height:220}}>
                      {categoryData.length>0
                        ? <Pie data={pieData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{color:"#64748b",font:{family:"'DM Sans'"},padding:12}}}}}/>
                        : <div style={{color:"#475569",textAlign:"center",paddingTop:80,fontSize:"0.85rem"}}>No data</div>}
                    </div>
                  </Panel>
                  <Panel>
                    <PTitle>Monthly Trends</PTitle>
                    <div style={{height:220}}>
                      {monthlyData.length>0
                        ? <Line data={lineData} options={chartOpts()}/>
                        : <div style={{color:"#475569",textAlign:"center",paddingTop:80,fontSize:"0.85rem"}}>No data</div>}
                    </div>
                  </Panel>
                </div>

                <Panel>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <PTitle>Recent Transactions</PTitle>
                    <button onClick={()=>setActiveNav("records")} style={{background:"rgba(129,140,248,0.1)",border:"1px solid rgba(129,140,248,0.25)",color:"#818cf8",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:"0.78rem",fontWeight:600}}>View All →</button>
                  </div>
                  <RecordsTable records={records.slice(0,5)} showActions={false}/>
                </Panel>
              </>
            )}

            {/* ── RECORDS ── */}
            {activeNav==="records" && (
              <Panel>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,marginBottom:20,flexWrap:"wrap"}}>
                  <PTitle>All Financial Records</PTitle>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                    <div style={{position:"relative"}}>
                      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic d={I.search} size={15} color="#475569"/></span>
                      <input placeholder="Search…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"9px 12px 9px 36px",color:"#e2e8f0",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",outline:"none",width:180}}/>
                    </div>
                    <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"9px 13px",color:"#e2e8f0",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",outline:"none"}}>
                      <option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
                    </select>
                    <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"9px 13px",color:"#e2e8f0",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",outline:"none"}}>
                      <option value="all">All Categories</option>
                      {categories.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{fontSize:"0.78rem",color:"#475569",marginBottom:14}}>{filtered.length} record{filtered.length!==1?"s":""} found</div>
                <RecordsTable records={filtered} showCat showActions={false}/>
                {filtered.length===0 && <div style={{color:"#475569",textAlign:"center",padding:"48px 0",fontSize:"0.85rem"}}>No records match your filters</div>}
              </Panel>
            )}

            {/* ── ANALYTICS ── */}
            {activeNav==="analytics" && (
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  <StatCard label="Total Income"   value={fmt(summary.totalIncome)}  icon={I.income}  color="green" sub="All time" trend="up"/>
                  <StatCard label="Total Expenses" value={fmt(summary.totalExpense)} icon={I.income}  color="red"   sub="All time" trend="down"/>
                  <StatCard label="Net Balance"    value={fmt(summary.balance)}      icon={I.balance} color="blue"  sub="Running total"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  <Panel>
                    <PTitle>Category Breakdown</PTitle>
                    <div style={{height:260}}>
                      <Pie data={pieData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"right",labels:{color:"#64748b",font:{family:"'DM Sans'"}}}}}}/>
                    </div>
                  </Panel>
                  <Panel>
                    <PTitle>Monthly Trends</PTitle>
                    <div style={{height:260}}><Line data={lineData} options={chartOpts()}/></div>
                  </Panel>
                </div>
                <Panel>
                  <PTitle>Category Totals — Bar Chart</PTitle>
                  <div style={{height:240}}><Bar data={barData} options={chartOpts()}/></div>
                </Panel>
                <Panel>
                  <PTitle>All Transactions</PTitle>
                  <RecordsTable records={records} showCat showActions={false}/>
                </Panel>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// ── Read-only records table ────────────────────────────────────────────
function RecordsTable({ records, showCat, showActions }) {
  if (!records.length) return <div style={{color:"#475569",textAlign:"center",padding:"40px 0",fontSize:"0.85rem"}}>No records yet</div>;
  return (
    <div style={{overflowX:"auto"}}>
      <table>
        <thead>
          <tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            {["Transaction","Amount","Type",...(showCat?["Category"]:[]),"Date"].map(h=>(
              <th key={h} style={{padding:"10px 16px",textAlign:h==="Amount"?"right":"left",fontSize:"0.7rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map(r=>{
            const inc = r.type==="income";
            return (
              <tr key={r._id} className="tx-row">
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:10,background:inc?"rgba(16,185,129,0.12)":"rgba(248,113,113,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={inc?"#10b981":"#f87171"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={inc?"M7 17l9.2-9.2M17 17V7H7":"M17 7l-9.2 9.2M7 7v10h10"}/>
                      </svg>
                    </div>
                    <div>
                      <div style={{fontWeight:600,color:"#e2e8f0",fontSize:"0.88rem"}}>{r.title}</div>
                      <div style={{fontSize:"0.7rem",color:"#475569",marginTop:1}}>{r.notes||"—"}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"14px 16px",textAlign:"right"}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.93rem",color:inc?"#10b981":"#f87171"}}>
                    {inc?"+":`−`}₹{Number(r.amount).toLocaleString("en-IN")}
                  </span>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <span className="tag" style={{background:inc?"rgba(16,185,129,0.1)":"rgba(248,113,113,0.1)",color:inc?"#10b981":"#f87171",border:`1px solid ${inc?"rgba(16,185,129,0.25)":"rgba(248,113,113,0.2)"}`}}>{r.type}</span>
                </td>
                {showCat && <td style={{padding:"14px 16px",color:"#64748b",fontSize:"0.82rem"}}>{r.category||"—"}</td>}
                <td style={{padding:"14px 16px",color:"#64748b",fontSize:"0.82rem",whiteSpace:"nowrap"}}>
                  {r.date?new Date(r.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AnalystDashboard;