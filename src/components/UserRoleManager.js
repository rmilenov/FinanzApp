// src/components/UserRoleManager.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const UserRoleManager = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const { request } = useApi();
  const { user } = useContext(AuthContext); // ⬅️ aktuelle Nutzerinfos
  const token = sessionStorage.getItem('auth_token'); // ⬅️ Token direkt holen

  useEffect(() => {
    // Benutzer abrufen
    request('http://localhost:5000/api/users')
      .then(setUsers)
      .catch((err) => console.error('Fehler beim Laden der Benutzer:', err));

    // Rollen abrufen
    request('http://localhost:5000/api/roles')
      .then((data) => {
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.error('❌ Rollen-Antwort ist kein Array:', data);
          setRoles([]);
        }
      })
      .catch((err) => console.error('Fehler beim Laden der Rollen:', err));
  }, []);

  const handleRoleChange = (userId, newRoleId) => {
    request('http://localhost:5000/api/user-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ userId, roleId: newRoleId }),
    })
      .then(() => {
        // Rolle im lokalen Zustand aktualisieren
        const newRole = roles.find((r) => r.id === newRoleId);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, role: newRole?.name ?? 'Unbekannt' } : u
          )
        );
      })
      .catch((err) => alert('Fehler beim Zuweisen der Rolle: ' + err.message));
  };

  return (
    <div>
      <h2>Benutzerrollen verwalten</h2>
      <table>
        <thead>
          <tr>
            <th>Benutzername</th>
            <th>Email</th>
            <th>Rolle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={
                    Array.isArray(roles)
                      ? roles.find((r) => r.name === u.role)?.id || ''
                      : ''
                  }
                  onChange={(e) =>
                    handleRoleChange(u.id, parseInt(e.target.value))
                  }
                  disabled={u.role === 'master'} // 👑 Master darf nicht verändert werden
                >
                  <option value="">Keine Rolle</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name === 'master' ? '👑 Master' : r.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleManager;
