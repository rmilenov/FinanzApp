import React from 'react';

const EntryList = ({ entries, onEdit, onDelete, type }) => {
  entries.forEach((entry) => console.log(entry));
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
              <td>{new Date(entry.date).toLocaleString('de-DE', {
                                                              day: '2-digit',
                                                              month: '2-digit',
                                                              year: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit',
              }) + ' Uhr'}</td>
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