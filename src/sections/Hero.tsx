import { useEffect, useState, useRef } from 'react';
import { Heart, Music, Sparkles, Star } from 'lucide-react';
import { useMagnetic } from '@/hooks/useMousePosition';
import romanticMusic from '@/assets/romantic.mp3';


// Floating heart with enhanced animation
interface FloatingHeart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  type: 'solid' | 'outline';
}

// Particle system component
const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const colors = ['#ff6b9d', '#ff85a2', '#ffb8d0', '#ffc4dd', '#ffd6e7'];
    const particleArray = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particleArray.forEach((particle) => {
        // Mouse attraction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          particle.speedX += dx * 0.0001;
          particle.speedY += dy * 0.0001;
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fill();
      });

      // Draw connections
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#ff85a2';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particleArray.length; i++) {
        for (let j = i + 1; j < particleArray.length; j++) {
          const dx = particleArray[i].x - particleArray[j].x;
          const dy = particleArray[i].y - particleArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
};

// Floating hearts background
const FloatingHearts = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const generatedHearts: FloatingHeart[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 12 + Math.random() * 30,
      opacity: 0.2 + Math.random() * 0.4,
      type: Math.random() > 0.5 ? 'solid' : 'outline',
    }));
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
          }}
        >
          <Heart
            size={heart.size}
            className={`${
              heart.type === 'solid' 
                ? 'text-rose-400 fill-rose-300' 
                : 'text-rose-300'
            }`}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 107, 157, 0.4))',
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Morphing blob background
const MorphingBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-300/20 animate-blob"
        style={{ filter: 'blur(80px)' }}
      />
      <div 
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-pink-300/20 animate-blob"
        style={{ filter: 'blur(60px)', animationDelay: '-3s' }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-rose-200/25 animate-blob"
        style={{ filter: 'blur(70px)', animationDelay: '-6s' }}
      />
    </div>
  );
};

// Main Hero section
const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Magnetic button effect
  const magneticButton = useMagnetic<HTMLButtonElement>(0.4);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const titleTimer = setTimeout(() => setTitleRevealed(true), 600);
    return () => {
      clearTimeout(timer);
      clearTimeout(titleTimer);
    };
  }, []);

  const toggleMusic = () => {
  if (!audioRef.current) return;

  if (musicPlaying) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }

  setMusicPlaying(!musicPlaying);
};


  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-romantic-gradient-animated"
    >
      {/* Particle system */}
      <ParticleSystem />

      {/* Floating hearts */}
      <FloatingHearts />

      {/* Morphing blobs */}
      <MorphingBlobs />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-100/50 z-[2]" />

      {/* Decorative sparkles */}
      <div className="absolute top-20 left-20 animate-sparkle" style={{ animationDelay: '0s' }}>
        <Sparkles size={24} className="text-yellow-300" />
      </div>
      <div className="absolute top-40 right-32 animate-sparkle" style={{ animationDelay: '1s' }}>
        <Sparkles size={20} className="text-yellow-200" />
      </div>
      <div className="absolute bottom-40 left-32 animate-sparkle" style={{ animationDelay: '2s' }}>
        <Sparkles size={28} className="text-yellow-300" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Music toggle button with magnetic effect */}
        <button
          ref={magneticButton.ref}
          style={magneticButton.style}
          {...magneticButton.handlers}
          onClick={toggleMusic}
          className={`absolute top-4 right-4 p-4 rounded-full glass-premium transition-all duration-300 hover:scale-110 z-20 ${
            musicPlaying ? 'animate-pulse-glow' : ''
          }`}
          title="Toggle romantic music"
        >
          <Music
            size={24}
            className={`${musicPlaying ? 'text-rose-500' : 'text-rose-400'} transition-colors`}
          />
          {musicPlaying && (
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-rose-500 whitespace-nowrap">
              Now Playing
            </span>
          )}
        </button>

        <audio ref={audioRef} loop preload="auto">
          <source src={romanticMusic} type="audio/mpeg" />
        </audio>


        {/* Main heading with staggered animation */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Star size={24} className="text-yellow-400 fill-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            <Heart
              size={36}
              className="text-rose-500 fill-rose-400 animate-pulse-heart"
            />
            <span className="text-rose-500 text-lg sm:text-xl font-medium tracking-[0.3em] uppercase animate-fade-in-scale">
              For My Beautiful
            </span>
            <Heart
              size={36}
              className="text-rose-500 fill-rose-400 animate-pulse-heart"
              style={{ animationDelay: '0.5s' }}
            />
            <Star size={24} className="text-yellow-400 fill-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        {/* Her name with dramatic reveal */}
        <div className="relative mb-10 perspective-1000">
          <h1
            className={`font-elegant text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-rose-600 transition-all duration-1500 preserve-3d ${
              titleRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-20'
            }`}
            style={{
              textShadow: '4px 4px 8px rgba(255, 107, 157, 0.3), 0 0 60px rgba(255, 107, 157, 0.2)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Thalavii😍
          </h1>
          
          {/* Decorative underline */}
          <div 
            className={`absolute -bottom-4 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full transition-all duration-1000 delay-1000 ${
              titleRevealed ? 'w-64 opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>

        {/* Romantic paragraph with glass effect */}
        <div
          className={`glass-premium rounded-3xl p-8 sm:p-10 md:p-12 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-lg sm:text-xl md:text-2xl text-rose-700 leading-relaxed font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
            From the moment you entered my life, everything changed. Your smile brightens my darkest days, 
            your laughter is my favorite melody, and your love fills my heart with warmth I never knew existed. 
            You are my dream come true, my forever, and my always.
          </p>
          
          {/* Animated hearts */}
          <div className="flex justify-center gap-4 mt-8">
            <Heart size={24} className="text-rose-400 fill-rose-300 animate-float" />
            <Heart size={32} className="text-rose-500 fill-rose-400 animate-float-3d" />
            <Heart size={24} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Scroll indicator with bounce */}
        <div
          className={`mt-16 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <a
            href="#our-story"
            className="inline-flex flex-col items-center text-rose-500 hover:text-rose-600 transition-colors group"
          >
            <span className="text-sm font-medium mb-3 group-hover:tracking-wider transition-all">
              Discover Our Story
            </span>
            <div className="w-7 h-12 rounded-full border-2 border-rose-400 flex justify-center pt-2 relative overflow-hidden">
              <div className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce" />
              <div className="absolute inset-0 bg-rose-400/20 animate-pulse" />
            </div>
            <div className="flex gap-1 mt-2">
              <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
