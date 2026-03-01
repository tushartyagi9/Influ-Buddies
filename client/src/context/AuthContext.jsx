import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser, loginUser, registerUser } from '../api/client.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('influ_buddies_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem('influ_buddies_token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(credentials) {
    const res = await loginUser(credentials);
    localStorage.setItem('influ_buddies_token', res.token);
    setUser(res.user);
    return res;
  }

  async function handleRegister(payload) {
    const res = await registerUser(payload);
    localStorage.setItem('influ_buddies_token', res.token);
    setUser(res.user);
    return res;
  }

  function logout() {
    localStorage.removeItem('influ_buddies_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

