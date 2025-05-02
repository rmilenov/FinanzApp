import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useApi = () => {
  const { logout } = useContext(AuthContext);

  const request = async (url, options = {}) => {
    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      });

      // Auto-logout bei 401
      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error('Zugriff verweigert. Bitte erneut anmelden.');
      }

      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      } else {
        return res;
      }
    } catch (err) {
      console.error('❌ API Fehler:', err);
      throw err;
    }
  };

  return { request };
};
