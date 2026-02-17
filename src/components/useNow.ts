import { useState, useEffect } from 'react';

// 1-second tick hook → Date.now()
export function useNow(): number {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
}
