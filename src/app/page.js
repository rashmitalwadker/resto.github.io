"use client";
import React,{ useState, useEffect } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (date && time) {
      fetch(`/api/availability?date=${date}&time=${time}`)
        .then((res) => res.json())
        .then((data) => setAvailableSlots(data.slots));
    }
  }, [date, time]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !contact || !date || !time || guests < 1) {
      setMessage('Please fill all fields correctly.');
      return;
    }

    const response = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, contact, date, time, guests }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Restaurant Table Booking</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Contact" 
          value={contact} 
          onChange={(e) => setContact(e.target.value)} 
          required 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <input 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          min="1" 
          value={guests} 
          onChange={(e) => setGuests(e.target.value)} 
          required 
        />
        <button type="submit">Book Now</button>
      </form>
      {availableSlots.length > 0 && (
        <div>
          <h2>Available Slots</h2>
          <ul>
            {availableSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

