import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import robotModel from '../assets/b12_robot.glb';

import { useFrame } from '@react-three/fiber';

function Model(props) {
  const { scene } = useGLTF(robotModel);
  const modelRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state) => {
    if (!modelRef.current) return;
    
    // Smoothly rotate towards mouse
    const targetX = state.mouse.y * 0.5;
    const targetY = state.mouse.x * 0.5;
    
    modelRef.current.rotation.x += (targetX - modelRef.current.rotation.x) * 0.1;
    modelRef.current.rotation.y += (targetY - modelRef.current.rotation.y) * 0.1;
  });

  return <primitive ref={modelRef} object={scene} scale={isMobile ? 0.35 : 0.5} {...props} />;
}

const Hotspot = ({ x, y, title, specs, delay, side = 'right' }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="absolute flex items-center group pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    {/* The Point */}
    <div className="relative pointer-events-auto cursor-help">
      <div className="w-3 h-3 bg-primary rounded-full relative z-10 border border-white/50 shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
      <div className="w-6 h-6 border border-primary/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
    </div>

    {/* The Schematic Line & Label */}
    <div className={`absolute flex items-center ${side === 'right' ? 'left-3' : 'right-3 flex-row-reverse'} opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-0 group-hover:-translate-y-4`}>
      <svg width="120" height="60" className={`${side === 'left' ? 'scale-x-110' : ''}`}>
        <motion.path
          d={side === 'right' ? "M 0 30 Q 30 30 60 10 L 120 10" : "M 120 30 Q 90 30 60 10 L 0 10"}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </svg>
      
      <div className={`bg-[var(--bg-secondary)]/90 backdrop-blur-xl border border-[var(--border-subtle)] p-4 rounded-xl min-w-[180px] shadow-2xl relative ${side === 'right' ? '-ml-2' : '-mr-2'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-500 rounded-t-xl opacity-50" />
        <h4 className="text-[var(--text-main)] font-black text-xs uppercase tracking-wider mb-2 font-display">{title}</h4>
        <div className="space-y-1.5">
          {specs.map((spec, i) => (
            <div key={i} className="flex justify-between items-center gap-4 text-[10px]">
              <span className="text-[var(--text-muted)] uppercase">{spec.label}</span>
              <span className="text-primary font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Showcase() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[var(--bg-primary)] py-32 overflow-hidden flex flex-col items-center justify-center transition-colors duration-400">
      
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h2 
          style={{ opacity: 0.03 }}
          className="text-[25vw] font-black font-display leading-none whitespace-nowrap text-[var(--text-main)]"
        >
          SPECTRA-X
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
        >
          The Flagship Evolution
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display text-[var(--text-main)]"
        >
          B12-Robot <span className="text-[var(--text-muted)] italic font-light">Custom</span>
        </motion.h2>
      </div>

      {/* Main Model Container */}
      <motion.div 
        style={{ scale, opacity }}
        initial={typeof window !== 'undefined' && window.innerWidth < 768 
          ? { opacity: 0 } 
          : { x: -300, opacity: 0, rotateY: -90 }}
        whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 1.2
        }}
        className="relative w-full max-w-5xl h-[400px] md:h-auto md:aspect-video mx-auto cursor-grab active:cursor-grabbing preserve-3d flex items-center justify-center"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <Stage intensity={0.5} environment="city" shadows="contact" adjustCamera={false}>
                <Model />
              </Stage>
              <OrbitControls enableZoom={false} autoRotate={false} />
            </Suspense>
          </Canvas>
        </div>

        {/* Hotspots - Adjusted for the 3D model view - Hidden on mobile for clarity */}
        <div className="absolute inset-0 z-10 hidden md:block">
          <div className="relative w-full h-full">
            <Hotspot 
              x={40} y={40} 
              side="left"
              title="Autonomous Core" 
              specs={[
                { label: 'Neural Unit', value: 'B12-X' },
                { label: 'Cores', value: '12-NPU' },
                { label: 'Pathfinding', value: 'AI-V4' }
              ]}
              delay={1.5}
            />
            <Hotspot 
              x={60} y={35} 
              side="right"
              title="Scanner Module" 
              specs={[
                { label: 'Type', value: 'LIDAR-8K' },
                { label: 'FOV', value: '360°' },
                { label: 'Range', value: '50M' }
              ]}
              delay={1.7}
            />
            <Hotspot 
              x={50} y={70} 
              side="right"
              title="Magnetic Grapple" 
              specs={[
                { label: 'Force', value: '250N' },
                { label: 'Material', value: 'ND-52' },
                { label: 'Speed', value: '0.1S' }
              ]}
              delay={1.9}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 max-w-4xl mx-auto w-full px-6">
        {[
          { label: 'Battery Life', value: '72 HOURS' },
          { label: 'Weight', value: '1.2 KG' },
          { label: 'Sensors', value: 'LIDAR-X' },
          { label: 'Compatibility', value: 'STRAY-V1' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="text-center"
          >
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-[var(--text-main)] text-2xl font-bold font-display">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
