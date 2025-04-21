import React, { useState, useEffect } from 'react';

const EntryFormModal = ({ onSave, onClose, initialData }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Allgemein');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount);
      setDate(initialData.date);
      setCategory(initialData.category || 'Allgemein');
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      id: initialData?.id || Date.now().toString(),
      title,
      amount: parseFloat(amount),
      date,
      category
    });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{initialData ? 'Bearbeiten' : 'Neuer Eintrag'}</h2>
        <input placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Betrag" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="Datum" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Allgemein</option>
          <option>Lebensmittel</option>
          <option>Miete</option>
          <option>Freizeit</option>
          <option>Gehalt</option>
          <option>Sonstiges</option>
        </select>
        <button onClick={handleSubmit}>Speichern</button>
        <button onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
};

export default EntryFormModal;