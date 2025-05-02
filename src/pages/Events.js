import React, { useState, useEffect } from 'react';
import EventFormModal from '../components/EventFormModal';
import '../index.css'
import { useApi } from '../hooks/useApi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const { request } = useApi();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    
   fetchEvents();
  });
  const fetchEvents = async () => {
    request('http://localhost:5000/api/events')
    .then(setEvents)
    .catch((err) => alert(err.message));
  };
 

  const handleEdit = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };
  const saveEvents = async (event) => {
    try {
      if (editingEvent) {
      
        await fetch(`http://localhost:5000/api/events/${event.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      } else {
       
        await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      }
      fetchEvents();
    } catch (err) {
      console.error('Fehler beim Speichern der Einnahme:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      console.error('Fehler beim Löschen des Events:', err);
    }
  };

  return (
    <div className="events-page">
      <h2>Event-Verwaltung</h2>
      <button className='event-add-button' onClick={() => {
        setEditingEvent(null);
        setModalOpen(true);
      }}>
        +
      </button>

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> am {new Date(event.date).toLocaleDateString()}
            <button onClick={() => handleEdit(event)}>Bearbeiten</button>
            <button onClick={() => handleDelete(event.id)}>Löschen</button>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <EventFormModal
          initialData={editingEvent}
          onSave={saveEvents}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Events;
