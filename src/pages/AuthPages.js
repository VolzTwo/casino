import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width:'100%', background:'#0f0f1a', border:'1px solid #1e1e30',
  color:'#e2e8f0', borderRadius:12, padding:'12px 16px', fontSize:14,
  fontFamily:"'DM Sans',sans-serif", outline:'none', transition:'border-color .2s',
  marginBottom:12,
};
const btnStyle = {
  width:'100%', padding:'13px', borderRadius:12, border:'none',
  fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:14,
  cursor:'pointer', transition:'all .2s', letterSpacing:'0.05em',
};

// Floating particles bg
const Particles = () => (
  <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
    {['🎰','🎲','🃏','🎡','💎','7️⃣','⭐'].map((e, i) => (
      <div key={i} style={{
        position:'absolute', fontSize: 18 + (i % 3) * 8,
        left: `${10 + i * 13}%`, top: `${5 + (i % 4) * 22}%`,
        opacity:0.04 + (i % 3) * 0.02,
        animation:`float ${4 + i}s ease-in-out infinite`,
        animationDelay:`${i * 0.7}s`,
      }}>{e}</div>
    ))}
  </div>
);

export const LoginPage = ({ onSwitch }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { login(form.username, form.password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.06) 0%, #0a0a0f 70%)',
      position:'relative' }}>
      <Particles />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400, padding:'0 20px',
        animation:'fadeUp 0.5s ease' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:8, animation:'float 3s ease-in-out infinite' }}>🎰</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:30, margin:0,
            background:'linear-gradient(135deg,#fbbf24 0%,#f97316 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            VirtualCasino
          </h1>
          <p style={{ color:'#444', fontSize:13, marginTop:6, fontFamily:"'DM Sans',sans-serif" }}>
            Hiburan koin virtual • Bukan uang asli
          </p>
        </div>

        <div style={{ background:'#0f0f1a', border:'1px solid #1e1e30', borderRadius:20, padding:28,
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:20,
            color:'#e2e8f0' }}>Masuk ke Akun</h2>

          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
            borderRadius:10, padding:'10px 14px', color:'#fca5a5', fontSize:13,
            marginBottom:14, fontFamily:"'DM Sans',sans-serif" }}>{error}</div>}

          <form onSubmit={handle}>
            <input style={inputStyle} placeholder="Username" value={form.username}
              onChange={e => setForm(f => ({ ...f, username:e.target.value }))}
              onFocus={e => e.target.style.borderColor='#fbbf24'}
              onBlur={e => e.target.style.borderColor='#1e1e30'} />
            <input type="password" style={inputStyle} placeholder="Password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password:e.target.value }))}
              onFocus={e => e.target.style.borderColor='#fbbf24'}
              onBlur={e => e.target.style.borderColor='#1e1e30'} />
            <button type="submit" disabled={loading} style={{
              ...btnStyle,
              background: loading ? '#333' : 'linear-gradient(135deg,#fbbf24,#f59e0b)',
              color: loading ? '#666' : '#0a0a0f',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(251,191,36,0.35)',
            }}>
              {loading ? 'Memproses...' : 'MASUK →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:16, color:'#444', fontSize:13,
            fontFamily:"'DM Sans',sans-serif" }}>
            Belum punya akun?{' '}
            <button onClick={onSwitch} style={{ background:'none', border:'none', cursor:'pointer',
              color:'#fbbf24', fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:13 }}>
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = ({ onSwitch }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Password tidak cocok'); return; }
    setLoading(true);
    try { register(form.username, form.password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, #0a0a0f 70%)',
      position:'relative' }}>
      <Particles />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400, padding:'0 20px',
        animation:'fadeUp 0.5s ease' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:8, animation:'float 3s ease-in-out infinite' }}>🎲</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:30, margin:0,
            background:'linear-gradient(135deg,#a78bfa 0%,#6366f1 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Buat Akun Baru
          </h1>
          <p style={{ color:'#fbbf24', fontSize:13, marginTop:6, fontWeight:700,
            fontFamily:"'Syne',sans-serif" }}>
            🎁 Daftar & dapat 1.000 koin gratis!
          </p>
        </div>

        <div style={{ background:'#0f0f1a', border:'1px solid #1e1e30', borderRadius:20, padding:28,
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
            borderRadius:10, padding:'10px 14px', color:'#fca5a5', fontSize:13,
            marginBottom:14, fontFamily:"'DM Sans',sans-serif" }}>{error}</div>}

          <form onSubmit={handle}>
            {[['Username','username','text','Min. 3 karakter'],
              ['Password','password','password','Min. 6 karakter'],
              ['Konfirmasi','confirm','password','Ulangi password']].map(([lbl,field,type,ph]) => (
              <input key={field} type={type} style={inputStyle} placeholder={`${lbl} — ${ph}`}
                value={form[field]} onChange={e => setForm(f => ({ ...f, [field]:e.target.value }))}
                onFocus={e => e.target.style.borderColor='#a78bfa'}
                onBlur={e => e.target.style.borderColor='#1e1e30'} />
            ))}
            <button type="submit" disabled={loading} style={{
              ...btnStyle,
              background: loading ? '#333' : 'linear-gradient(135deg,#a78bfa,#6366f1)',
              color: loading ? '#666' : '#fff',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.4)',
            }}>
              {loading ? 'Memproses...' : 'DAFTAR SEKARANG →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:16, color:'#444', fontSize:13,
            fontFamily:"'DM Sans',sans-serif" }}>
            Sudah punya akun?{' '}
            <button onClick={onSwitch} style={{ background:'none', border:'none', cursor:'pointer',
              color:'#fbbf24', fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:13 }}>
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
