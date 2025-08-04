import React, { useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

// --- Placeholder Icon Components ---
// In a real-world scenario, you would import these from an icon library.
const CodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const DesignIcon = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l-8 5v10l8 5 8-5V7l-8-5z"></path>
    <path d="M2 7l10 5 10-5"></path>
    <path d="M12 22V12"></path>
  </svg>
);

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);


// --- Component Data ---
const gridData = [
  { id: 1, title: 'Robust Backend', Icon: CodeIcon },
  { id: 2, title: 'Pixel-Perfect Design', Icon: DesignIcon },
  { id: 3, title: 'Scalable Databases', Icon: DatabaseIcon },
  { id: 4, title: 'Interactive UIs', Icon: CodeIcon },
  { id: 5, title: 'Data Visualization', Icon: DesignIcon },
  { id: 6, title: 'Cloud Integration', Icon: DatabaseIcon },
];

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    },
  },
};

// --- Particle Class for Canvas Animation ---
class Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.baseRadius = Math.random() * 20 + 35; // Radius of the glowing "eraser"
    this.radius = this.baseRadius;
    this.maxLife = Math.random() * 30 + 40; // How long the particle lives
    this.life = this.maxLife;
    this.vx = (Math.random() - 0.5) * 0.5; // Slow horizontal drift
    this.vy = (Math.random() - 0.5) * 0.5; // Slow vertical drift
    this.color = `hsla(180, 100%, 75%, ${this.life / this.maxLife})`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    const lifeRatio = Math.max(0, this.life / this.maxLife);
    this.radius = this.baseRadius * lifeRatio; // Shrink over time
    this.color = `hsla(180, 100%, 75%, ${lifeRatio * 0.7})`; // Fade out
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    // Create a radial gradient for a soft, glowing effect
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'hsla(180, 100%, 75%, 0)');
    
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Main Component ---
const CanvasRevealSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setCanvasDimensions = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw a dark overlay that hides the content
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'; // A dark slate color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Add new particles at the cursor's position
      if (mouseRef.current.x > 0 || mouseRef.current.y > 0) {
        particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y));
      }
      
      // 3. Set the composite operation to "erase" the overlay
      ctx.globalCompositeOperation = 'destination-out';

      // 4. Update and draw each particle
      particlesRef.current.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });
      
      // 5. Reset composite operation for the next frame's overlay
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="bg-slate-900 text-white py-20 px-4">
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-5xl mx-auto h-[40rem] flex items-center justify-center border border-slate-700 rounded-2xl overflow-hidden"
        >
            {/* The canvas sits on top to create the reveal effect */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-10" />
            
            {/* The content to be revealed sits underneath the canvas */}
            <motion.div
                variants={containerVariants as Variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 relative z-0"
            >
                {gridData.map((item) => (
                    <motion.div
                        key={item.id}
                        variants={itemVariants as Variants}
                        className="flex flex-col items-center text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg"
                    >
                        <item.Icon className="w-12 h-12 mb-4 text-cyan-400" />
                        <h3 className="text-lg font-semibold text-slate-200">{item.title}</h3>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  );
};

export default CanvasRevealSection;