import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);

  const springX = useSpring(0, { damping: 25, stiffness: 250 });
  const springY = useSpring(0, { damping: 25, stiffness: 250 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      springX.set(e.clientX - 10);
      springY.set(e.clientY - 10);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [springX, springY]);

  return (
    <motion.div
      className="custom-cursor hidden lg:block"
      style={{
        x: springX,
        y: springY,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'var(--color-primary)' : 'transparent',
        opacity: 0.8
      }}
    />
  );
}
