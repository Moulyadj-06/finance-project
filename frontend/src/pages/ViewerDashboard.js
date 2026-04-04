// function ViewerDashboard() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!user || user.role !== "viewer") {
//     return <h2>Access Denied</h2>;
//   }

//   return (
//     <div>
//       <h1>Viewer Dashboard</h1>
//       <p>Welcome, {user.name}!</p>
//     </div>
//   );
// }

// export default ViewerDashboard;


import { useEffect, useState } from "react";
import API from "../services/api";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Filler
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const getSafeUser = () => {
  try {
    const r = localStorage.getItem("user");
    if (!r || r === "undefined") return { name:"User", role:"viewer", email:"" };
    return JSON.parse(r);
  } catch { return { name:"User", role:"viewer", email:"" }; }
};

const Ic = ({ d, size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const ICONS = {
  income:  "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  balance: "M3 3h18v18H3zM3 9h18M9 21V9",
  tx:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  logout:  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  up:      "M7 17l9.2-9.2M17 17V7H7",
  down:    "M17 7l-9.2 9.2M7 7v10h10",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
};

function StatCard({ label, value, icon, color, sub }) {
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
        {sub && <div style={{fontSize:"0.72rem",color:"#64748b"}}>{sub}</div>}
      </div>
    </div>
  );
}

function ViewerDashboard() {
  const user = getSafeUser();

  // Always define hooks
  const [summary,      setSummary]      = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData,  setMonthlyData]  = useState([]);
  const [recent,       setRecent]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  // Fetch data
  useEffect(() => {
    if (user.role !== "viewer") return; // Don't fetch if not viewer

    const fetch = async () => {
      setLoading(true);
      try {
        const [r1, r2, r3, r4] = await Promise.all([
          API.get("/records/analytics"),
          API.get("/records/analytics/category"),
          API.get("/records/analytics/monthly"),
          API.get("/records"),
        ]);
        setSummary(r1.data);
        setCategoryData(Array.isArray(r2.data) ? r2.data : []);
        setMonthlyData(Array.isArray(r3.data) ? r3.data : []);
        setRecent((Array.isArray(r4.data) ? r4.data : []).slice(0, 5));
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [user.role]);

  // Redirect if not viewer
  if (user.role !== "viewer") {
    window.location.href = user.role === "admin" ? "/admin-dashboard" : "/analyst-dashboard";
    return null;
  }

  const fmt = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const pieData = {
    labels: categoryData.map(d => d._id?.category || d._id || "Other"),
    datasets:[{ data:categoryData.map(d=>d.total), backgroundColor:["#10b981","#818cf8","#f59e0b","#f87171","#34d399","#a78bfa"], borderColor:"#0f172a", borderWidth:2 }],
  };
  const lineData = {
    labels: monthlyData.map(d=>`${d._id?.month??""} /${d._id?.year??""}`),
    datasets:[{ label:"Amount", data:monthlyData.map(d=>d.total), borderColor:"#10b981", backgroundColor:"rgba(16,185,129,0.08)", tension:0.4, fill:true, pointBackgroundColor:"#10b981", pointRadius:4 }],
  };
  const chartOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ labels:{ color:"#64748b", font:{ family:"'DM Sans'" } } } },
    scales:{ x:{ ticks:{ color:"#475569" }, grid:{ color:"rgba(255,255,255,0.04)" } }, y:{ ticks:{ color:"#475569" }, grid:{ color:"rgba(255,255,255,0.04)" } } },
  };

  const Shimmer = () => <div style={{background:"rgba(255,255,255,0.05)",borderRadius:16,height:96,animation:"pulse 1.5s ease infinite"}}/>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080d1a; font-family:'DM Sans',sans-serif; color:#e2e8f0; }
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:99px;}
        table{border-collapse:collapse;width:100%;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .fade { animation:fadeUp 0.4s ease; }
        .tx-row { border-bottom:1px solid rgba(255,255,255,0.04); }
        .tx-row:hover { background:rgba(255,255,255,0.02); }
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:"#080d1a"}}>
        {/* Sidebar */}
        <aside style={{width:220,background:"rgba(8,13,26,0.97)",borderRight:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
          <div style={{padding:"22px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 14px rgba(16,185,129,0.4)"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#fff"}}>Fin<span style={{color:"#10b981"}}>Vault</span></span>
          </div>

          {/* Role badge */}
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:8,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24"}}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:"0.72rem",fontWeight:700,color:"#fbbf24"}}>Viewer</span>
            </div>
          </div>

          {/* Nav — viewer only has dashboard */}
          <nav style={{flex:1,padding:"14px 10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.15)",color:"#fbbf24"}}>
              <Ic d={ICONS.income} color="#fbbf24" size={18}/>
              <span style={{fontWeight:600,fontSize:"0.87rem"}}>Dashboard</span>
              <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#fbbf24"}}/>
            </div>

            {/* Locked items */}
            {[{label:"Records",icon:ICONS.tx},{label:"Analytics",icon:ICONS.shield}].map(item=>(
              <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,color:"#2d3748",marginTop:4,cursor:"not-allowed"}} title="Upgrade your role to access this">
                <Ic d={item.icon} color="#2d3748" size={18}/>
                <span style={{fontWeight:500,fontSize:"0.87rem"}}>{item.label}</span>
                <Ic d={ICONS.lock} color="#2d3748" size={14} style={{marginLeft:"auto"}}/>
              </div>
            ))}
          </nav>

          {/* User + Logout */}
          <div style={{padding:"14px 10px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(255,255,255,0.03)",borderRadius:12,marginBottom:8,border:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#fbbf24,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Syne',sans-serif",fontWeight:700,color:"white",fontSize:"0.82rem"}}>
                {user.name?.[0]?.toUpperCase()||"V"}
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:"0.82rem",fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name||user.email}</div>
                <div style={{fontSize:"0.68rem",color:"#fbbf24",fontWeight:700}}>Viewer</div>
              </div>
            </div>
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",width:"100%",border:"none",background:"transparent",color:"#475569",cursor:"pointer",borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",fontWeight:500,transition:"color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#475569"}>
              <Ic d={ICONS.logout} size={16} color="currentColor"/> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{flex:1,overflow:"auto",minWidth:0}}>
          {/* Topbar */}
          <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(8,13,26,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.05rem",color:"#f1f5f9"}}>Dashboard</div>
              <div style={{fontSize:"0.7rem",color:"#475569"}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <Ic d={ICONS.bell} size={17} color="#64748b"/>
              </button>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#fbbf24,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"white",fontSize:"0.85rem",flexShrink:0,boxShadow:"0 2px 12px rgba(251,191,36,0.3)"}}>
                {user.name?.[0]?.toUpperCase()||"V"}
              </div>
            </div>
          </div>

          <div style={{padding:"26px 28px 56px"}} className="fade">
            {/* Access banner */}
            <div style={{background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.18)",borderRadius:14,padding:"14px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
              <Ic d={ICONS.eye} color="#fbbf24" size={20}/>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.85rem",color:"#fbbf24"}}>View-Only Access</div>
                <div style={{fontSize:"0.75rem",color:"#92621a",marginTop:2}}>You can view summary data and trends. Contact an admin to upgrade your role for full access.</div>
              </div>
            </div>

            {/* Stats */}
            {loading ? (
              <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
                {[1,2,3,4].map(i=><div key={i} style={{flex:1,minWidth:160}}><Shimmer/></div>)}
              </div>
            ) : (
              <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
                <StatCard label="Total Income"   value={fmt(summary.totalIncome)}  icon={ICONS.income}  color="green" sub="All time"/>
                <StatCard label="Total Expenses" value={fmt(summary.totalExpense)} icon={ICONS.income}  color="red"   sub="All time"/>
                <StatCard label="Net Balance"    value={fmt(summary.balance)}      icon={ICONS.balance} color="blue"  sub="Running total"/>
                <StatCard label="Transactions"   value={recent.length ? "View ↑" : "—"} icon={ICONS.tx} color="amber" sub="Recent 5 shown"/>
              </div>
            )}

            {/* Charts */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:20,marginBottom:24}}>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:24}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#e2e8f0",fontSize:"0.95rem",marginBottom:18}}>Category Breakdown</div>
                <div style={{height:220}}>
                  {categoryData.length > 0
                    ? <Pie data={pieData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{color:"#64748b",font:{family:"'DM Sans'"},padding:12}}}}}/>
                    : <div style={{color:"#475569",textAlign:"center",paddingTop:80,fontSize:"0.85rem"}}>No data yet</div>}
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:24}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#e2e8f0",fontSize:"0.95rem",marginBottom:18}}>Monthly Trends</div>
                <div style={{height:220}}>
                  {monthlyData.length > 0
                    ? <Line data={lineData} options={chartOpts}/>
                    : <div style={{color:"#475569",textAlign:"center",paddingTop:80,fontSize:"0.85rem"}}>No data yet</div>}
                </div>
              </div>
            </div>

            {/* Recent (read-only) */}
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:24}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#e2e8f0",fontSize:"0.95rem",marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
                Recent Transactions
                <span style={{background:"rgba(251,191,36,0.1)",color:"#fbbf24",border:"1px solid rgba(251,191,36,0.2)",borderRadius:6,fontSize:"0.68rem",fontWeight:700,padding:"2px 8px"}}>Read Only</span>
              </div>
              <table>
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                    {["Transaction","Amount","Type","Date"].map(h=>(
                      <th key={h} style={{padding:"10px 16px",textAlign:h==="Amount"?"right":"left",fontSize:"0.7rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(r => {
                    const inc = r.type === "income";
                    return (
                      <tr key={r._id} className="tx-row">
                        <td style={{padding:"14px 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:34,height:34,borderRadius:10,background:inc?"rgba(16,185,129,0.12)":"rgba(248,113,113,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <Ic d={inc?ICONS.up:ICONS.down} color={inc?"#10b981":"#f87171"} size={14}/>
                            </div>
                            <div>
                              <div style={{fontWeight:600,color:"#e2e8f0",fontSize:"0.88rem"}}>{r.title}</div>
                              <div style={{fontSize:"0.7rem",color:"#475569",marginTop:1}}>{r.category||"—"}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:"14px 16px",textAlign:"right"}}>
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.93rem",color:inc?"#10b981":"#f87171"}}>
                            {inc?"+":`−`}₹{Number(r.amount).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td style={{padding:"14px 16px"}}>
                          <span style={{background:inc?"rgba(16,185,129,0.1)":"rgba(248,113,113,0.1)",color:inc?"#10b981":"#f87171",border:`1px solid ${inc?"rgba(16,185,129,0.25)":"rgba(248,113,113,0.2)"}`,borderRadius:20,padding:"3px 10px",fontSize:"0.72rem",fontWeight:600,textTransform:"capitalize"}}>{r.type}</span>
                        </td>
                        <td style={{padding:"14px 16px",color:"#64748b",fontSize:"0.82rem",whiteSpace:"nowrap"}}>
                          {r.date?new Date(r.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {recent.length === 0 && <div style={{color:"#475569",textAlign:"center",padding:"40px 0",fontSize:"0.85rem"}}>No transactions yet</div>}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default ViewerDashboard;