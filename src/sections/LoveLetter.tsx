import { useState, useCallback } from 'react';
import { Heart, Feather, Sparkles, Quote, Lock, Unlock } from 'lucide-react';
import { useInView } from '@/hooks/useScrollProgress';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useMagnetic } from '@/hooks/useMousePosition';

// Typewriter paragraph component
const TypewriterParagraph = ({ 
  text, 
  delay, 
  isActive,
  onComplete 
}: { 
  text: string; 
  delay: number;
  isActive: boolean;
  onComplete?: () => void;
}) => {
  const { displayText, isComplete } = useTypewriter({
    text,
    speed: 30,
    delay: isActive ? delay : 999999,
    onComplete,
  });

  return (
    <p className="font-handwritten text-xl sm:text-2xl md:text-3xl text-rose-700 leading-relaxed min-h-[1.5em]">
      {displayText}
      {!isComplete && isActive && (
        <span className="inline-block w-0.5 h-6 bg-rose-500 ml-1 animate-pulse" />
      )}
    </p>
  );
};

// Sealed letter envelope
const SealedLetter = ({ onOpen }: { onOpen: () => void }) => {
  const magnetic = useMagnetic<HTMLButtonElement>(0.3);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        ref={magnetic.ref}
        style={magnetic.style}
        {...magnetic.handlers}
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group"
      >
        {/* Envelope */}
        <div className={`relative w-64 h-44 bg-gradient-to-br from-rose-300 to-pink-400 rounded-lg shadow-romantic-lg transition-all duration-500 ${
          isHovered ? 'scale-105 shadow-glow' : ''
        }`}>
          {/* Envelope flap */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-rose-200 to-rose-300 rounded-t-lg origin-top transition-transform duration-500"
            style={{ 
              clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
              transform: isHovered ? 'rotateX(30deg)' : 'rotateX(0)',
            }}
          />
          
          {/* Heart seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}>
              <Lock size={28} className="text-rose-500 group-hover:hidden" />
              <Unlock size={28} className="text-rose-500 hidden group-hover:block" />
            </div>
          </div>

          {/* Decorative hearts */}
          <div className="absolute bottom-4 left-4">
            <Heart size={16} className="text-white/50 fill-white/30" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Heart size={16} className="text-white/50 fill-white/30" />
          </div>
        </div>

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
          style={{ 
            boxShadow: '0 0 40px rgba(255, 107, 157, 0.6), 0 0 80px rgba(255, 107, 157, 0.3)',
          }}
        />
      </button>

      <p className="mt-6 text-rose-500 font-medium animate-pulse">
        Click to open my letter
      </p>

      {/* Floating hearts around envelope */}
      <div className="absolute -top-8 -left-8 animate-float">
        <Heart size={20} className="text-rose-300 fill-rose-200" />
      </div>
      <div className="absolute -bottom-4 -right-8 animate-float-slow">
        <Heart size={24} className="text-pink-300 fill-pink-200" />
      </div>
    </div>
  );
};

// Main Love Letter section
const LoveLetter = () => {
  const [sectionRef, isInView] = useInView<HTMLElement>(0.2);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);

  const paragraphs = [
    "As I sit here thinking of you, my heart overflows with love and gratitude. You are the most beautiful thing that has ever happened to me, and every day I thank the universe for bringing you into my life.",
    "Your love has transformed my world in ways I never imagined possible. With you, I have found my home, my best friend, and my soulmate. Your smile lights up my darkest days, and your touch sends shivers down my spine.",
    "I promise to cherish you, to support you, and to love you with all that I am - today, tomorrow, and for all the days of our lives. You are my forever, my always, and my everything.",
    "I love you more than words could ever express, more than the stars in the sky, and more than all the grains of sand on every beach. You are my heart, my soul, and my reason for being.",
  ];

  const handleParagraphComplete = useCallback(() => {
    if (currentParagraph < paragraphs.length - 1) {
      setCurrentParagraph(prev => prev + 1);
    }
  }, [currentParagraph, paragraphs.length]);

  const openLetter = () => {
    setIsLetterOpen(true);
  };

  return (
    <section
      id="love-letter"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-soft-pink-gradient overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-rose-200/30 blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-pink-300/25 blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-rose-300/20 blur-2xl animate-blob" style={{ animationDelay: '-3s' }} />

      {/* Floating hearts */}
      <div className="absolute top-24 right-16 animate-float-3d">
        <Heart size={28} className="text-rose-300 fill-rose-200" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float-slow" style={{ animationDelay: '1s' }}>
        <Heart size={24} className="text-pink-300 fill-pink-200" />
      </div>
      <div className="absolute top-1/3 right-24 animate-float" style={{ animationDelay: '2s' }}>
        <Heart size={20} className="text-rose-400 fill-rose-300" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-1/4 left-20 animate-sparkle">
        <Sparkles size={28} className="text-yellow-300" />
      </div>
      <div className="absolute bottom-1/3 right-32 animate-sparkle" style={{ animationDelay: '2s' }}>
        <Sparkles size={24} className="text-yellow-200" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Feather size={32} className="text-rose-400 animate-float" />
            <Heart size={40} className="text-rose-500 fill-rose-400 animate-pulse-heart" />
            <Feather size={32} className="text-rose-400 animate-float" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="font-elegant text-6xl sm:text-7xl md:text-8xl text-rose-600 mb-6">
            My Love Letter
          </h2>

          <p className="text-lg text-rose-500/80 max-w-xl mx-auto">
            Words from my heart, written just for you.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`h-0.5 bg-gradient-to-r from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
            <Heart size={20} className="text-rose-400 fill-rose-300 animate-pulse" />
            <div className={`h-0.5 bg-gradient-to-l from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
          </div>
        </div>

        {/* Letter content */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {!isLetterOpen ? (
            // Sealed envelope
            <div className="flex justify-center py-12">
              <SealedLetter onOpen={openLetter} />
            </div>
          ) : (
            // Open letter
            <div className="relative animate-fade-in-scale">
              {/* Decorative corners */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-rose-300 rounded-tl-3xl animate-pulse" />
              <div className="absolute -top-4 -right-4 w-20 h-20 border-t-4 border-r-4 border-rose-300 rounded-tr-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-4 border-l-4 border-rose-300 rounded-bl-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-rose-300 rounded-br-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

              {/* Letter content */}
              <div className="glass-premium rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-10 left-10 animate-float-slow">
                    <Heart size={80} className="text-rose-500" />
                  </div>
                  <div className="absolute bottom-20 right-10 animate-float">
                    <Heart size={100} className="text-rose-500" />
                  </div>
                  <div className="absolute top-1/2 left-1/4 animate-float-3d">
                    <Heart size={60} className="text-rose-500" />
                  </div>
                </div>

                {/* Letter header */}
                <div className="relative z-10 text-center mb-10">
                  <div className="inline-flex items-center gap-3 text-rose-400 mb-6">
                    <Sparkles size={24} className="animate-sparkle" />
                    <Sparkles size={18} className="animate-sparkle" style={{ animationDelay: '0.5s' }} />
                    <Sparkles size={24} className="animate-sparkle" style={{ animationDelay: '1s' }} />
                  </div>
                  <p className="font-elegant text-4xl sm:text-5xl text-rose-600 animate-fade-in-down">
                    To My Dearest Love,
                  </p>
                </div>

                {/* Quote decoration */}
                <div className="absolute top-24 left-8 opacity-20 animate-float">
                  <Quote size={60} className="text-rose-400" />
                </div>

                {/* Letter body with typewriter effect */}
                <div className="relative z-10 space-y-8">
                  {paragraphs.map((paragraph, index) => (
                    <TypewriterParagraph
                      key={index}
                      text={paragraph}
                      delay={index * 2500}
                      isActive={isLetterOpen}
                      onComplete={index === currentParagraph ? handleParagraphComplete : undefined}
                    />
                  ))}
                </div>

                {/* Letter footer */}
                <div className="relative z-10 mt-14 text-center">
                  <div className="flex justify-center gap-3 mb-8">
                    <Heart size={24} className="text-rose-400 fill-rose-300 animate-float" />
                    <Heart size={32} className="text-rose-500 fill-rose-400 animate-pulse-heart" />
                    <Heart size={24} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.3s' }} />
                  </div>

                  <p className="font-elegant text-4xl sm:text-5xl text-rose-600 mb-3 animate-fade-in-up">
                    Forever Yours,
                  </p>
                  <p className="font-handwritten text-3xl sm:text-4xl text-rose-500 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    [Your Name]
                  </p>

                  {/* Decorative sparkles */}
                  <div className="flex justify-center gap-3 mt-8">
                    <Sparkles size={20} className="text-rose-300 animate-sparkle" />
                    <Sparkles size={28} className="text-rose-400 animate-sparkle" style={{ animationDelay: '0.5s' }} />
                    <Sparkles size={20} className="text-rose-300 animate-sparkle" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom hearts decoration */}
        <div
          className={`flex justify-center gap-4 mt-16 transition-all duration-1000 delay-700 ${
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

export default LoveLetter;
