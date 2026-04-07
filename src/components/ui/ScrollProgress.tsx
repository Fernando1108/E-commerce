'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 50) {
        setVisible(false);
        return;
      }
      setVisible(true);
      setProgress(Math.min(scrollTop / docHeight, 1));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ height: '2px' }}
    >
      <div
        className="h-full bg-[#2563EB]"
        style={{
          width: `${progress * 100}%`,
          transition: 'width 0.05s linear',
        }}
      />
    </div>
  );
}
