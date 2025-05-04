import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/transactions';

const useEntries = (type) => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const filtered = data.filter(entry => entry.type === type);
      setEntries(filtered);
    } catch (err) {
      console.error(`Fehler beim Laden der ${type}-Einträge:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [type]); // Wenn der Typ geändert wird, hole die neuen Einträge

  const saveEntry = async (entry) => {
    try {

        const entryToSave = { ...entry };
    if (!entryToSave.id) {
      delete entryToSave.id; // Entferne die ID für neue Einträge
    }
      const method = editingEntry ? 'PUT' : 'POST';
      const url = editingEntry ? `${API_URL}/${entry.id}` : API_URL;
      console.log(`Sending ${method} request to ${url}`);

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryToSave),
      });

      fetchEntries();
    } catch (err) {
      console.error(`Fehler beim Speichern (${type}):`, err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchEntries();
    } catch (err) {
      console.error(`Fehler beim Löschen (${type}):`, err);
    }
  };

  return {
    entries,
    editingEntry,
    setEditingEntry,
    saveEntry,
    deleteEntry,
    loading,
    modalControls: {
      openModal: () => setEditingEntry({}),
      closeModal: () => setEditingEntry(null),
      isOpen: editingEntry !== null,
    },
  };
};

export default useEntries;
