import { useState } from "react";
import API from "../services/api";

function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", role:"viewer" });
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async () => {
    setError(""); setSuccess("");
    if (!form.name.trim())  return setError("Full name is required.");
    if (!form.email.trim()) return setError("Email address is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const response = await API.post("/auth/register", {
        name: form.name, email: form.email, password: form.password, role: form.role,
      });
      setSuccess(response.data.message || "Account created! Redirecting to login…");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  const strength = form.password.length < 1 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : form.password.length < 14 ? 3 : 4;
  const sColors  = ["","#ef4444","#f59e0b","#3b82f6","#10b981"];
  const sLabels  = ["","Weak","Fair","Good","Strong"];

  const EyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
  const EyeOn  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

  const roles = [
    { v:"viewer",  label:"Viewer",  desc:"View dashboard & summaries only", color:"#fbbf24" },
    { v:"analyst", label:"Analyst", desc:"View records & access analytics",  color:"#818cf8" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080d1a; font-family:'DM Sans',sans-serif; }
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

        .sg-root { min-height:100vh; background:#080d1a;
          display:flex; align-items:center; justify-content:center;
          padding:40px 16px; position:relative; overflow:hidden; }
        .sg-root::before { content:''; position:absolute; width:700px; height:700px; border-radius:50%;
          background:radial-gradient(circle,rgba(16,185,129,0.09) 0%,transparent 70%);
          top:-280px; left:-200px; pointer-events:none; }
        .sg-root::after  { content:''; position:absolute; width:500px; height:500px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%);
          bottom:-200px; right:-100px; pointer-events:none; }

        .sg-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
          border-radius:24px; padding:44px 48px; width:100%; max-width:520px;
          position:relative; z-index:2; box-shadow:0 24px 80px rgba(0,0,0,0.5);
          backdrop-filter:blur(20px); animation:fadeUp 0.5s ease; }

        .brand { display:flex; align-items:center; gap:10px; margin-bottom:28px; }
        .bicon { width:36px; height:36px; border-radius:9px;
          background:linear-gradient(135deg,#10b981,#059669);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 4px 16px rgba(16,185,129,0.4); flex-shrink:0; }
        .bname { font-family:'Syne',sans-serif; font-weight:800; font-size:1.2rem; color:#fff; }
        .bname span { color:#10b981; }

        .h1 { font-family:'Syne',sans-serif; font-size:1.9rem; font-weight:800;
          color:#fff; line-height:1.2; margin-bottom:8px; letter-spacing:-.5px; }
        .h1 em { font-style:normal; background:linear-gradient(90deg,#10b981,#34d399);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .sub { color:#64748b; font-size:0.88rem; margin-bottom:32px; }

        .lbl { font-size:0.72rem; font-weight:700; letter-spacing:.09em;
          text-transform:uppercase; color:#94a3b8; margin-bottom:8px; display:block; }
        .iw { position:relative; margin-bottom:18px; }
        .ii { position:absolute; left:15px; top:50%; transform:translateY(-50%);
          color:#475569; pointer-events:none; display:flex; }
        .inp { width:100%; background:rgba(255,255,255,0.04);
          border:1.5px solid rgba(255,255,255,0.08); border-radius:12px;
          padding:13px 16px 13px 44px; color:#e2e8f0;
          font-family:'DM Sans',sans-serif; font-size:0.92rem; outline:none; transition:all 0.2s; }
        .inp::placeholder { color:#475569; }
        .inp:focus { border-color:#10b981; background:rgba(16,185,129,0.05);
          box-shadow:0 0 0 4px rgba(16,185,129,0.1); }
        .inp.e  { border-color:#ef4444; }
        .inp.ok { border-color:rgba(16,185,129,0.45); }
        .pw-btn { position:absolute; right:13px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:#475569;
          padding:4px; display:flex; transition:color 0.2s; }
        .pw-btn:hover { color:#94a3b8; }

        .str-bar  { height:3px; border-radius:99px; background:rgba(255,255,255,0.06);
          overflow:hidden; margin-bottom:5px; margin-top:-10px; }
        .str-fill { height:100%; border-radius:99px; transition:width 0.3s, background 0.3s; }
        .str-lbl  { font-size:0.68rem; margin-bottom:16px; }

        .divider { height:1px; background:rgba(255,255,255,0.06); margin:20px 0; }

        .role-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
        .role-card { border:1.5px solid rgba(255,255,255,0.08); border-radius:12px;
          padding:14px 12px; cursor:pointer; text-align:center;
          background:rgba(255,255,255,0.02); transition:all 0.2s; }
        .role-card:hover { border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.04); }
        .role-card.on { border-color:#10b981; background:rgba(16,185,129,0.1);
          box-shadow:0 0 0 3px rgba(16,185,129,0.1); }
        .rdot { width:9px; height:9px; border-radius:50%;
          background:rgba(255,255,255,0.15); margin:0 auto 9px; transition:background 0.2s; }
        .rname { font-family:'Syne',sans-serif; font-size:0.85rem; font-weight:700;
          color:#e2e8f0; margin-bottom:4px; }
        .rdesc { font-size:0.68rem; color:#475569; line-height:1.4; }

        .note { display:flex; align-items:flex-start; gap:8px;
          background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.18);
          border-radius:10px; padding:11px 14px; margin-bottom:20px; }
        .note-t { font-size:0.78rem; color:#fbbf24; line-height:1.5; }

        .ebox { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
          border-radius:10px; padding:12px 14px; color:#f87171; font-size:0.84rem;
          margin-bottom:16px; display:flex; align-items:center; gap:9px; }
        .sbox { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25);
          border-radius:10px; padding:12px 14px; color:#10b981; font-size:0.84rem;
          margin-bottom:16px; display:flex; align-items:center; gap:9px; }

        .btnm { width:100%; padding:14px;
          background:linear-gradient(135deg,#10b981,#059669);
          border:none; border-radius:12px; color:#fff;
          font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700;
          cursor:pointer; transition:all 0.25s;
          box-shadow:0 4px 24px rgba(16,185,129,0.35);
          display:flex; align-items:center; justify-content:center; gap:8px; }
        .btnm:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(16,185,129,0.45); }
        .btnm:disabled { opacity:0.7; cursor:not-allowed; }
        .spin { width:17px; height:17px; border:2.5px solid rgba(255,255,255,0.3);
          border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }

        .llink { text-align:center; margin-top:20px; font-size:0.85rem; color:#64748b; }
        .llink a { color:#10b981; font-weight:600; text-decoration:none; }
        .llink a:hover { text-decoration:underline; }

        @media(max-width:560px){ .sg-card{padding:32px 24px;} .role-grid{grid-template-columns:1fr;} .h1{font-size:1.5rem;} }
      `}</style>

      <div className="sg-root">
        <div className="sg-card">
          <div className="brand">
            <div className="bicon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span className="bname">Fin<span>Vault</span></span>
          </div>

          <h1 className="h1">Create your<br/><em>account</em></h1>
          <p className="sub">Join FinVault to track and manage your finances.</p>

          {/* Name */}
          <label className="lbl">Full Name</label>
          <div className="iw">
            <span className="ii"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <input className={`inp${error && !form.name ? " e" : ""}`} type="text" placeholder="John Doe"
              value={form.name} onChange={e => set("name", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSignup()} />
          </div>

          {/* Email */}
          <label className="lbl">Email Address</label>
          <div className="iw">
            <span className="ii"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
            <input className="inp" type="email" placeholder="you@company.com"
              value={form.email} onChange={e => set("email", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSignup()} />
          </div>

          {/* Password */}
          <label className="lbl">Password</label>
          <div className="iw">
            <span className="ii"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
            <input className="inp" type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
              value={form.password} onChange={e => set("password", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSignup()} />
            <button className="pw-btn" onClick={() => setShowPw(s => !s)} type="button">
              {showPw ? <EyeOff/> : <EyeOn/>}
            </button>
          </div>
          {form.password.length > 0 && (
            <>
              <div className="str-bar"><div className="str-fill" style={{width:`${strength*25}%`, background:sColors[strength]}}/></div>
              <div className="str-lbl" style={{color:sColors[strength]}}>{sLabels[strength]} password</div>
            </>
          )}

          {/* Confirm */}
          <label className="lbl">Confirm Password</label>
          <div className="iw">
            <span className="ii"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
            <input className={`inp${form.confirm && form.password !== form.confirm ? " e" : form.confirm && form.password === form.confirm ? " ok" : ""}`}
              type={showCf ? "text" : "password"} placeholder="Re-enter your password"
              value={form.confirm} onChange={e => set("confirm", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSignup()} />
            <button className="pw-btn" onClick={() => setShowCf(s => !s)} type="button">
              {showCf ? <EyeOff/> : <EyeOn/>}
            </button>
          </div>

          <div className="divider"/>

          {/* Role */}
          <label className="lbl">Select Your Role</label>
          <div className="role-grid">
            {roles.map(r => (
              <div key={r.v} className={`role-card${form.role === r.v ? " on" : ""}`} onClick={() => set("role", r.v)}>
                <div className="rdot" style={form.role === r.v ? {background: r.color} : {}}/>
                <div className="rname">{r.label}</div>
                <div className="rdesc">{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" style={{flexShrink:0,marginTop:1}}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="note-t">Admin accounts can only be created by an existing admin from the user management panel.</span>
          </div>

          {error   && <div className="ebox"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
          {success && <div className="sbox"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{success}</div>}

          <button className="btnm" onClick={handleSignup} disabled={loading}>
            {loading ? <><div className="spin"/> Creating account…</> : "Create Account →"}
          </button>

          <div className="llink">Already have an account? <a href="/login">Sign in</a></div>
        </div>
      </div>
    </>
  );
}

export default Signup;