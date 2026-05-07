import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (payload) => {
    const res = await api.post('/api/auth/login', payload);
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.post('/api/auth/register', payload);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (!cancelled) setUser(res.data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
