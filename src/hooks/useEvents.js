import { useState, useEffect } from 'react';
import { getEvents, saveEvent } from '../api'; // Example API functions

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async (eventTitle) => {
    try {
      const newEvent = await saveEvent(eventTitle);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error("Error saving event", error);
    }
  };

  return { events, loading, addEvent };
};

export default useEvents;
