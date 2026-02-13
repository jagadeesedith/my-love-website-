import { useEffect, useState } from 'react';
import Hero from './sections/Hero';
import OurStory from './sections/OurStory';
import PhotoGallery from './sections/PhotoGallery';
import LoveLetter from './sections/LoveLetter';
import SurpriseButton from './sections/SurpriseButton';
import Footer from './sections/Footer';
import { Heart } from 'lucide-react';

/**
 * ENHANCED Romantic Single-Page Website for My Girlfriend
 * 
 * NEW FEATURES ADDED:
 * ===================
 * 
 * 🎨 VISUAL EFFECTS:
 * - Animated gradient backgrounds that shift colors
 * - Morphing blob shapes in background
 * - Glassmorphism premium effects with glow
 * - Parallax scrolling effects
 * - 3D perspective and transforms
 * 
 * ✨ ANIMATIONS:
 * - Particle system with mouse interaction (Hero)
 * - 3D tilt effect on cards (follows mouse)
 * - Magnetic button effect (buttons attract to cursor)
 * - Typewriter text effect (Love Letter)
 * - 3D card flip animations (Timeline)
 * - Floating hearts with various animation patterns
 * - Staggered reveal animations
 * - Shimmer and sparkle effects
 * 
 * 🎭 INTERACTIVE ELEMENTS:
 * - Lightbox for photo gallery with keyboard navigation
 * - Sealed envelope that opens to reveal letter
 * - Click counter on surprise button
 * - Animated counters (days together)
 * - Confetti explosion with multiple shapes
 * - Heart particle explosions
 * 
 * 📱 RESPONSIVE:
 * - Mobile-friendly with touch interactions
 * - Adaptive layouts for all screen sizes
 * - Smooth scrolling throughout
 */

// Loading screen component
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-romantic-gradient-animated flex flex-col items-center justify-center">
      {/* Animated hearts */}
      <div className="relative mb-8">
        <Heart 
          size={80} 
          className="text-rose-500 fill-rose-400 animate-pulse-heart"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 107, 157, 0.5))' }}
        />
        <div className="absolute inset-0 animate-ping opacity-50">
          <Heart size={80} className="text-rose-400" />
        </div>
      </div>

      {/* Loading text */}
      <p className="font-elegant text-3xl text-rose-600 mb-6">
        Loading Love...
      </p>

      {/* Progress bar */}
      <div className="w-64 h-3 bg-rose-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress percentage */}
      <p className="mt-4 text-rose-500 font-medium">
        {progress}%
      </p>

      {/* Floating hearts decoration */}
      <div className="absolute bottom-20 left-20 animate-float">
        <Heart size={24} className="text-rose-300 fill-rose-200" />
      </div>
      <div className="absolute top-32 right-24 animate-float-slow">
        <Heart size={28} className="text-pink-300 fill-pink-200" />
      </div>
      <div className="absolute bottom-32 right-32 animate-float" style={{ animationDelay: '1s' }}>
        <Heart size={20} className="text-rose-400 fill-rose-300" />
      </div>
    </div>
  );
};

// Custom cursor follower
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-100"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Heart
          size={isHovering ? 32 : 20}
          className={`text-rose-400 fill-rose-300 transition-all duration-200 ${
            isHovering ? 'opacity-80' : 'opacity-50'
          }`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255, 107, 157, 0.6))',
          }}
        />
      </div>
      {/* Trail cursor */}
      <div
        className="fixed pointer-events-none z-[9998] transition-transform duration-300"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Heart
          size={isHovering ? 48 : 32}
          className="text-rose-300 fill-rose-200 opacity-20"
        />
      </div>
    </>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <main className="relative overflow-x-hidden">

            {/* Floating hearts background */}
            <Heart className="absolute top-20 left-10 text-pink-300 fill-pink-200 animate-float-slow opacity-40" size={14} />
            <Heart className="absolute top-40 right-20 text-pink-300 fill-pink-200 animate-float-slow opacity-40" size={18} />
            <Heart className="absolute bottom-32 left-20 text-pink-300 fill-pink-200 animate-float-slow opacity-40" size={12} />
            <Heart className="absolute bottom-20 right-10 text-pink-300 fill-pink-200 animate-float-slow opacity-40" size={16} />

          {/* Custom cursor (desktop only) */}
          <CustomCursor />
          
          {/* Hero Section - Enhanced with particle system and 3D effects */}
          <Hero />
          
          {/* Our Story Section - 3D flip cards and animated timeline */}
          <OurStory />
          
          {/* Photo Gallery Section - 3D tilt, lightbox, and hover effects */}
          <PhotoGallery />
          
          {/* Love Letter Section - Typewriter effect and sealed envelope */}
          <LoveLetter />
          
          {/* Surprise Button Section - Confetti explosion and magnetic button */}
          <SurpriseButton />
          
          {/* Footer - Animated closing */}
          <Footer />
        </main>
      )}
    </>
  );
}

export default App;
