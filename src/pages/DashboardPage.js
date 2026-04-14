import { Card, Coin, labelStyle } from '../components/UI';
import { dbGetUser } from '../db';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = ({ setPage }) => {
  const { user } = useAuth();
  const fresh = dbGetUser(user.id);
  const total = fresh.total_wins + fresh.total_losses;
  const rate  = total > 0 ? ((fresh.total_wins / total) * 100).toFixed(1) : '0.0';

  const stats = [
    { label:'Total Menang', val: fresh.total_wins, icon:'🏆', color:'#10b981' },
    { label:'Total Kalah',  val: fresh.total_losses, icon:'💔', color:'#ef4444' },
    { label:'Win Rate',     val: `${rate}%`, icon:'📈', color:'#6366f1' },
    { label:'Total Ronde',  val: total, icon:'🎮', color:'#f59e0b' },
  ];

  return (
    <div style={{ padding:'28px 28px', maxWidth:820, animation:'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <p style={{ ...labelStyle, marginBottom:4 }}>Selamat datang kembali</p>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, margin:0, color:'#e2e8f0' }}>
          Halo, {fresh.username}! 👋
        </h2>
      </div>

      {/* Balance card */}
      <div style={{
        background:'linear-gradient(135deg,#78350f 0%,#92400e 50%,#78350f 100%)',
        borderRadius:20, padding:'24px 28px', marginBottom:20, position:'relative', overflow:'hidden',
        animation:'pulse-glow 3s ease-in-out infinite',
        border:'1px solid rgba(251,191,36,0.2)',
      }}>
        <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160,
          background:'rgba(251,191,36,0.06)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', left:-20, bottom:-20, width:100, height:100,
          background:'rgba(0,0,0,0.15)', borderRadius:'50%' }} />
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, textTransform:'uppercase',
          letterSpacing:'0.15em', fontFamily:"'Syne',sans-serif", marginBottom:8 }}>
          Saldo Koin Virtual
        </p>
        <div style={{ marginBottom:18 }}><Coin amount={fresh.balance} size="xl" /></div>
        <div style={{ display:'flex', gap:10 }}>
          {[['+ Deposit','deposit','rgba(255,255,255,0.15)'],['- Withdraw','withdraw','rgba(0,0,0,0.2)']].map(([lbl,pg,bg]) => (
            <button key={pg} onClick={() => setPage(pg)} style={{
              background:bg, border:'1px solid rgba(255,255,255,0.15)',
              color:'#fff', borderRadius:10, padding:'7px 16px', fontSize:13,
              fontFamily:"'Syne',sans-serif", fontWeight:700, cursor:'pointer', transition:'all .15s',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:20, color: s.color }}>
              {s.val}
            </div>
            <div style={{ fontSize:11, color:'#444', marginTop:3, fontFamily:"'DM Sans',sans-serif" }}>
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick play */}
      <Card>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16,
          color:'#e2e8f0', marginBottom:14 }}>Pilih Game 🎮</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { e:'🎰', n:'Slot Machine', d:'Jackpot hingga 50×', color:'#f59e0b' },
            { e:'🎡', n:'Spin Wheel',   d:'Menang hingga 10×',  color:'#10b981' },
            { e:'🎯', n:'Tebak Angka',  d:'Tebak benar, 8×',   color:'#6366f1' },
          ].map(g => (
            <button key={g.n} onClick={() => setPage('games')} style={{
              background:'#12121f', border:'1px solid #1e1e30', borderRadius:14,
              padding:'16px 12px', textAlign:'center', cursor:'pointer', transition:'all .2s',
              fontFamily:"'Syne',sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = g.color + '66'; e.currentTarget.style.background='#161625'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#1e1e30'; e.currentTarget.style.background='#12121f'; }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{g.e}</div>
              <div style={{ fontWeight:700, fontSize:13, color:'#e2e8f0', marginBottom:3 }}>{g.n}</div>
              <div style={{ fontSize:11, color:'#555' }}>{g.d}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
