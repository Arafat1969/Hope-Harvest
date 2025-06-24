import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ target }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const duration = 2000; // Animation duration in milliseconds (2 seconds)

  useEffect(() => {
    let start = 0;
    // if target is a string with comma, remove it. e.g. "10,000+" -> 10000
    const end = parseInt(target.toString().replace(/,/g, '').match(/\d+/));
    if (start === end) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const newNumber = Math.floor(progress * end);
      setCurrentNumber(newNumber);
      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);

  }, [target, duration]);

  // Format the number with commas for display
  const formattedNumber = currentNumber.toLocaleString();
  const suffix = target.toString().replace(/[0-9,]/g, ''); // Extracts any non-numeric suffix like '+'

  return <span>{formattedNumber}{suffix}</span>;
};

export default AnimatedNumber;
