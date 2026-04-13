import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbGetUser } from '../db';
import { Coin } from './UI';

const MENU = [
  { id:'dashboard', icon:'◈', label:'Dashboard' },
  { id:'games',     icon:'◉', label:'Main Game' },
  { id:'deposit',   icon:'▲', label:'Deposit' },
  { id:'withdraw',  icon:'▼', label:'Withdraw' },
  { id:'history',   icon:'≡', label:'Riwayat' },
];

export const Sidebar = ({ page, setPage }) => {
  const { user, logout } = useAuth();
  const fresh = user ? dbGetUser(user.id) : null;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 60 : 220, minHeight:'100vh',
      background:'#080810', borderRight:'1px solid #1a1a28',
      display:'flex', flexDirection:'column',
      transition:'width .25s cubic-bezier(0.4,0,0.2,1)',
      position:'relative', flexShrink:0,
    }}>
      {/* Logo */}
      <div style={{ padding:'20px 0 16px', textAlign:'center', borderBottom:'1px solid #1a1a28' }}>
        {collapsed
          ? <span style={{ fontSize:22 }}>🎰</span>
          : <div>
              <div style={{ fontSize:22, marginBottom:2 }}>🎰</div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15,
                background:'linear-gradient(135deg,#fbbf24,#f59e0b)', WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent' }}>VirtualCasino</span>
            </div>
        }
      </div>

      {/* User info */}
      {!collapsed && fresh && (
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #1a1a28' }}>
          <div style={{ fontSize:11, color:'#444', textTransform:'uppercase',
            letterSpacing:'0.1em', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>Pemain</div>
          <div style={{ fontWeight:700, color:'#e2e8f0', fontSize:14,
            fontFamily:"'Syne',sans-serif", marginBottom:2, overflow:'hidden',
            textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fresh.username}</div>
          <Coin amount={fresh.balance} size="sm" />
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 8px' }}>
        {MENU.map(m => {
          const active = page === m.id;
          return (
            <button key={m.id} onClick={() => setPage(m.id)} style={{
              width:'100%', display:'flex', alignItems:'center',
              gap:10, padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius:10, border:'none', cursor:'pointer',
              marginBottom:2, transition:'all .15s',
              background: active ? 'rgba(251,191,36,0.12)' : 'transparent',
              color: active ? '#fbbf24' : '#555',
              fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13,
            }}>
              <span style={{ fontSize:16, lineHeight:1 }}>{m.icon}</span>
              {!collapsed && m.label}
              {active && !collapsed && (
                <span style={{ marginLeft:'auto', width:4, height:4, borderRadius:'50%',
                  background:'#fbbf24', boxShadow:'0 0 8px #fbbf24' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding:'8px', borderTop:'1px solid #1a1a28' }}>
        <button onClick={logout} style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'flex-start',
          gap:10, padding: collapsed ? '10px 0' : '10px 12px', borderRadius:10,
          border:'none', cursor:'pointer', background:'transparent',
          color:'#554444', fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13,
          transition:'all .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#554444'; }}>
          <span style={{ fontSize:16 }}>⏻</span>
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(c => !c)} style={{
        position:'absolute', top:18, right:-12,
        width:24, height:24, borderRadius:'50%',
        background:'#1a1a28', border:'1px solid #2a2a3d',
        color:'#555', cursor:'pointer', fontSize:10,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>{collapsed ? '▶' : '◀'}</button>
    </aside>
  );
};
         
