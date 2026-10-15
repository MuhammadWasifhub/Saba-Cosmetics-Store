'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: any;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delayClass = delay ? `reveal-delay-${delay}` : '';

  return (
    <Tag ref={ref} className={`reveal ${delayClass} ${inView ? 'in-view' : ''}`}>
      {children}
    </Tag>
  );
}