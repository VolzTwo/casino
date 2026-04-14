import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/UI';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { GamesPage } from './pages/GamesPage';
import { DepositPage, WithdrawPage, HistoryPage } from './pages/OtherPages';

const Main = () => {
  const { user } = useAuth();
  const [page, setPage]   = useState('dashboard');
  const [auth, setAuth]   = useState('login');
  const [toast, setToast] = useState(null);

  const addToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type, key: Date.now() });
  }, []);

  if (!user) {
    return auth === 'login'
      ? <LoginPage    onSwitch={() => setAuth('register')} />
      : <RegisterPage onSwitch={() => setAuth('login')} />;
  }

  const pageProps = { addToast };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0f' }}>
      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
        {page === 'dashboard' && <DashboardPage setPage={setPage} />}
        {page === 'games'     && <GamesPage     {...pageProps} />}
        {page === 'deposit'   && <DepositPage   {...pageProps} />}
        {page === 'withdraw'  && <WithdrawPage  {...pageProps} />}
        {page === 'history'   && <HistoryPage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
