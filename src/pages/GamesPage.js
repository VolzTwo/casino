import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbGetUser, dbPlaySlot, dbPlayWheel, dbPlayNumber, WHEEL_SEGS } from '../db';
import { BetControls, ResultBanner, Card, Coin, labelStyle } from '../components/UI';

// ─── SLOT MACHINE ─────────────────────────────────────────────────────────────
const SYMS   = ['🍒','🍋','🍊','🍇','💎','7️⃣','⭐'];
const PAYOUTS = [['💎💎💎','50×'],['7️⃣7️⃣7️⃣','30×'],['⭐⭐⭐','20×'],['🍇🍇🍇','10×'],['🍊🍊🍊','8×'],['🍋🍋🍋','5×'],['🍒🍒🍒','3×']];

const SlotGame = ({ user, onUpdate, addToast }) => {
  const [bet, setBet] = useState(50);
  const [reels, setReels] = useState(['🎰','🎰','🎰']);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const iRef = useRef(null);

  const play = () => {
    if (bet > user.balance) { addToast('❌ Saldo tidak mencukupi!','error'); return; }
    setSpinning(true); setResult(null);
    let ticks = 0;
    iRef.current = setInterval(() => {
      setReels([0,1,2].map(() => SYMS[Math.floor(Math.random() * SYMS.length)]));
      if (++ticks > 18) {
        clearInterval(iRef.current);
        const res = dbPlaySlot(user.id, bet);
        setReels(res.reels);
        setResult(res);
        setSpinning(false);
        onUpdate();
        addToast(res.won ? `🎰 MENANG! +${res.prize.toLocaleString()} koin!` : '🎰 Coba lagi!', res.won ? 'win' : 'info');
      }
    }, 80);
  };

  return (
    <Card>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, textAlign:'center',
        marginBottom:4, color:'#e2e8f0' }}>🎰 Slot Machine</h3>
      <p style={{ textAlign:'center', color:'#555', fontSize:12, marginBottom:20,
        fontFamily:"'DM Sans',sans-serif" }}>Cocokkan 3 simbol untuk menang!</p>

      {/* Reels */}
      <div style={{ background:'#080810', border:'2px solid rgba(251,191,36,0.2)',
        borderRadius:16, padding:'20px 0', display:'flex', justifyContent:'center',
        gap:12, marginBottom:16,
        boxShadow: spinning ? '0 0 40px rgba(251,191,36,0.15) inset' : 'none',
        transition:'box-shadow .3s' }}>
        {reels.map((s, i) => (
          <div key={i} style={{
            width:72, height:72, background:'#0f0f1a',
            border:`2px solid ${spinning ? '#fbbf2466' : '#1e1e30'}`,
            borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:32, transition:'border-color .3s',
            animation: spinning ? `spinReel 0.${2+i}s linear infinite` : `${result?.won ? 'winPulse 0.6s ease' : 'none'}`,
          }}>{s}</div>
        ))}
      </div>

      {/* Paytable */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4, marginBottom:14 }}>
        {PAYOUTS.map(([c,m]) => (
          <div key={c} style={{ textAlign:'center', background:'#080810', borderRadius:8,
            padding:'6px 4px', border:'1px solid #1a1a28' }}>
            <div style={{ fontSize:11 }}>{c}</div>
            <div style={{ color:'#fbbf24', fontWeight:700, fontSize:11,
              fontFamily:"'Syne',sans-serif" }}>{m}</div>
          </div>
        ))}
      </div>

      {result && (
        <ResultBanner won={result.won}>
          {result.won ? `🏆 ${result.reels.join('')} × ${result.multiplier} = +${result.prize.toLocaleString()} koin!`
            : `💔 Tidak cocok (${result.reels.join('')})`}
        </ResultBanner>
      )}
      <BetControls bet={bet} setBet={setBet} balance={user.balance} onPlay={play} loading={spinning} label="🎰 PUTAR!" />
    </Card>
  );
};

// ─── SPIN WHEEL ────────────────────────────────────────────────────────────────
const WheelGame = ({ user, onUpdate, addToast }) => {
  const [bet, setBet]         = useState(50);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult]   = useState(null);
  const N = WHEEL_SEGS.length;
  const segDeg = 360 / N;

  const play = () => {
    if (bet > user.balance) { addToast('❌ Saldo tidak mencukupi!','error'); return; }
    setSpinning(true); setResult(null);
    const res = dbPlayWheel(user.id, bet);
    // Land so pointer (top) hits segIdx
    const target = 360 * 6 + (N - res.segIdx) * segDeg - segDeg / 2;
    setRotation(r => r + target);
    setTimeout(() => {
      setResult(res); setSpinning(false); onUpdate();
      addToast(res.won ? `🎡 MENANG! +${res.prize.toLocaleString()} koin!` : '🎡 Coba lagi!', res.won ? 'win' : 'info');
    }, 3200);
  };

  return (
    <Card>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, textAlign:'center',
        marginBottom:4, color:'#e2e8f0' }}>🎡 Spin Wheel</h3>
      <p style={{ textAlign:'center', color:'#555', fontSize:12, marginBottom:20,
        fontFamily:"'DM Sans',sans-serif" }}>Putar roda dan raih hadiah!</p>

      <div style={{ display:'flex', justifyContent:'center', marginBottom:20, position:'relative' }}>
        {/* pointer */}
        <div style={{ position:'absolute', top:-4, left:'50%', transform:'translateX(-50%)',
          fontSize:20, zIndex:10, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>▼</div>
        <svg width={220} height={220} viewBox="0 0 220 220"
          style={{ transform:`rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.2s cubic-bezier(0.17,0.67,0.08,0.99)' : 'none',
            filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}>
          {WHEEL_SEGS.map((seg, i) => {
            const a1 = (i * segDeg - 90) * Math.PI / 180;
            const a2 = ((i + 1) * segDeg - 90) * Math.PI / 180;
            const r = 100, cx = 110, cy = 110;
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
            const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
            const mx = cx + 62 * Math.cos((a1+a2)/2), my = cy + 62 * Math.sin((a1+a2)/2);
            const angle = ((i + 0.5) * segDeg - 90);
            return (
              <g key={i}>
                <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={seg.color} stroke="#0a0a0f" strokeWidth={1.5} />
                <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                  fill="#fff" fontSize={11} fontWeight="bold"
                  transform={`rotate(${angle}, ${mx}, ${my})`}
                  style={{ fontFamily:"'Syne',sans-serif", pointerEvents:'none' }}>
                  {seg.label}
                </text>
              </g>
            );
          })}
          <circle cx={110} cy={110} r={14} fill="#0a0a0f" stroke="#fbbf24" strokeWidth={2} />
        </svg>
      </div>

      {result && (
        <ResultBanner won={result.won}>
          {result.won ? `🏆 ${result.segment.label}! Menang +${result.prize.toLocaleString()} koin!`
            : '💔 LOSE — Coba lagi!'}
        </ResultBanner>
      )}
      <BetControls bet={bet} setBet={setBet} balance={user.balance} onPlay={play} loading={spinning} label="🎡 PUTAR!" />
    </Card>
  );
};

// ─── NUMBER GUESS ──────────────────────────────────────────────────────────────
const NumberGame = ({ user, onUpdate, addToast }) => {
  const [bet, setBet]       = useState(50);
  const [guess, setGuess]   = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const play = () => {
    if (bet > user.balance) { addToast('❌ Saldo tidak mencukupi!','error'); return; }
    setLoading(true); setResult(null);
    setTimeout(() => {
      const res = dbPlayNumber(user.id, bet, guess);
      setResult(res); setLoading(false); onUpdate();
      addToast(res.won ? `🎯 BENAR! +${res.prize.toLocaleString()} koin!` : `🎯 Salah! Jawaban: ${res.answer}`, res.won ? 'win' : 'info');
    }, 900);
  };

  return (
    <Card>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, textAlign:'center',
        marginBottom:4, color:'#e2e8f0' }}>🎯 Tebak Angka</h3>
      <p style={{ textAlign:'center', color:'#555', fontSize:12, marginBottom:20,
        fontFamily:"'DM Sans',sans-serif" }}>Tebak angka 1–10 • Menang 8× taruhan!</p>

      {/* Reveal box */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
        <div style={{
          width:110, height:110, borderRadius:20,
          border:`2px solid ${result ? (result.won ? '#10b981' : '#ef4444') : '#1e1e30'}`,
          background: result ? (result.won ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : '#0f0f1a',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:52, fontFamily:"'Syne',sans-serif", fontWeight:900,
          color: result ? (result.won ? '#10b981' : '#ef4444') : '#333',
          transition:'all .3s',
          animation: result ? 'numberReveal 0.5s cubic-bezier(0.34,1.56,0.64,1)' : loading ? 'pulse-glow 0.5s ease infinite' : 'none',
        }}>
          {loading ? <span style={{ animation:'float 0.4s ease-in-out infinite' }}>🎲</span>
            : result ? result.answer : '?'}
        </div>
      </div>

      {/* Number grid */}
      <div style={{ marginBottom:16 }}>
        <p style={labelStyle}>Pilih Angka Tebakanmu</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button key={n} onClick={() => setGuess(n)} style={{
              height:44, borderRadius:10, border: guess===n ? 'none' : '1px solid #1e1e30',
              background: guess===n ? '#fbbf24' : '#12121f',
              color: guess===n ? '#0a0a0f' : '#aaa',
              fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:16,
              cursor:'pointer', transition:'all .15s',
            }}>{n}</button>
          ))}
        </div>
      </div>

      {result && (
        <ResultBanner won={result.won}>
          {result.won ? `🎉 Tebakan ${result.guess} BENAR! Menang +${result.prize.toLocaleString()} koin!`
            : `❌ Tebakan ${result.guess} salah — Jawaban: ${result.answer}`}
        </ResultBanner>
      )}
      <BetControls bet={bet} setBet={setBet} balance={user.balance} onPlay={play} loading={loading} label="🎯 TEBAK!" />
    </Card>
  );
};

// ─── GAMES PAGE ────────────────────────────────────────────────────────────────
const TABS = [
  { id:'slot',   label:'🎰 Slot Machine' },
  { id:'wheel',  label:'🎡 Spin Wheel' },
  { id:'number', label:'🎯 Tebak Angka' },
];

export const GamesPage = ({ addToast }) => {
  const { user, refresh } = useAuth();
  const [active, setActive] = useState('slot');
  const fresh = dbGetUser(user.id);

  const props = { user: fresh, onUpdate: refresh, addToast };

  return (
    <div style={{ padding:'28px', maxWidth:600, animation:'fadeUp 0.4s ease' }}>
      <div style={{ marginBottom:24 }}>
        <p style={labelStyle}>Arena</p>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:'#e2e8f0', margin:0 }}>
          Main Game 🎮
        </h2>
        <div style={{ marginTop:6 }}><Coin amount={fresh.balance} size="sm" /></div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding:'8px 14px', borderRadius:10, border: active===t.id ? 'none' : '1px solid #1e1e30',
            background: active===t.id ? '#fbbf24' : '#0f0f1a',
            color: active===t.id ? '#0a0a0f' : '#666',
            fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer',
            transition:'all .15s',
          }}>{t.label}</button>
        ))}
      </div>

      {active === 'slot'   && <SlotGame   {...props} />}
      {active === 'wheel'  && <WheelGame  {...props} />}
      {active === 'number' && <NumberGame {...props} />}
    </div>
  );
};
