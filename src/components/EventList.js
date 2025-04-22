// src/components/EventList.js
import React from 'react';

const EventList = ({ events }) => {
  return (
    <div className="event-list">
      <h3>Bevorstehende Events</h3>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> – {new Date(event.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
