import React, { useState, useEffect } from 'react';

const EventFormModal = ({ onSave, onClose, initialData }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setEventType(initialData.type || 'Allgemein');
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      id: initialData?.id || Date.now().toString(),
      title,
      date,
      type: eventType,
    });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{initialData ? 'Event bearbeiten' : 'Neues Event'}</h2>
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="Allgemein">Allgemein</option>
          <option value="Feier">Feier</option>
          <option value="Arbeit">Arbeit</option>
          <option value="Urlaub">Urlaub</option>
        </select>
        <button onClick={handleSubmit}>
          {initialData ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
        <button onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
};

export default EventFormModal;
