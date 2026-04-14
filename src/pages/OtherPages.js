import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbGetUser, dbDeposit, dbWithdraw, dbGetTxns } from '../db';
import { Card, Coin, labelStyle } from '../components/UI';

const inputStyle = {
  width:'100%', background:'#080810', border:'1px solid #1e1e30',
  color:'#e2e8f0', borderRadius:12, padding:'12px 16px', fontSize:14,
  fontFamily:"'DM Sans',sans-serif", outline:'none', marginBottom:12,
};

// ─── DEPOSIT ──────────────────────────────────────────────────────────────────
export const DepositPage = ({ addToast }) => {
  const { user, refresh } = useAuth();
  const fresh = dbGetUser(user.id);
  const [amount, setAmount] = useState('');
  const presets = [100, 500, 1000, 5000, 10000, 50000];

  const handle = (e) => {
    e.preventDefault();
    try {
      dbDeposit(user.id, Number(amount));
      refresh();
      addToast(`💰 Berhasil deposit ${Number(amount).toLocaleString()} koin!`, 'win');
      setAmount('');
    } catch (err) { addToast(err.message, 'error'); }
  };

  return (
    <div style={{ padding:'28px', maxWidth:480, animation:'fadeUp 0.4s ease' }}>
      <p style={labelStyle}>Tambah Saldo</p>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28,
        color:'#e2e8f0', margin:'0 0 6px' }}>Deposit Koin 💰</h2>
      <p style={{ color:'#555', fontSize:13, marginBottom:24,
        fontFamily:"'DM Sans',sans-serif" }}>Tambah koin virtual ke akunmu</p>

      <Card style={{ marginBottom:16 }}>
        <p style={labelStyle}>Saldo Sekarang</p>
        <Coin amount={fresh.balance} size="lg" />
      </Card>

      <Card>
        <p style={labelStyle}>Pilih Jumlah Deposit</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
          {presets.map(p => (
            <button key={p} onClick={() => setAmount(String(p))} style={{
              padding:'10px', borderRadius:10, fontSize:13, fontWeight:700,
              border: Number(amount)===p ? 'none' : '1px solid #1e1e30',
              background: Number(amount)===p ? '#fbbf24' : '#080810',
              color: Number(amount)===p ? '#0a0a0f' : '#888',
              cursor:'pointer', transition:'all .15s', fontFamily:"'Syne',sans-serif",
            }}>🪙 {p.toLocaleString()}</button>
          ))}
        </div>
        <form onSubmit={handle}>
          <input type="number" style={inputStyle} placeholder="Atau masukkan jumlah lain..."
            value={amount} onChange={e => setAmount(e.target.value)}
            onFocus={e => e.target.style.borderColor='#fbbf24'}
            onBlur={e => e.target.style.borderColor='#1e1e30'} />
          <button type="submit" style={{
            width:'100%', padding:'13px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#fbbf24,#f59e0b)', color:'#0a0a0f',
            fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:14, cursor:'pointer',
            boxShadow:'0 4px 24px rgba(251,191,36,0.3)',
          }}>💰 DEPOSIT SEKARANG</button>
        </form>
      </Card>
    </div>
  );
};

// ─── WITHDRAW ─────────────────────────────────────────────────────────────────
export const WithdrawPage = ({ addToast }) => {
  const { user, refresh } = useAuth();
  const fresh = dbGetUser(user.id);
  const [amount, setAmount] = useState('');

  const handle = (e) => {
    e.preventDefault();
    try {
      dbWithdraw(user.id, Number(amount));
      refresh();
      addToast(`💸 Berhasil withdraw ${Number(amount).toLocaleString()} koin!`, 'info');
      setAmount('');
    } catch (err) { addToast(err.message, 'error'); }
  };

  const over = Number(amount) > fresh.balance;

  return (
    <div style={{ padding:'28px', maxWidth:480, animation:'fadeUp 0.4s ease' }}>
      <p style={labelStyle}>Tarik Saldo</p>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28,
        color:'#e2e8f0', margin:'0 0 6px' }}>Withdraw Koin 💸</h2>
      <p style={{ color:'#555', fontSize:13, marginBottom:24,
        fontFamily:"'DM Sans',sans-serif" }}>Kurangi saldo koin virtualmu</p>

      <Card style={{ marginBottom:16 }}>
        <p style={labelStyle}>Saldo Tersedia</p>
        <Coin amount={fresh.balance} size="lg" />
      </Card>

      <Card>
        <form onSubmit={handle}>
          <p style={labelStyle}>Jumlah Koin yang Ingin Ditarik</p>
          <input type="number" style={{ ...inputStyle, borderColor: over ? '#ef4444' : '#1e1e30' }}
            placeholder="Masukkan jumlah..." value={amount}
            onChange={e => setAmount(e.target.value)}
            onFocus={e => { if (!over) e.target.style.borderColor='#ef4444'; }}
            onBlur={e => { if (!over) e.target.style.borderColor='#1e1e30'; }} />
          {over && <p style={{ color:'#ef4444', fontSize:12, marginTop:-8, marginBottom:10,
            fontFamily:"'DM Sans',sans-serif" }}>⚠️ Jumlah melebihi saldo</p>}
          <button type="submit" disabled={over || !amount || Number(amount) <= 0} style={{
            width:'100%', padding:'13px', borderRadius:12, border:'none',
            background: over || !amount ? '#1a1a2e' : 'linear-gradient(135deg,#ef4444,#dc2626)',
            color: over || !amount ? '#555' : '#fff',
            fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:14, cursor:'pointer',
            boxShadow: !over && amount ? '0 4px 24px rgba(239,68,68,0.3)' : 'none',
            transition:'all .2s',
          }}>💸 WITHDRAW</button>
        </form>
      </Card>
    </div>
  );
};

// ─── HISTORY ──────────────────────────────────────────────────────────────────
const TYPE_STYLE = {
  win:      { bg:'rgba(16,185,129,0.1)',  border:'#10b981', color:'#6ee7b7', label:'🏆 Menang'  },
  loss:     { bg:'rgba(239,68,68,0.1)',   border:'#ef4444', color:'#fca5a5', label:'💔 Kalah'   },
  deposit:  { bg:'rgba(99,102,241,0.1)',  border:'#6366f1', color:'#a5b4fc', label:'💰 Deposit' },
  withdraw: { bg:'rgba(245,158,11,0.1)',  border:'#f59e0b', color:'#fcd34d', label:'💸 Withdraw'},
};

export const HistoryPage = () => {
  const { user } = useAuth();
  const txns = dbGetTxns(user.id);

  return (
    <div style={{ padding:'28px', maxWidth:900, animation:'fadeUp 0.4s ease' }}>
      <p style={labelStyle}>Aktivitas Akun</p>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28,
        color:'#e2e8f0', margin:'0 0 24px' }}>Riwayat Transaksi 📋</h2>

      {txns.length === 0 ? (
        <div style={{ textAlign:'center', padding:'64px 0', color:'#444' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <p style={{ fontFamily:"'DM Sans',sans-serif" }}>Belum ada transaksi</p>
        </div>
      ) : (
        <div style={{ background:'#0f0f1a', border:'1px solid #1e1e30', borderRadius:20, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'130px 110px 1fr auto auto',
            gap:12, padding:'12px 20px', borderBottom:'1px solid #1a1a28',
            fontSize:10, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em',
            fontFamily:"'Syne',sans-serif" }}>
            <span>Waktu</span><span>Tipe</span><span>Keterangan</span>
            <span style={{ textAlign:'right' }}>Jumlah</span>
            <span style={{ textAlign:'right' }}>Saldo</span>
          </div>

          {txns.map((t, i) => {
            const ts = TYPE_STYLE[t.type] || TYPE_STYLE.deposit;
            const isPositive = t.type === 'win' || t.type === 'deposit';
            return (
              <div key={t.id} style={{
                display:'grid', gridTemplateColumns:'130px 110px 1fr auto auto',
                gap:12, padding:'12px 20px', alignItems:'center',
                borderBottom: i < txns.length-1 ? '1px solid #12121f' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}>
                <span style={{ fontSize:11, color:'#555', fontFamily:"'DM Sans',sans-serif" }}>
                  {new Date(t.created_at).toLocaleString('id-ID',
                    { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                </span>
                <span style={{ display:'inline-flex', alignItems:'center',
                  background: ts.bg, border:`1px solid ${ts.border}33`,
                  color: ts.color, borderRadius:8, padding:'3px 8px',
                  fontSize:11, fontWeight:700, fontFamily:"'Syne',sans-serif",
                  width:'fit-content' }}>{ts.label}</span>
                <span style={{ fontSize:12, color:'#666', fontFamily:"'DM Sans',sans-serif",
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {t.description}
                </span>
                <span style={{ fontWeight:700, fontSize:13, textAlign:'right',
                  color: isPositive ? '#10b981' : '#ef4444',
                  fontFamily:"'Syne',sans-serif" }}>
                  {isPositive ? '+' : '-'}{Number(t.amount).toLocaleString()}
                </span>
                <span style={{ fontSize:11, color:'#fbbf24', textAlign:'right',
                  fontFamily:"'Syne',sans-serif", fontWeight:700 }}>
                  🪙 {Number(t.balance_after).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
