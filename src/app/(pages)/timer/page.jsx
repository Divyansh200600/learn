// components/Clock.js
"use client";

import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const countdownInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(countdownInterval);
    };
  }, [seconds]);

  const formatCountdown = () => {
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    return `${minutesStr}:${secondsStr}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8   ">Webinar - PulseZest Tech Talk</h1>
      <div className="text-6xl font-bold mb-4">{formatCountdown()}</div>
      <div className="text-3xl font-bold  text-orange-200 ">Share with your friends</div>
    </div>
  );
};

export default Clock;
