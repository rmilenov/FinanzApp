import React from 'react';

const EntryList = ({ entries, onEdit, onDelete, type }) => {
  return (
    <div className="entry-list">
      <h3>{type === 'income' ? 'Einnahmen' : 'Ausgaben'}</h3>
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Betrag</th>
            <th>Datum</th>
            <th>Kategorie</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.title}</td>
              <td>{entry.amount.toFixed(2)} €</td>
              <td>{entry.date}</td>
              <td>{entry.category}</td>
              <td>
                <button onClick={() => onEdit(entry)}>Bearbeiten</button>
                <button onClick={() => onDelete(entry.id)}>Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntryList;