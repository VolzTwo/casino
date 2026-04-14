import { useEffect } from 'react';

// ─── TOAST ────────────────────────────────────────────────────────────────────
export const Toast = ({ msg, type = 'info', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'win' ? '#065f46' : type === 'error' ? '#7f1d1d' : '#1e1b4b';
  const border = type === 'win' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1';
  return (
    <div style={{
      position:'fixed', top:20, right:20, zIndex:9999,
      background: bg, border: `1px solid ${border}`,
      borderRadius:12, padding:'12px 18px', maxWidth:300,
      color:'#fff', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14,
      animation:'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${border}33`,
    }}>{msg}</div>
  );
};

// ─── COIN ─────────────────────────────────────────────────────────────────────
export const Coin = ({ amount, size = 'md' }) => {
  const fs = size === 'xl' ? 36 : size === 'lg' ? 26 : size === 'sm' ? 13 : 16;
  return (
    <span style={{ fontSize: fs, fontWeight: 900, color: '#fbbf24',
      fontFamily:"'Syne',sans-serif", letterSpacing:'-0.5px' }}>
      🪙 {Number(amount).toLocaleString('id-ID')}
    </span>
  );
};

// ─── BET CONTROLS ─────────────────────────────────────────────────────────────
export const BetControls = ({ bet, setBet, balance, onPlay, loading, label = 'MAIN!' }) => {
  const presets = [25, 50, 100, 250, 500, 1000];
  return (
    <div>
      <p style={labelStyle}>Jumlah Taruhan</p>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
        {presets.map(p => (
          <button key={p} onClick={() => setBet(p)} style={{
            padding:'4px 10px', borderRadius:8, fontSize:12, fontWeight:700,
            border: bet === p ? 'none' : '1px solid #2d2d3d',
            background: bet === p ? '#fbbf24' : '#1a1a2e',
            color: bet === p ? '#0a0a0f' : '#aaa', cursor:'pointer', transition:'all .15s',
            fontFamily:"'Syne',sans-serif",
          }}>{p.toLocaleString()}</button>
        ))}
        <button onClick={() => setBet(Math.floor(balance))} style={{
          padding:'4px 10px', borderRadius:8, fontSize:12, fontWeight:700,
          border:'1px solid #2d2d3d', background:'#1a1a2e', color:'#aaa',
          cursor:'pointer', fontFamily:"'Syne',sans-serif",
        }}>MAX</button>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <input type="number" min={10} max={balance} value={bet}
          onChange={e => setBet(Math.max(0, Number(e.target.value)))}
          style={{ flex:1, background:'#12121f', border:'1px solid #2d2d3d',
            color:'#fff', borderRadius:10, padding:'10px 14px', fontSize:14,
            fontFamily:"'DM Sans',sans-serif", outline:'none' }} />
        <button onClick={onPlay} disabled={loading || bet > balance || bet < 10}
          style={{ background: loading || bet > balance || bet < 10 ? '#333' : '#fbbf24',
            color: loading || bet > balance || bet < 10 ? '#666' : '#0a0a0f',
            border:'none', borderRadius:10, padding:'10px 22px', fontSize:13,
            fontWeight:900, cursor: loading ? 'wait' : 'pointer',
            fontFamily:"'Syne',sans-serif", transition:'all .15s',
            boxShadow: bet <= balance && bet >= 10 ? '0 0 20px rgba(251,191,36,0.3)' : 'none',
          }}>
          {loading ? '⏳' : label}
        </button>
      </div>
      <p style={{ fontSize:11, color:'#555', marginTop:5 }}>
        Saldo: 🪙 {Number(balance).toLocaleString('id-ID')} koin
      </p>
    </div>
  );
};

// ─── RESULT BANNER ────────────────────────────────────────────────────────────
export const ResultBanner = ({ won, children }) => (
  <div style={{
    background: won ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
    border: `1px solid ${won ? '#10b981' : '#ef4444'}`,
    borderRadius:12, padding:'10px 16px', textAlign:'center',
    color: won ? '#6ee7b7' : '#fca5a5', fontWeight:700, fontSize:13,
    animation: won ? 'winPulse 0.6s ease' : 'fadeUp 0.3s ease',
    fontFamily:"'Syne',sans-serif", marginBottom:12,
  }}>{children}</div>
);

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{
    background:'#0f0f1a', border:'1px solid #1e1e30',
    borderRadius:20, padding:24,
    boxShadow:'0 4px 40px rgba(0,0,0,0.4)',
    ...style,
  }}>{children}</div>
);

export const labelStyle = {
  fontSize: 11, color: '#555', textTransform:'uppercase',
  letterSpacing:'0.1em', marginBottom:6, display:'block',
  fontFamily:"'Syne',sans-serif",
};
  
