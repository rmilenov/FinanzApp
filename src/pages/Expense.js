import React, { useState, useEffect } from 'react';
import EntryList from '../components/EntryList';
import FloatingButton from '../components/FloatingButton';
import EntryFormModal from '../components/EntryFormModal';
import { exportToExcel } from '../components/ExportToExcel';
import { useApi } from '../hooks/useApi';

const Expense = () => {
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const { request } = useApi();

  const fetchEntries = async () => {
    try {
      const res = await request('http://localhost:5000/api/transactions');
      //console.log(res);
      //const data = await res.json();
      const filtered = res.filter(entry => entry.type === 'expense');
      setEntries(filtered);
    } catch (err) {
      console.error('Fehler beim Laden der Ausgaben:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const saveEntries = async (entry) => {
    try {
      if (editingEntry) {
        await fetch(`http://localhost:5000/api/transactions/${entry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      } else {
        await fetch('http://localhost:5000/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }
      fetchEntries();
    } catch (err) {
      console.error('Fehler beim Speichern der Ausgabe:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      fetchEntries();
    } catch (err) {
      console.error('Fehler beim Löschen der Ausgabe:', err);
    }
  };

  return (
    <div className='entry-list'>
      <EntryList
        entries={entries}
        onEdit={(e) => {
          setEditingEntry(e);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
        type="expense"
      />
      <button onClick={() => exportToExcel(entries, 'Ausgaben')}>Exportieren</button>
      <FloatingButton onClick={() => {
        setEditingEntry(null);
        setModalOpen(true);
      }} />
      {modalOpen && (
        <EntryFormModal
          initialData={editingEntry}
          onSave={saveEntries}
          onClose={() => setModalOpen(false)}
          type="expense"
        />
      )}
    </div>
  );
};

export default Expense;
