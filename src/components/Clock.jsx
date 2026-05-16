import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div className="clock" style={{ fontSize: '1.2rem', margin: '10px 0', fontWeight: 'bold' }}>
      {formatTime(time)}
    </div>
  );
};

export default Clock;
