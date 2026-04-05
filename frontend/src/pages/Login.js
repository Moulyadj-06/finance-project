import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) return setError("Please fill in all fields.");
    setLoading(true);
    try {
  const { data } = await API.post("/auth/login", { email, password });
    const userData = {
      _id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    };

    localStorage.setItem("user", JSON.stringify(userData));
      const role = data.user?.role;
      if (role === "admin")        window.location.href = "/admin-dashboard";
      else if (role === "analyst") window.location.href = "/analyst-dashboard";
      else                         window.location.href = "/viewer-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

    

    
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080d1a; font-family:'DM Sans',sans-serif; }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

        .lr { min-height:100vh; display:flex; background:#080d1a; overflow:hidden; position:relative; }
        .lr::before { content:''; position:absolute; width:700px; height:700px; border-radius:50%;
          background:radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%);
          top:-260px; left:-160px; pointer-events:none; }
        .lr::after { content:''; position:absolute; width:480px; height:480px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%);
          bottom:-180px; right:-80px; pointer-events:none; }

        .ll { flex:1.1; display:flex; flex-direction:column; justify-content:center;
          padding:60px 72px; position:relative; z-index:2; animation:fadeUp 0.5s ease; }

        .rr { flex:1; background:linear-gradient(145deg,#0d1929,#0f2040,#0a1628);
          border-left:1px solid rgba(255,255,255,0.05);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          position:relative; overflow:hidden; }
        .rglow { position:absolute; width:420px; height:420px; border-radius:50%;
          background:radial-gradient(circle,rgba(16,185,129,0.13) 0%,transparent 60%);
          top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; }

        .brand { display:flex; align-items:center; gap:10px; margin-bottom:52px; }
        .bicon { width:38px; height:38px; border-radius:10px;
          background:linear-gradient(135deg,#10b981,#059669);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 4px 20px rgba(16,185,129,0.45); flex-shrink:0; }
        .bname { font-family:'Syne',sans-serif; font-weight:800; font-size:1.25rem; color:#fff; }
        .bname span { color:#10b981; }

        .h1 { font-family:'Syne',sans-serif; font-size:2.7rem; font-weight:800;
          color:#fff; line-height:1.12; margin-bottom:10px; letter-spacing:-1px; }
        .h1 em { font-style:normal; background:linear-gradient(90deg,#10b981,#34d399);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .sub { color:#64748b; font-size:0.9rem; margin-bottom:44px; }

        .lbl { font-size:0.72rem; font-weight:700; letter-spacing:.09em;
          text-transform:uppercase; color:#94a3b8; margin-bottom:8px; display:block; }
        .iw  { position:relative; margin-bottom:22px; }
        .ii  { position:absolute; left:15px; top:50%; transform:translateY(-50%);
          color:#475569; pointer-events:none; display:flex; }
        .inp { width:100%; background:rgba(255,255,255,0.04);
          border:1.5px solid rgba(255,255,255,0.08); border-radius:12px;
          padding:14px 16px 14px 46px; color:#e2e8f0;
          font-family:'DM Sans',sans-serif; font-size:0.95rem; outline:none; transition:all 0.2s; }
        .inp::placeholder { color:#475569; }
        .inp:focus { border-color:#10b981; background:rgba(16,185,129,0.05);
          box-shadow:0 0 0 4px rgba(16,185,129,0.1); }
        .inp.e { border-color:#ef4444; }

        .pw-btn { position:absolute; right:13px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:#475569;
          padding:4px; display:flex; transition:color 0.2s; }
        .pw-btn:hover { color:#94a3b8; }

        .forgot { text-align:right; margin-top:-14px; margin-bottom:28px; }
        .forgot button { background:none; border:none; cursor:pointer; color:#10b981;
          font-size:0.82rem; font-weight:600; font-family:'DM Sans',sans-serif; padding:0; }

        .ebox { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
          border-radius:10px; padding:12px 15px; color:#f87171; font-size:0.85rem;
          margin-bottom:20px; display:flex; align-items:center; gap:9px; }

        .btnm { width:100%; padding:15px;
          background:linear-gradient(135deg,#10b981,#059669);
          border:none; border-radius:12px; color:#fff;
          font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.25s;
          box-shadow:0 4px 24px rgba(16,185,129,0.35);
          display:flex; align-items:center; justify-content:center; gap:8px; }
        .btnm:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(16,185,129,0.45); }
        .btnm:disabled { opacity:0.7; cursor:not-allowed; }
        .spin { width:18px; height:18px; border:2.5px solid rgba(255,255,255,0.3);
          border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }

        .slink { text-align:center; margin-top:20px; font-size:0.85rem; color:#64748b; }
        .slink a { color:#10b981; font-weight:600; text-decoration:none; }
        .slink a:hover { text-decoration:underline; }

        .trust { display:flex; gap:24px; margin-top:44px; padding-top:32px;
          border-top:1px solid rgba(255,255,255,0.06); }
        .tv { font-family:'Syne',sans-serif; font-size:1.35rem; font-weight:800; color:#10b981; }
        .tl { font-size:0.72rem; color:#475569; margin-top:2px; }

        /* Preview card */
        .pcard { background:rgba(255,255,255,0.04); backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.09); border-radius:20px;
          padding:28px; width:300px; position:relative; z-index:2;
          box-shadow:0 20px 60px rgba(0,0,0,0.45); }
        .ph { display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; }
        .pt { font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700;
          color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
        .blive { background:rgba(16,185,129,0.15); color:#10b981;
          border:1px solid rgba(16,185,129,0.3); border-radius:20px;
          font-size:0.68rem; font-weight:700; padding:3px 10px;
          text-transform:uppercase; letter-spacing:.05em; }
        .bbal { font-family:'Syne',sans-serif; font-size:2.1rem; font-weight:800; color:#fff; margin-bottom:4px; }
        .bbal span { color:#10b981; }
        .bsub { color:#475569; font-size:0.78rem; margin-bottom:22px; }
        .mbars { display:flex; gap:5px; align-items:flex-end; height:48px; margin-bottom:18px; }
        .mb { flex:1; border-radius:4px 4px 0 0; background:rgba(16,185,129,0.18); }
        .mb.h { background:#10b981; }
        .pst { display:flex; gap:10px; }
        .ps { flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:11px; }
        .psv { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; }
        .psl { font-size:0.68rem; color:#475569; margin-top:2px; }

        .chip { position:absolute; z-index:3; background:rgba(255,255,255,0.06);
          backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1);
          border-radius:14px; padding:10px 15px; display:flex; align-items:center; gap:10px; }
        .ct { top:55px; right:35px; }
        .cb { bottom:70px; left:25px; }
        .cdot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .ctxt { font-size:0.72rem; color:#94a3b8; }
        .cval { font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; color:#fff; }

        @media(max-width:768px){ .rr{display:none;} .ll{padding:40px 28px;} .h1{font-size:2rem;} }
      `}</style>

      <div className="lr">
        {/* ── LEFT ── */}
        <div className="ll">
          <div className="brand">
            <div className="bicon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span className="bname">Fin<span>Vault</span></span>
          </div>

          <h1 className="h1">Welcome<br/>back to <em>FinVault</em></h1>
          <p className="sub">Sign in to manage your financial records and analytics.</p>

          <label className="lbl">Email Address</label>
          <div className="iw">
            <span className="ii">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input className={`inp${error ? " e" : ""}`} type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          <label className="lbl">Password</label>
          <div className="iw">
            <span className="ii">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input className={`inp${error ? " e" : ""}`} type={showPw ? "text" : "password"}
              placeholder="Enter your password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <button className="pw-btn" onClick={() => setShowPw(s => !s)} type="button">
              {showPw
                ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          <div className="forgot"><button type="button">Forgot password?</button></div>

          {error && (
            <div className="ebox">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button className="btnm" onClick={handleLogin} disabled={loading}>
            {loading ? <><div className="spin"/> Signing in…</> : "Sign In →"}
          </button>

          <div className="slink">Don't have an account? <a href="/signup">Create one</a></div>

          <div className="trust">
            {[["₹2.4M+","Tracked monthly"],["99.9%","Uptime SLA"],["256-bit","Encryption"]].map(([v,l]) => (
              <div key={l}><div className="tv">{v}</div><div className="tl">{l}</div></div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="rr">
          <div className="rglow"/>
          <div className="chip ct">
            <div className="cdot" style={{background:"#10b981"}}/>
            <div><div className="ctxt">Net Balance</div><div className="cval">+₹84,200</div></div>
          </div>
          <div className="pcard">
            <div className="ph"><span className="pt">Overview</span><span className="blive">● Live</span></div>
            <div className="bbal"><span>₹</span>3,42,800</div>
            <div className="bsub">Total balance · April 2026</div>
            <div className="mbars">
              {[30,50,40,70,55,80,65,90,75,88,62,95].map((h,i) => (
                <div key={i} className={`mb${i >= 9 ? " h" : ""}`} style={{height:`${h}%`}}/>
              ))}
            </div>
            <div className="pst">
              <div className="ps"><div className="psv" style={{color:"#10b981"}}>₹1,80,000</div><div className="psl">↑ Income</div></div>
              <div className="ps"><div className="psv" style={{color:"#f87171"}}>₹95,800</div><div className="psl">↓ Expenses</div></div>
            </div>
          </div>
          <div className="chip cb">
            <div className="cdot" style={{background:"#f87171"}}/>
            <div><div className="ctxt">Last transaction</div><div className="cval">−₹4,200 · Rent</div></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;