import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth'; // Falls du einen Token-Helper nutzt

const UserRoleManager = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch('/api/users', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
      .then(res => res.json())
      .then(setUsers);

    fetch('/api/roles', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
      .then(res => res.json())
      .then(setRoles);
  }, []);

  const handleRoleChange = (userId, newRoleId) => {
    fetch('/api/user-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
      },
      body: JSON.stringify({ userId, roleId: newRoleId })
    })
      .then(res => res.json())
      .then(() => {
        // Update UI direkt
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: roles.find(r => r.id == newRoleId)?.name } : user
        ));
      });
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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
              <select
                  value={roles.find(r => r.name === user.role)?.id || ''}
                  onChange={e => handleRoleChange(user.id, parseInt(e.target.value))}
                  disabled={user.role === 'master'}
                >

                  <option value="">Keine Rolle</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                       {role.name === 'master' ? '👑 Master' : role.name}
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
