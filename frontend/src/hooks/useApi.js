import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useApi = () => {
  const { logout } = useContext(AuthContext);

  const request = async (url, options = {}) => {
    const token = sessionStorage.getItem('auth_token');

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (res.status === 401) {
        logout();
        throw new Error('Nicht autorisiert');
      }

      if (res.status === 204) return null;

      const contentType = res.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        return await res.json();
      }

      return await res.text(); // z. B. für Fehlertexte
    } catch (err) {
      console.error('❌ API-Fehler:', err);
      throw err;
    }
  };

  return { request };
};
