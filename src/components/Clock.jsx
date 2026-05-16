import React, { useState, useEffect } from 'react';

const Clock = ({ timezone }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timerId);
  }, []);

  const getTargetDate = () => {
    if (timezone === undefined) return time;
    // time.getTime() is UTC in ms
    // Add timezone offset to get the local time represented in UTC fields
    return new Date(time.getTime() + (timezone * 1000));
  };

  const targetDate = getTargetDate();

  const formatTime = () => {
    if (timezone === undefined) {
      let hours = time.getHours();
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    }

    let hours = targetDate.getUTCHours();
    const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = () => {
    if (timezone === undefined) {
      return time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    // Extract UTC fields since the targetDate has been shifted
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[targetDate.getUTCDay()];
    const monthName = months[targetDate.getUTCMonth()];
    const dateNum = targetDate.getUTCDate();
    const year = targetDate.getUTCFullYear();
    
    return `${dayName}, ${monthName} ${dateNum}, ${year}`;
  };

  return (
    <div className="clock-container" style={{ textAlign: 'center' }}>
      <div className="clock-time" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#222' }}>
        {formatTime()}
      </div>
      <div className="clock-date" style={{ fontSize: '0.95rem', color: '#666', marginTop: '4px', fontWeight: '600' }}>
        {formatDate()}
      </div>
    </div>
  );
};

export default Clock;
