import React, { useState, useEffect } from 'react';
import EntryList from '../components/EntryList';
import FloatingButton from '../components/FloatingButton';
import EntryFormModal from '../components/EntryFormModal';
import { exportToExcel } from '../components/ExportToExcel';

const Income = () => {
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions');
      const data = await res.json();
      const filtered = data.filter(entry => entry.type === 'income');
      setEntries(filtered);
    } catch (err) {
      console.error('Fehler beim Laden der Einnahmen:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const saveEntries = async (entry) => {
    try {
      if (editingEntry) {
        // Update bestehende Einnahme
        await fetch(`http://localhost:5000/api/transactions/${entry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      } else {
        // Neue Einnahme
        await fetch('http://localhost:5000/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }
      fetchEntries();
    } catch (err) {
      console.error('Fehler beim Speichern der Einnahme:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      fetchEntries();
    } catch (err) {
      console.error('Fehler beim Löschen der Einnahme:', err);
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
        type="income"
      />
      <button onClick={() => exportToExcel(entries, 'Einnahmen')}>Exportieren</button>
      <FloatingButton onClick={() => {
        setEditingEntry(null);
        setModalOpen(true);
      }} />
      {modalOpen && (
        <EntryFormModal
          initialData={editingEntry}
          onSave={saveEntries}
          onClose={() => setModalOpen(false)}
          type="income"
        />
      )}
    </div>
  );
};

export default Income;
