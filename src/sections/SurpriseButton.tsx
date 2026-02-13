import { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, Sparkles, X, Check, Star, Gift, Crown, Gem } from 'lucide-react';
import { useInView } from '@/hooks/useScrollProgress';

// Confetti types
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'heart' | 'star';
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  gravity: number;
  opacity: number;
}

// Heart particle for explosion
interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  opacity: number;
  scale: number;
}

// Generate random confetti
const generateConfetti = (count: number, originX: number, originY: number): ConfettiPiece[] => {
  const colors = [
    '#ff6b9d', '#ff85a2', '#ffb8d0', '#ffc4dd', '#ffd6e7', 
    '#dc143c', '#ff477e', '#ff1493', '#ff69b4', '#ffa6c9'
  ];
  const shapes: Array<'circle' | 'square' | 'heart' | 'star'> = ['circle', 'square', 'heart', 'star'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: originX,
    y: originY,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 16,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 25,
    velocityY: -15 - Math.random() * 20,
    rotationSpeed: (Math.random() - 0.5) * 30,
    gravity: 0.4 + Math.random() * 0.3,
    opacity: 1,
  }));
};

// Generate heart explosion particles
const generateHeartExplosion = (count: number, originX: number, originY: number): HeartParticle[] => {
  const colors = ['#ff6b9d', '#ff85a2', '#ffb8d0', '#ff477e', '#dc143c'];
  
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const speed = 5 + Math.random() * 10;
    
    return {
      id: i,
      x: originX,
      y: originY,
      size: 15 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      opacity: 1,
      scale: 1,
    };
  });
};

// Confetti canvas component
const ConfettiCanvas = ({ 
  confetti, 
  hearts, 
  onComplete 
}: { 
  confetti: ConfettiPiece[]; 
  hearts: HeartParticle[];
  onComplete: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const confettiRef = useRef(confetti);
  const heartsRef = useRef(hearts);

  useEffect(() => {
    confettiRef.current = confetti;
    heartsRef.current = hearts;
  }, [confetti, hearts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let frameCount = 0;

    const drawShape = (piece: ConfettiPiece) => {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = piece.opacity;

      switch (piece.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
          break;
        case 'heart':
          {
            const s = piece.size / 2;
            ctx.beginPath();
            ctx.moveTo(0, s / 4);
            ctx.bezierCurveTo(-s / 2, -s / 4, -s, s / 4, 0, s);
            ctx.bezierCurveTo(s, s / 4, s / 2, -s / 4, 0, s / 4);
            ctx.fill();
          }
          break;
        case 'star':
          {
            const spikes = 5;
            const outerRadius = piece.size / 2;
            const innerRadius = piece.size / 4;
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / spikes;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          break;
      }
      ctx.restore();
    };

    const drawHeart = (heart: HeartParticle) => {
      ctx.save();
      ctx.translate(heart.x, heart.y);
      ctx.scale(heart.scale, heart.scale);
      ctx.fillStyle = heart.color;
      ctx.globalAlpha = heart.opacity;
      
      const s = heart.size;
      ctx.beginPath();
      ctx.moveTo(0, s / 4);
      ctx.bezierCurveTo(-s / 2, -s / 4, -s, s / 4, 0, s);
      ctx.bezierCurveTo(s, s / 4, s / 2, -s / 4, 0, s / 4);
      ctx.fill();
      
      // Glow effect
      ctx.shadowColor = heart.color;
      ctx.shadowBlur = 20;
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let hasActiveParticles = false;

      // Update and draw confetti
      confettiRef.current = confettiRef.current.map((piece) => {
        piece.x += piece.velocityX;
        piece.y += piece.velocityY;
        piece.velocityY += piece.gravity;
        piece.rotation += piece.rotationSpeed;
        piece.opacity -= 0.008;

        if (piece.opacity > 0 && piece.y < canvas.height + 50) {
          drawShape(piece);
          hasActiveParticles = true;
        }
        return piece;
      });

      // Update and draw hearts
      heartsRef.current = heartsRef.current.map((heart) => {
        heart.x += heart.velocityX;
        heart.y += heart.velocityY;
        heart.velocityY *= 0.98;
        heart.velocityX *= 0.98;
        heart.scale *= 0.995;
        heart.opacity -= 0.01;

        if (heart.opacity > 0) {
          drawHeart(heart);
          hasActiveParticles = true;
        }
        return heart;
      });

      frameCount++;

      if (hasActiveParticles && frameCount < 300) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[150]"
    />
  );
};

// Popup modal component
const PopupModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [showHearts, setShowHearts] = useState(false);
  const [ref, isInView] = useInView<HTMLDivElement>(0.5);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowHearts(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowHearts(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 popup-overlay animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Modal content */}
      <div 
        ref={ref}
        className={`relative z-10 w-full max-w-lg transition-all duration-700 ${
          isInView ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Floating hearts around modal */}
        {showHearts && (
          <>
            <div className="absolute -top-10 -left-10 animate-float">
              <Heart size={40} className="text-rose-400 fill-rose-300" />
            </div>
            <div className="absolute -top-8 -right-8 animate-float-slow" style={{ animationDelay: '0.3s' }}>
              <Heart size={36} className="text-pink-400 fill-pink-300" />
            </div>
            <div className="absolute -bottom-10 -left-8 animate-float" style={{ animationDelay: '0.6s' }}>
              <Heart size={32} className="text-rose-300 fill-rose-200" />
            </div>
            <div className="absolute -bottom-8 -right-10 animate-float-slow" style={{ animationDelay: '0.9s' }}>
              <Heart size={38} className="text-pink-300 fill-pink-200" />
            </div>
          </>
        )}

        <div className="glass-premium rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/30 rounded-full blur-3xl animate-pulse" />

          {/* Decorative elements */}
          <div className="absolute top-4 left-4">
            <Crown size={28} className="text-yellow-400 animate-float" />
          </div>
          <div className="absolute top-4 right-4">
            <Gem size={28} className="text-pink-400 animate-float-slow" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
          >
            <X size={24} className="text-rose-400" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {/* Sparkles */}
            <div className="flex justify-center gap-3 mb-6">
              <Sparkles size={28} className="text-yellow-300 animate-sparkle" />
              <Star size={32} className="text-yellow-300 fill-yellow-300 animate-pulse" />
              <Gift size={32} className="text-rose-400 animate-bounce" />
              <Star size={32} className="text-yellow-300 fill-yellow-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <Sparkles size={28} className="text-yellow-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Big heart */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Heart 
                  size={100} 
                  className="text-rose-500 fill-rose-500 animate-pulse-heart"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(255, 107, 157, 0.8))' }}
                />
                {/* Glow rings */}
                <div className="absolute inset-0 animate-ping opacity-50">
                  <Heart size={100} className="text-rose-400" />
                </div>
              </div>
            </div>

            {/* Question */}
            <h3 className="font-elegant text-5xl sm:text-6xl text-rose-700 mb-6">
              Will You Be Mine Forever?
            </h3>

            {/* Message */}
            <p className="text-rose-600 text-lg mb-10 leading-relaxed">
              You are the love of my life, and I want to spend every moment 
              making you happy. Will you let me love you forever?
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-10 py-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-full text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 shadow-glow animate-gradient-shift"
                style={{ backgroundSize: '200% 100%' }}
              >
                <Check size={28} />
                Yes, Forever!
              </button>
              <button
                onClick={onClose}
                className="px-10 py-5 bg-white/20 hover:bg-white/30 rounded-full text-rose-600 font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-rose-200"
              >
                Let Me Think...
              </button>
            </div>

            {/* Bottom hearts */}
            <div className="flex justify-center gap-4 mt-8">
              <Heart size={24} className="text-rose-400 fill-rose-300 animate-float" />
              <Heart size={32} className="text-rose-500 fill-rose-400 animate-float-3d" />
              <Heart size={24} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Surprise Button section
const SurpriseButton = () => {
  const [sectionRef, isInView] = useInView<HTMLElement>(0.3);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [heartParticles, setHeartParticles] = useState<HeartParticle[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isButtonPulsing, setIsButtonPulsing] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleConfettiComplete = useCallback(() => {
    setConfetti([]);
    setHeartParticles([]);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Generate confetti explosion
      const newConfetti = generateConfetti(150, centerX, centerY);
      const newHearts = generateHeartExplosion(30, centerX, centerY);
      
      setConfetti(newConfetti);
      setHeartParticles(newHearts);
      setIsButtonPulsing(false);
      setClickCount(prev => prev + 1);

      // Show popup after confetti starts
      setTimeout(() => {
        setShowPopup(true);
      }, 800);
    }
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
    setIsButtonPulsing(true);
  }, []);

  return (
    <section
      id="surprise"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-romantic-gradient-animated overflow-hidden"
    >
      {/* Confetti canvas */}
      {(confetti.length > 0 || heartParticles.length > 0) && (
        <ConfettiCanvas 
          confetti={confetti} 
          hearts={heartParticles}
          onComplete={handleConfettiComplete}
        />
      )}

      {/* Popup Modal */}
      <PopupModal isOpen={showPopup} onClose={handleClosePopup} />

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-48 h-48 rounded-full bg-rose-200/30 blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-pink-300/25 blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-rose-300/20 blur-2xl animate-blob" style={{ animationDelay: '-3s' }} />

      {/* Floating hearts */}
      <div className="absolute top-32 right-16 animate-float-3d">
        <Heart size={28} className="text-rose-300 fill-rose-200" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float-slow" style={{ animationDelay: '1s' }}>
        <Heart size={32} className="text-pink-300 fill-pink-200" />
      </div>
      <div className="absolute top-1/3 right-24 animate-float" style={{ animationDelay: '2s' }}>
        <Heart size={24} className="text-rose-400 fill-rose-300" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-1/4 left-16 animate-sparkle">
        <Sparkles size={28} className="text-yellow-300" />
      </div>
      <div className="absolute bottom-1/3 right-32 animate-sparkle" style={{ animationDelay: '1.5s' }}>
        <Sparkles size={24} className="text-yellow-200" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section header */}
        <div
          className={`mb-16 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles size={32} className="text-rose-400 animate-pulse" />
            <Heart size={40} className="text-rose-500 fill-rose-400 animate-pulse-heart" />
            <Sparkles size={32} className="text-rose-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="font-elegant text-6xl sm:text-7xl md:text-8xl text-rose-600 mb-6">
            A Special Surprise
          </h2>

          <p className="text-lg sm:text-xl text-rose-500/80 max-w-xl mx-auto">
            I have something important to ask you. Are you ready for the surprise?
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`h-0.5 bg-gradient-to-r from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
            <Heart size={20} className="text-rose-400 fill-rose-300 animate-pulse" />
            <div className={`h-0.5 bg-gradient-to-l from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
          </div>
        </div>

        {/* Surprise button with magnetic effect */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className={`
              relative group px-14 py-7 rounded-full 
              bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500
              text-white font-bold text-2xl sm:text-3xl
              flex items-center gap-4 mx-auto
              transition-all duration-500
              hover:scale-110
              ${isButtonPulsing ? 'animate-pulse-glow' : ''}
            `}
            style={{
              backgroundSize: '200% 100%',
              animation: isButtonPulsing ? 'pulse-glow 2s ease-in-out infinite' : 'none',
            }}
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md" />
            
            {/* Button content */}
            <span className="relative z-10 flex items-center gap-4">
              <Heart 
                size={36} 
                className="fill-white animate-pulse"
              />
              <span className="tracking-wide">Click If You Love Me</span>
              <Heart 
                size={36} 
                className="fill-white animate-pulse"
                style={{ animationDelay: '0.3s' }}
              />
            </span>

            {/* Sparkle decorations */}
            <Sparkles 
              size={28} 
              className="absolute -top-3 -right-3 text-yellow-300 animate-sparkle"
            />
            <Sparkles 
              size={22} 
              className="absolute -bottom-2 -left-2 text-yellow-300 animate-sparkle"
              style={{ animationDelay: '0.5s' }}
            />
            <Star 
              size={20} 
              className="absolute top-0 left-0 text-pink-300 animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
          </button>

          {/* Click counter */}
          {clickCount > 0 && (
            <p className="mt-6 text-rose-500 font-medium animate-fade-in-up">
              You clicked {clickCount} time{clickCount !== 1 ? 's' : ''}! 💕
            </p>
          )}

          {/* Hint text */}
          <p className="mt-8 text-rose-500/70 text-lg animate-pulse">
            Go ahead, click the button... I dare you! 💕
          </p>
        </div>

        {/* Bottom decoration */}
        <div
          className={`flex justify-center gap-4 mt-20 transition-all duration-1000 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Heart size={28} className="text-rose-300 fill-rose-200 animate-float" />
          <Heart size={36} className="text-rose-400 fill-rose-300 animate-float-3d" />
          <Heart size={32} className="text-rose-500 fill-rose-400 animate-float-slow" />
          <Heart size={36} className="text-rose-400 fill-rose-300 animate-float-3d" style={{ animationDelay: '0.5s' }} />
          <Heart size={28} className="text-rose-300 fill-rose-200 animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  );
};

export default SurpriseButton;
