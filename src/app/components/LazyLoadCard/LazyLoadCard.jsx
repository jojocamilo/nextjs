'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-use';

const LazyLoadCard = ({ children, threshold = 0.1, placeholder = null }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  const inView = useInView(ref, {
    threshold,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      setIsInView(true);
      // Simuliere Ladezeit für bessere UX
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  if (!isInView) {
    return (
      <div
        ref={ref}
        className="min-h-[200px] animate-pulse bg-gray-200 rounded-lg"
      >
        {placeholder}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-[200px] animate-pulse bg-gray-100 rounded-lg">
        {placeholder}
      </div>
    );
  }

  return <div ref={ref}>{children}</div>;
};

export default LazyLoadCard;
