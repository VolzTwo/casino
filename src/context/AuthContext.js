import { createContext, useContext, useState, useCallback } from 'react';
import { dbLogin, dbRegister, dbGetUser } from '../db';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('vc_session')); } catch { return null; }
  });

  const login = (username, password) => {
    const u = dbLogin(username, password);
    setUser(u);
    sessionStorage.setItem('vc_session', JSON.stringify(u));
    return u;
  };

  const register = (username, password) => {
    dbRegister(username, password);
    return login(username, password);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('vc_session');
  };

  const refresh = useCallback(() => {
    if (!user) return;
    const fresh = dbGetUser(user.id);
    setUser(fresh);
    sessionStorage.setItem('vc_session', JSON.stringify(fresh));
  }, [user]);

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
};
    
