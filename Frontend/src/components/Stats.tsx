import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const CountUp = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[^0-9]/g, ''));
      if (start === end) return;

      let totalFrames = Math.min(Math.max(duration * 60, 30), 120);
      let frameDuration = (duration * 1000) / totalFrames;
      let counter = 0;

      const timer = setInterval(() => {
        counter++;
        const progress = counter / totalFrames;
        const currentCount = Math.floor(end * progress);
        
        setCount(currentCount);

        if (counter === totalFrames) {
          clearInterval(timer);
        }
      }, frameDuration);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{value.replace(/[0-9]/g, '')}</span>;
};

export default function Stats() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-20 overflow-hidden transition-colors duration-400">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 scale-150 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Global Pilots', value: '15000+' },
            { label: 'Flight Hours', value: '250K+' },
            { label: 'Countries', value: '45+' },
            { label: 'Safety Rating', value: '99%' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-[var(--text-main)] font-display mb-2">
                <CountUp value={item.value} />
              </div>
              <div className="text-[var(--text-muted)] text-sm font-semibold uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
