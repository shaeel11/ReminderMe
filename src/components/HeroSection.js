if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
import React, { useState, useEffect } from 'react';
import '../App.css';
import './HeroSection.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const API_URL = process.env.REACT_APP_API_URL;

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const eventsWithDates = response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));

      setEvents(eventsWithDates);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create new event
  const handleSelectSlot = async (slotInfo) => {
    const title = prompt('Enter event title');
    if (title) {
      const newEvent = {
        title,
        start: new Date(slotInfo.start),
        end: new Date(slotInfo.end),
        description: ''
      };

      try {
        const response = await axios.post(`${API_URL}/api/events`, newEvent, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const createdEvent = {
          ...response.data,
          start: new Date(response.data.start),
          end: new Date(response.data.end)
        };

        setEvents([...events, createdEvent]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  // Edit event title
  const handleSelectEvent = (event) => {
    const updatedTitle = prompt('Edit event title', event.title);
    if (updatedTitle) {
      const updatedEvent = {
        ...event,
        title: updatedTitle
      };

      axios
        .put(`${API_URL}/api/events/${event._id}`, updatedEvent, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          const updatedEvents = events.map((ev) =>
            ev._id === event._id
              ? {
                  ...response.data,
                  start: new Date(response.data.start),
                  end: new Date(response.data.end)
                }
              : ev
          );
          setEvents(updatedEvents);
        })
        .catch((error) => {
          console.error('Error updating event:', error);
        });
    }
  };

  // Handle delete via button
  const handleDeleteEvent = async (event, e) => {
    e.stopPropagation(); // prevent triggering edit

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/api/events/${event._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEvents(events.filter((ev) => ev._id !== event._id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  // Custom event component with delete button
  const EventComponent = ({ event }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{event.title}</span>
      <button
        onClick={(e) => handleDeleteEvent(event, e)}
        style={{
          marginLeft: '8px',
          background: 'transparent',
          border: 'none',
          color: 'red',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        title="Delete"
      >
        &times;
      </button>
    </div>
  );

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        components={{
          event: EventComponent
        }}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default MyCalendar;