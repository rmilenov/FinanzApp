// api.js

// Fetch events from the server
export const getEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Save a new event to the server
  export const saveEvent = async (eventTitle) => {
    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: eventTitle }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save event');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  