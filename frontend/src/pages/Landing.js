function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080d1a; font-family: 'DM Sans', sans-serif; color: #e2e8f0; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes glow     { 0%,100% { box-shadow: 0 0 20px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 40px rgba(16,185,129,0.6); } }
        @keyframes barGrow  { from { height: 0; } to { height: var(--h); } }
        @keyframes dash     { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 60px; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(8,13,26,0.85); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: linear-gradient(135deg,#10b981,#059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(16,185,129,0.4); flex-shrink: 0;
        }
        .nav-name { font-family:'Syne',sans-serif; font-weight:800; font-size:1.2rem; color:#fff; }
        .nav-name span { color:#10b981; }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          padding: 8px 18px; border-radius: 10px; text-decoration: none;
          font-size: 0.88rem; font-weight: 500; transition: all 0.2s;
        }
        .nav-link-ghost { color: #64748b; }
        .nav-link-ghost:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
        .nav-link-solid {
          background: linear-gradient(135deg,#10b981,#059669); color: #fff;
          font-family: 'Syne',sans-serif; font-weight: 700;
          box-shadow: 0 4px 16px rgba(16,185,129,0.35);
        }
        .nav-link-solid:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(16,185,129,0.45); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 120px 60px 80px; position: relative; overflow: hidden;
          flex-direction: column; text-align: center;
        }
        .hero-glow-1 {
          position: absolute; width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%);
          top: -200px; left: -200px; pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%);
          bottom: -100px; right: -100px; pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
          border-radius: 99px; padding: 6px 16px; margin-bottom: 28px;
          font-size: 0.8rem; font-weight: 600; color: #10b981;
          animation: fadeUp 0.5s ease forwards;
        }
        .hero-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
        .hero-h1 {
          font-family: 'Syne',sans-serif; font-size: clamp(2.8rem,6vw,5rem);
          font-weight: 800; line-height: 1.08; letter-spacing: -2px;
          color: #fff; margin-bottom: 24px;
          animation: fadeUp 0.5s ease 0.1s both;
        }
        .hero-h1 em { font-style:normal; background: linear-gradient(90deg,#10b981,#34d399,#6ee7b7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .hero-sub {
          font-size: 1.1rem; color: #64748b; max-width: 580px; line-height: 1.7;
          margin: 0 auto 44px;
          animation: fadeUp 0.5s ease 0.2s both;
        }
        .hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.5s ease 0.3s both; }
        .btn-primary {
          padding: 15px 36px; background: linear-gradient(135deg,#10b981,#059669);
          border: none; border-radius: 12px; color: #fff;
          font-family: 'Syne',sans-serif; font-size: 0.95rem; font-weight: 700;
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 24px rgba(16,185,129,0.4); transition: all 0.25s;
          animation: glow 3s ease infinite;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(16,185,129,0.55); }
        .btn-secondary {
          padding: 15px 36px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #e2e8f0;
          font-family: 'Syne',sans-serif; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.25s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }

        /* ── HERO PREVIEW ── */
        .hero-preview {
          margin-top: 72px; position: relative; width: 100%; max-width: 900px;
          animation: fadeUp 0.6s ease 0.4s both;
        }
        .preview-frame {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px; overflow: hidden;
          box-shadow: 0 40px 120px rgba(0,0,0,0.6);
        }
        .preview-topbar {
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .preview-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 18px; }
        .ps-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 14px;
        }
        .ps-lbl { font-size: 0.68rem; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .ps-val { font-family: 'Syne',sans-serif; font-size: 1.2rem; font-weight: 800; }
        .preview-charts { display: grid; grid-template-columns: 1fr 1.8fr; gap: 14px; }
        .pc-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; padding: 16px;
        }
        .pc-title { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
        .mini-pie {
          display: flex; align-items: center; justify-content: center;
          height: 90px;
        }
        .mini-bars-wrap { display: flex; align-items: flex-end; gap: 6px; height: 90px; padding-top: 4px; }
        .mbar-item {
          flex: 1; border-radius: 4px 4px 0 0;
          animation: barGrow 0.8s ease forwards;
        }
        .preview-table { margin-top: 14px; }
        .pt-head {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .pt-head span { font-size: 0.65rem; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; }
        .pt-row {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.03);
          align-items: center;
        }
        .pt-row:hover { background: rgba(255,255,255,0.02); }
        .pt-name { font-size: 0.82rem; color: #e2e8f0; font-weight: 500; }
        .pt-cat  { font-size: 0.75rem; color: #475569; }
        .pt-amt  { font-family: 'Syne',sans-serif; font-size: 0.85rem; font-weight: 700; }
        .pt-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 0.68rem; font-weight: 700; }

        /* ── STATS STRIP ── */
        .stats-strip {
          padding: 60px; background: rgba(255,255,255,0.015);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: grid; grid-template-columns: repeat(4,1fr); gap: 0;
        }
        .stat-item {
          text-align: center; padding: 20px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-item:last-child { border-right: none; }
        .stat-val { font-family: 'Syne',sans-serif; font-size: 2.4rem; font-weight: 800; color: #10b981; margin-bottom: 6px; }
        .stat-lbl { font-size: 0.85rem; color: #64748b; }

        /* ── FEATURES ── */
        .features { padding: 100px 60px; }
        .section-label {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #10b981; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px; justify-content: center;
        }
        .section-label::before, .section-label::after {
          content: ''; flex: 1; max-width: 60px; height: 1px; background: rgba(16,185,129,0.3);
        }
        .section-h2 {
          font-family: 'Syne',sans-serif; font-size: clamp(1.8rem,3.5vw,2.8rem);
          font-weight: 800; color: #fff; text-align: center; letter-spacing: -1px;
          margin-bottom: 14px;
        }
        .section-sub { text-align: center; color: #64748b; font-size: 1rem; max-width: 520px; margin: 0 auto 64px; line-height: 1.7; }

        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .feat-card {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 28px; transition: all 0.25s; cursor: default;
          position: relative; overflow: hidden;
        }
        .feat-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--accent-color, rgba(16,185,129,0.05)) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .feat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12); }
        .feat-card:hover::before { opacity: 1; }
        .feat-icon {
          width: 48px; height: 48px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
          flex-shrink: 0;
        }
        .feat-title { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 1.05rem; color: #f1f5f9; margin-bottom: 10px; }
        .feat-desc { font-size: 0.88rem; color: #64748b; line-height: 1.65; }

        /* ── ROLES ── */
        .roles { padding: 100px 60px; background: rgba(255,255,255,0.01); }
        .roles-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 1000px; margin: 0 auto; }
        .role-card {
          border-radius: 18px; padding: 30px; border: 1px solid;
          position: relative; overflow: hidden; transition: transform 0.25s;
        }
        .role-card:hover { transform: translateY(-4px); }
        .role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 99px; padding: 5px 14px; font-size: 0.72rem;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 18px;
        }
        .role-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
        .role-name { font-family: 'Syne',sans-serif; font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 10px; }
        .role-desc { font-size: 0.85rem; color: #64748b; line-height: 1.6; margin-bottom: 22px; }
        .perm-list { display: flex; flex-direction: column; gap: 8px; }
        .perm-item { display: flex; align-items: center; gap: 10px; font-size: 0.83rem; }
        .perm-check { width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* ── HOW IT WORKS ── */
        .how { padding: 100px 60px; }
        .how-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; max-width: 1000px; margin: 0 auto; position: relative; }
        .how-steps::before {
          content: ''; position: absolute; top: 28px; left: 80px; right: 80px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(16,185,129,0.3), transparent);
        }
        .how-step { text-align: center; padding: 20px 16px; }
        .how-num {
          width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 18px;
          background: linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05));
          border: 1px solid rgba(16,185,129,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne',sans-serif; font-weight: 800; font-size: 1.1rem; color: #10b981;
          position: relative; z-index: 1;
        }
        .how-title { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 0.95rem; color: #e2e8f0; margin-bottom: 8px; }
        .how-desc { font-size: 0.8rem; color: #475569; line-height: 1.6; }

        /* ── CTA SECTION ── */
        .cta-section {
          padding: 100px 60px; text-align: center; position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 65%);
          top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none;
        }
        .cta-box {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(16,185,129,0.2);
          border-radius: 24px; padding: 64px 80px; max-width: 700px; margin: 0 auto;
          position: relative; z-index: 1;
          box-shadow: 0 0 80px rgba(16,185,129,0.08);
        }
        .cta-h2 { font-family: 'Syne',sans-serif; font-size: 2.4rem; font-weight: 800; color: #fff; letter-spacing: -1px; margin-bottom: 14px; }
        .cta-h2 em { font-style:normal; color: #10b981; }
        .cta-sub { color: #64748b; font-size: 1rem; margin-bottom: 36px; line-height: 1.6; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ── FOOTER ── */
        .footer {
          padding: 40px 60px; border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }
        .footer-brand { display: flex; align-items: center; gap: 8px; }
        .footer-icon { width: 28px; height: 28px; border-radius: 7px; background: linear-gradient(135deg,#10b981,#059669); display: flex; align-items: center; justify-content: center; }
        .footer-name { font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; color:#fff; }
        .footer-name span { color:#10b981; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { color: #475569; font-size: 0.82rem; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: #10b981; }
        .footer-copy { font-size: 0.78rem; color: #475569; }

        @media(max-width:768px){
          .nav { padding: 0 20px; }
          .hero { padding: 100px 24px 60px; }
          .stats-strip { grid-template-columns:1fr 1fr; padding: 40px 24px; }
          .features,.roles,.how,.cta-section { padding: 60px 24px; }
          .features-grid,.roles-grid,.how-steps { grid-template-columns:1fr; }
          .preview-stats { grid-template-columns:1fr 1fr; }
          .preview-charts { grid-template-columns:1fr; }
          .how-steps::before { display:none; }
          .cta-box { padding: 40px 24px; }
          .footer { padding: 24px; flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="/" className="nav-brand">
          <div className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="nav-name">Fin<span>Vault</span></span>
        </a>
        <div className="nav-links">
          <a href="#features"  className="nav-link nav-link-ghost">Features</a>
          <a href="#roles"     className="nav-link nav-link-ghost">Roles</a>
          <a href="#how"       className="nav-link nav-link-ghost">How it works</a>
          <a href="/login"     className="nav-link nav-link-ghost">Sign in</a>
          <a href="/signup"    className="nav-link nav-link-solid">Get Started →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow-1"/><div className="hero-glow-2"/>
        <div className="hero-badge"><div className="hero-badge-dot"/>&nbsp;Finance Dashboard System · Role-Based Access</div>
        <h1 className="hero-h1">Smart finance<br/>control for <em>every role</em></h1>
        <p className="hero-sub">Track income, expenses, and analytics with role-based access for admins, analysts, and viewers — all in one clean dashboard.</p>
        <div className="hero-cta">
          <a href="/signup" className="btn-primary">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Create Free Account
          </a>
          <a href="/login" className="btn-secondary">
            Sign In
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-preview">
          <div className="preview-frame">
            <div className="preview-topbar">
              <div className="dot" style={{background:"#f87171"}}/><div className="dot" style={{background:"#fbbf24"}}/><div className="dot" style={{background:"#10b981"}}/>
              <div style={{marginLeft:12,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.85rem",color:"#94a3b8"}}>FinVault Dashboard</div>
              <div style={{marginLeft:"auto",background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:20,padding:"2px 10px",fontSize:"0.68rem",color:"#10b981",fontWeight:700}}>● Live</div>
            </div>

            {/* Stats */}
            <div className="preview-stats">
              {[
                {l:"Total Income",    v:"₹3,80,000", c:"#10b981"},
                {l:"Total Expenses",  v:"₹1,42,800", c:"#f87171"},
                {l:"Net Balance",     v:"₹2,37,200", c:"#818cf8"},
                {l:"Transactions",    v:"48 records", c:"#fbbf24"},
              ].map(s=>(
                <div className="ps-card" key={s.l}>
                  <div className="ps-lbl">{s.l}</div>
                  <div className="ps-val" style={{color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="preview-charts">
              <div className="pc-card">
                <div className="pc-title">Category Breakdown</div>
                <div className="mini-pie">
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    {[
                      {color:"#10b981", offset:0,    pct:35},
                      {color:"#818cf8", offset:35,   pct:25},
                      {color:"#f59e0b", offset:60,   pct:20},
                      {color:"#f87171", offset:80,   pct:15},
                      {color:"#34d399", offset:95,   pct:5},
                    ].map(({color,offset,pct},i) => {
                      const r=32, cx=45, cy=45;
                      const startAngle = (offset/100)*360 - 90;
                      const endAngle   = ((offset+pct)/100)*360 - 90;
                      const toR = a=>a*Math.PI/180;
                      const x1 = cx+r*Math.cos(toR(startAngle)), y1 = cy+r*Math.sin(toR(startAngle));
                      const x2 = cx+r*Math.cos(toR(endAngle)),   y2 = cy+r*Math.sin(toR(endAngle));
                      const large = pct>50?1:0;
                      return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={color} opacity="0.85"/>;
                    })}
                    <circle cx="45" cy="45" r="18" fill="#0f172a"/>
                  </svg>
                </div>
              </div>
              <div className="pc-card">
                <div className="pc-title">Monthly Trends</div>
                <div className="mini-bars-wrap">
                  {[
                    {h:45,c:"rgba(16,185,129,0.3)"},{h:62,c:"rgba(16,185,129,0.35)"},
                    {h:38,c:"rgba(16,185,129,0.3)"},{h:78,c:"rgba(16,185,129,0.4)"},
                    {h:55,c:"rgba(16,185,129,0.35)"},{h:88,c:"#10b981"},
                    {h:72,c:"rgba(16,185,129,0.5)"},{h:95,c:"#10b981"},
                    {h:66,c:"rgba(16,185,129,0.45)"},{h:82,c:"#10b981"},
                    {h:90,c:"#10b981"},{h:100,c:"#10b981"},
                  ].map((b,i)=>(
                    <div key={i} className="mbar-item" style={{"--h":`${b.h}%`,height:`${b.h}%`,background:b.c}}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Table preview */}
            <div className="preview-table">
              <div className="pt-head">
                <span>Transaction</span><span>Amount</span><span>Type</span><span>Date</span>
              </div>
              {[
                {n:"Salary Credit",  cat:"Income",  amt:"+₹80,000", t:"income",  d:"Apr 01"},
                {n:"Office Rent",    cat:"Expense", amt:"−₹18,000", t:"expense", d:"Apr 03"},
                {n:"Client Invoice", cat:"Income",  amt:"+₹42,000", t:"income",  d:"Apr 05"},
                {n:"Utilities",      cat:"Expense", amt:"−₹4,200",  t:"expense", d:"Apr 07"},
              ].map(r=>(
                <div className="pt-row" key={r.n}>
                  <div>
                    <div className="pt-name">{r.n}</div>
                    <div className="pt-cat">{r.cat}</div>
                  </div>
                  <div className="pt-amt" style={{color:r.t==="income"?"#10b981":"#f87171"}}>{r.amt}</div>
                  <div>
                    <span className="pt-badge" style={{background:r.t==="income"?"rgba(16,185,129,0.12)":"rgba(248,113,113,0.1)",color:r.t==="income"?"#10b981":"#f87171",border:`1px solid ${r.t==="income"?"rgba(16,185,129,0.25)":"rgba(248,113,113,0.2)"}`}}>{r.t}</span>
                  </div>
                  <div style={{fontSize:"0.78rem",color:"#475569"}}>{r.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="stats-strip">
        {[["₹10M+","Financial data tracked"],["3 Roles","Granular access control"],["99.9%","API uptime"],["256-bit","AES Encryption"]].map(([v,l])=>(
          <div className="stat-item" key={l}>
            <div className="stat-val">{v}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="section-label">Core Features</div>
        <h2 className="section-h2">Everything you need to<br/>manage finances</h2>
        <p className="section-sub">Built with role-based access control, analytics APIs, and clean data modeling from the ground up.</p>

        <div className="features-grid">
          {[
            { icon:"M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z", color:"#10b981", bg:"rgba(16,185,129,0.12)", title:"Dashboard Analytics", desc:"Real-time summaries of income, expenses, net balance, and category-wise totals with monthly trend charts." },
            { icon:"M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z", color:"#818cf8", bg:"rgba(129,140,248,0.12)", title:"Role-Based Access Control", desc:"Admin, Analyst, and Viewer roles with middleware-enforced permissions on every API endpoint." },
            { icon:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", color:"#f59e0b", bg:"rgba(245,158,11,0.12)", title:"Financial Records CRUD", desc:"Create, view, update, and delete transactions with type, category, date, amount, and notes." },
            { icon:"M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L13 13.414V19a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 7 21v-7.586L3.293 6.707A1 1 0 0 1 3 6V4z", color:"#f87171", bg:"rgba(248,113,113,0.1)", title:"Advanced Filtering", desc:"Filter records by date range, category, type, and keyword search. Supports pagination for large datasets." },
            { icon:"M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z", color:"#34d399", bg:"rgba(52,211,153,0.12)", title:"User Management", desc:"Admin panel to create users, assign roles, toggle active/inactive status, and manage permissions." },
            { icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color:"#60a5fa", bg:"rgba(96,165,250,0.12)", title:"JWT Authentication", desc:"Secure token-based authentication with bcrypt password hashing and route-level authorization guards." },
          ].map(f=>(
            <div className="feat-card" key={f.title} style={{"--accent-color":f.bg}}>
              <div className="feat-icon" style={{background:f.bg}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
              </div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="roles" id="roles">
        <div className="section-label">Access Control</div>
        <h2 className="section-h2">Three roles, clear boundaries</h2>
        <p className="section-sub">Every user sees and can do exactly what their role permits — enforced at the API level.</p>

        <div className="roles-grid">
          {/* Viewer */}
          <div className="role-card" style={{background:"rgba(251,191,36,0.05)",borderColor:"rgba(251,191,36,0.2)"}}>
            <div className="role-badge" style={{background:"rgba(251,191,36,0.1)",color:"#fbbf24"}}>
              <div className="role-badge-dot" style={{background:"#fbbf24"}}/> Viewer
            </div>
            <div className="role-name">View Only</div>
            <div className="role-desc">Can see dashboard summaries and high-level financial data. No ability to modify anything.</div>
            <div className="perm-list">
              {[
                {t:"View dashboard summary",   ok:true},
                {t:"View income & expense totals", ok:true},
                {t:"View category charts",     ok:true},
                {t:"View financial records",   ok:false},
                {t:"Create or edit records",   ok:false},
                {t:"Manage users",             ok:false},
              ].map(p=>(
                <div className="perm-item" key={p.t}>
                  <div className="perm-check" style={{background:p.ok?"rgba(16,185,129,0.12)":"rgba(248,113,113,0.08)"}}>
                    {p.ok
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                  </div>
                  <span style={{color:p.ok?"#94a3b8":"#2d3748",fontSize:"0.83rem"}}>{p.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analyst */}
          <div className="role-card" style={{background:"rgba(129,140,248,0.05)",borderColor:"rgba(129,140,248,0.25)",boxShadow:"0 8px 32px rgba(129,140,248,0.08)"}}>
            <div style={{position:"absolute",top:16,right:16,background:"rgba(129,140,248,0.15)",border:"1px solid rgba(129,140,248,0.3)",borderRadius:20,padding:"3px 10px",fontSize:"0.68rem",fontWeight:700,color:"#818cf8"}}>Popular</div>
            <div className="role-badge" style={{background:"rgba(129,140,248,0.12)",color:"#818cf8"}}>
              <div className="role-badge-dot" style={{background:"#818cf8"}}/> Analyst
            </div>
            <div className="role-name">Read + Insights</div>
            <div className="role-desc">Can view all records and access detailed analytics. Read-only access to financial data.</div>
            <div className="perm-list">
              {[
                {t:"View dashboard summary",   ok:true},
                {t:"View all financial records", ok:true},
                {t:"Access analytics & charts", ok:true},
                {t:"Filter & search records",   ok:true},
                {t:"Create or edit records",    ok:false},
                {t:"Manage users",              ok:false},
              ].map(p=>(
                <div className="perm-item" key={p.t}>
                  <div className="perm-check" style={{background:p.ok?"rgba(16,185,129,0.12)":"rgba(248,113,113,0.08)"}}>
                    {p.ok
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    }
                  </div>
                  <span style={{color:p.ok?"#94a3b8":"#2d3748",fontSize:"0.83rem"}}>{p.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin */}
          <div className="role-card" style={{background:"rgba(16,185,129,0.05)",borderColor:"rgba(16,185,129,0.25)"}}>
            <div className="role-badge" style={{background:"rgba(16,185,129,0.12)",color:"#10b981"}}>
              <div className="role-badge-dot" style={{background:"#10b981"}}/> Admin
            </div>
            <div className="role-name">Full Access</div>
            <div className="role-desc">Complete control over records, users, and system configuration. All permissions granted.</div>
            <div className="perm-list">
              {[
                {t:"View dashboard summary",     ok:true},
                {t:"View all financial records",  ok:true},
                {t:"Create & edit records",       ok:true},
                {t:"Delete records",              ok:true},
                {t:"Manage users & roles",        ok:true},
                {t:"Toggle user active status",   ok:true},
              ].map(p=>(
                <div className="perm-item" key={p.t}>
                  <div className="perm-check" style={{background:"rgba(16,185,129,0.12)"}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <span style={{color:"#94a3b8",fontSize:"0.83rem"}}>{p.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how">
        <div className="section-label">How It Works</div>
        <h2 className="section-h2">Up and running in minutes</h2>
        <p className="section-sub">Simple setup, powerful controls. Get your team managing finances with the right access levels instantly.</p>
        <div className="how-steps">
          {[
            {n:"1", title:"Create an account", desc:"Sign up with your name, email, and choose Viewer or Analyst role to get started."},
            {n:"2", title:"Admin sets up team", desc:"Admin creates users, assigns roles, and manages active/inactive status from the dashboard."},
            {n:"3", title:"Add financial records", desc:"Admins create income & expense entries with categories, dates, amounts, and notes."},
            {n:"4", title:"Analyze & report", desc:"All roles can view summaries. Analysts get full records & charts. Everyone sees what they need."},
          ].map(s=>(
            <div className="how-step" key={s.n}>
              <div className="how-num">{s.n}</div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-h2">Ready to take<br/><em>control</em> of your finances?</h2>
          <p className="cta-sub">Join FinVault and get your team set up with the right roles and access in minutes.</p>
          <div className="cta-btns">
            <a href="/signup" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Create Free Account
            </a>
            <a href="/login" className="btn-secondary">Sign In</a>
          </div>
          <div style={{marginTop:28,fontSize:"0.78rem",color:"#475569"}}>No credit card required · 3 role types · Full API access</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="footer-name">Fin<span>Vault</span></span>
        </div>
        <div className="footer-links">
          <a href="#features" className="footer-link">Features</a>
          <a href="#roles"    className="footer-link">Roles</a>
          <a href="#how"      className="footer-link">How it works</a>
          <a href="/login"    className="footer-link">Login</a>
          <a href="/signup"   className="footer-link">Sign Up</a>
        </div>
        <div className="footer-copy">© 2026 FinVault · Finance Dashboard </div>
      </footer>
    </>
  );
}

export default Landing;