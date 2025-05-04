import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useApi = () => {
  const { logout } = useContext(AuthContext);
  const token = sessionStorage.getItem('auth_token');

  const request = async (url, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Cache-Control': 'no-cache'
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {}),
        },
      });

      if (res.status === 401) {
        logout();
        throw new Error('Nicht autorisiert');
      }

      if (res.status === 204) {
        return null; // kein Inhalt (z. B. bei DELETE)
      }

      if (res.status === 304) {
        return null; // nicht verändert (z. B. durch Cache)
      }

      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }

      return res.text();
    } catch (err) {
      console.error('API-Fehler:', err);
      throw err;
    }
  };

  return { request };
};
