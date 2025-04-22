import React, { useState, useEffect } from 'react';
import EventFormModal from '../components/EventFormModal';
import '../index.css'

const Events = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Fehler beim Laden der Events:', err);
      }
    };
    fetchEvents();
  }, []);

  const saveEvent = (event) => {
    if (editingEvent) {
      // Update an existing event
      const updatedEvents = events.map((e) =>
        e.id === event.id ? event : e
      );
      setEvents(updatedEvents);
    } else {
      // Add a new event
      setEvents((prev) => [...prev, event]);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
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
          onSave={saveEvent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Events;
