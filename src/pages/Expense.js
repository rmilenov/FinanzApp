import React, { useState, useEffect } from 'react';
import EntryList from '../components/EntryList';
import FloatingButton from '../components/FloatingButton';
import EntryFormModal from '../components/EntryFormModal';
import { exportToExcel } from '../components/ExportToExcel';

const Expense = () => {
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('expense_entries');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const saveEntries = (data) => {
    const newList = editingEntry
      ? entries.map((e) => (e.id === data.id ? data : e))
      : [...entries, data];
    setEntries(newList);
    localStorage.setItem('expense_entries', JSON.stringify(newList));
  };

  const handleDelete = (id) => {
    const filtered = entries.filter((e) => e.id !== id);
    setEntries(filtered);
    localStorage.setItem('expense_entries', JSON.stringify(filtered));
  };

  return (
    <div>
      <h1>Ausgaben</h1>
      <EntryList entries={entries} onEdit={(e) => { setEditingEntry(e); setModalOpen(true); }} onDelete={handleDelete} type="expense" />
      <button onClick={() => exportToExcel(entries, 'Ausgaben')}>Exportieren</button>
      <FloatingButton onClick={() => { setEditingEntry(null); setModalOpen(true); }} />
      {modalOpen && (
        <EntryFormModal
          initialData={editingEntry}
          onSave={saveEntries}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Expense;