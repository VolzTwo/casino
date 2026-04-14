// ─── LocalStorage "Database" ──────────────────────────────────────────────────
// Simulates Express + SQLite backend entirely in the browser.
// Each user's data is isolated by username key.

const DB_USERS_KEY = 'vc_users';
const DB_TXN_KEY   = 'vc_transactions';

const load = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const getUsers = () => load(DB_USERS_KEY);
const getTxns  = () => load(DB_TXN_KEY);

// Simple hash — in prod this is bcrypt on the server
const hashPw = (pw) => btoa(unescape(encodeURIComponent(pw)));

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const dbRegister = (username, password) => {
  if (!username || username.trim().length < 3) throw new Error('Username minimal 3 karakter');
  if (!password || password.length < 6) throw new Error('Password minimal 6 karakter');
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error('Username sudah dipakai');

  const user = {
    id: `u_${Date.now()}`,
    username: username.trim(),
    password: hashPw(password),
    balance: 1000,
    total_wins: 0,
    total_losses: 0,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  save(DB_USERS_KEY, users);

  // Welcome bonus transaction
  const txns = getTxns();
  txns.push({ id: `t_${Date.now()}`, user_id: user.id, type: 'deposit', amount: 1000,
    result: 'success', balance_after: 1000, game: null,
    description: '🎉 Bonus selamat datang', created_at: new Date().toISOString() });
  save(DB_TXN_KEY, txns);

  return sanitize(user);
};

export const dbLogin = (username, password) => {
  const user = getUsers().find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === hashPw(password)
  );
  if (!user) throw new Error('Username atau password salah');
  return sanitize(user);
};

export const dbGetUser = (id) => {
  const u = getUsers().find(u => u.id === id);
  if (!u) throw new Error('User tidak ditemukan');
  return sanitize(u);
};

const sanitize = (u) => ({
  id: u.id, username: u.username, balance: u.balance,
  total_wins: u.total_wins, total_losses: u.total_losses,
});

// ─── WALLET ───────────────────────────────────────────────────────────────────
const updateUser = (id, patch) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  Object.assign(users[idx], patch);
  save(DB_USERS_KEY, users);
  return users[idx];
};

const addTxn = (txn) => {
  const txns = getTxns();
  txns.push({ id: `t_${Date.now()}_${Math.random().toString(36).slice(2)}`, ...txn, created_at: new Date().toISOString() });
  save(DB_TXN_KEY, txns);
};

export const dbDeposit = (userId, amount) => {
  const amt = Number(amount);
  if (!amt || amt <= 0 || amt > 100000) throw new Error('Jumlah deposit tidak valid (1 – 100.000)');
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  const newBal = user.balance + amt;
  updateUser(userId, { balance: newBal });
  addTxn({ user_id: userId, type: 'deposit', amount: amt, result: 'success',
    balance_after: newBal, game: null, description: `💰 Deposit ${amt.toLocaleString()} koin` });
  return newBal;
};

export const dbWithdraw = (userId, amount) => {
  const amt = Number(amount);
  if (!amt || amt <= 0) throw new Error('Jumlah tidak valid');
  const user = getUsers().find(u => u.id === userId);
  if (user.balance < amt) throw new Error('Saldo tidak mencukupi');
  const newBal = user.balance - amt;
  updateUser(userId, { balance: newBal });
  addTxn({ user_id: userId, type: 'withdraw', amount: amt, result: 'success',
    balance_after: newBal, game: null, description: `💸 Withdraw ${amt.toLocaleString()} koin` });
  return newBal;
};

export const dbGetTxns = (userId) =>
  getTxns().filter(t => t.user_id === userId).reverse().slice(0, 100);

// ─── GAMES ────────────────────────────────────────────────────────────────────
const processGame = (userId, bet, won, prize, gameName, description) => {
  const user = getUsers().find(u => u.id === userId);
  if (user.balance < bet) throw new Error('Saldo tidak mencukupi');
  const newBal = won ? user.balance - bet + prize : user.balance - bet;
  updateUser(userId, {
    balance: newBal,
    total_wins: user.total_wins + (won ? 1 : 0),
    total_losses: user.total_losses + (won ? 0 : 1),
  });
  addTxn({ user_id: userId, type: won ? 'win' : 'loss',
    amount: won ? prize - bet : bet, result: won ? 'win' : 'loss',
    balance_after: newBal, game: gameName, description });
  return newBal;
};

// Slot
const SLOT_SYMS = ['🍒','🍋','🍊','🍇','💎','7️⃣','⭐'];
const SLOT_PAY  = { '💎💎💎':50,'7️⃣7️⃣7️⃣':30,'⭐⭐⭐':20,'🍇🍇🍇':10,'🍊🍊🍊':8,'🍋🍋🍋':5,'🍒🍒🍒':3 };

export const dbPlaySlot = (userId, bet) => {
  if (bet < 10 || bet > 10000) throw new Error('Taruhan 10 – 10.000');
  const reels = [0,1,2].map(() => SLOT_SYMS[Math.floor(Math.random() * SLOT_SYMS.length)]);
  const combo = reels.join('');
  const multi = SLOT_PAY[combo] || 0;
  const won   = multi > 0;
  const prize = won ? bet * multi : 0;
  const newBal = processGame(userId, bet, won, prize, '🎰 Slot Machine',
    `${combo} → ${won ? `Menang ${prize.toLocaleString()}` : 'Kalah'}`);
  return { reels, won, prize, multiplier: multi, balance: newBal };
};

// Wheel
const WHEEL_SEGS = [
  { label:'2x',   multiplier:2,  prob:0.20, color:'#f59e0b' },
  { label:'LOSE', multiplier:0,  prob:0.18, color:'#1e293b' },
  { label:'3x',   multiplier:3,  prob:0.12, color:'#10b981' },
  { label:'LOSE', multiplier:0,  prob:0.18, color:'#0f172a' },
  { label:'5x',   multiplier:5,  prob:0.08, color:'#6366f1' },
  { label:'LOSE', multiplier:0,  prob:0.14, color:'#1e293b' },
  { label:'10x',  multiplier:10, prob:0.04, color:'#ef4444' },
  { label:'LOSE', multiplier:0,  prob:0.06, color:'#0f172a' },
];

export { WHEEL_SEGS };

export const dbPlayWheel = (userId, bet) => {
  if (bet < 10 || bet > 10000) throw new Error('Taruhan 10 – 10.000');
  const rand = Math.random();
  let cum = 0, segIdx = WHEEL_SEGS.length - 1;
  for (let i = 0; i < WHEEL_SEGS.length; i++) {
    cum += WHEEL_SEGS[i].prob;
    if (rand < cum) { segIdx = i; break; }
  }
  const seg   = WHEEL_SEGS[segIdx];
  const won   = seg.multiplier > 0;
  const prize = won ? bet * seg.multiplier : 0;
  const newBal = processGame(userId, bet, won, prize, '🎡 Spin Wheel',
    `${seg.label} → ${won ? `Menang ${prize.toLocaleString()}` : 'Kalah'}`);
  return { segment: seg, segIdx, won, prize, balance: newBal };
};

// Number
export const dbPlayNumber = (userId, bet, guess) => {
  if (bet < 10 || bet > 10000) throw new Error('Taruhan 10 – 10.000');
  if (guess < 1 || guess > 10) throw new Error('Tebak angka 1–10');
  const answer = Math.floor(Math.random() * 10) + 1;
  const won    = Number(guess) === answer;
  const prize  = won ? bet * 8 : 0;
  const newBal = processGame(userId, bet, won, prize, '🎯 Tebak Angka',
    `Tebak: ${guess} | Jawaban: ${answer} → ${won ? `Menang ${prize.toLocaleString()}` : 'Kalah'}`);
  return { guess: Number(guess), answer, won, prize, balance: newBal };
};
