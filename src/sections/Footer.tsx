import { useEffect, useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { useInView } from '@/hooks/useScrollProgress';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [ref, isInView] = useInView<HTMLElement>(0.3);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating hearts for footer
    const generatedHearts = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 5,
    }));
    setHearts(generatedHearts);
  }, []);

  return (
    <footer 
      ref={ref}
      className="relative py-16 bg-gradient-to-t from-rose-100 to-pink-50 overflow-hidden"
    >
      {/* Vertical line from section above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-rose-300 to-transparent" />
      
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: '6s',
            opacity: 0.3,
          }}
        >
          <Heart size={16 + Math.random() * 12} className="text-rose-300 fill-rose-200" />
        </div>
      ))}

      {/* Sparkles */}
      <div className="absolute top-8 left-16 animate-sparkle">
        <Sparkles size={20} className="text-yellow-300" />
      </div>
      <div className="absolute top-12 right-20 animate-sparkle" style={{ animationDelay: '1s' }}>
        <Sparkles size={16} className="text-yellow-200" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top decoration */}
        <div 
          className={`flex justify-center gap-3 mb-8 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Star size={20} className="text-yellow-300 fill-yellow-200 animate-pulse" />
          <Heart size={28} className="text-rose-500 fill-rose-400 animate-pulse-heart" />
          <Star size={20} className="text-yellow-300 fill-yellow-200 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Main message */}
        <p 
          className={`font-elegant text-3xl sm:text-4xl text-rose-600 mb-6 transition-all duration-700 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          Made with love, for the one I love
        </p>

        {/* Hearts row */}
        <div 
          className={`flex justify-center gap-4 mb-8 transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Heart size={20} className="text-rose-400 fill-rose-300 animate-float" />
          <Heart size={28} className="text-rose-500 fill-rose-400 animate-float-3d" />
          <Heart size={24} className="text-pink-400 fill-pink-300 animate-float-slow" />
          <Heart size={28} className="text-rose-500 fill-rose-400 animate-float-3d" style={{ animationDelay: '0.5s' }} />
          <Heart size={20} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Copyright */}
        <p 
          className={`text-rose-400/80 text-sm mb-4 transition-all duration-700 delay-400 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          © {currentYear} • Forever & Always • Created with{' '}
          <Heart size={14} className="inline text-rose-500 fill-rose-400 animate-pulse" />
        </p>

        {/* Bottom quote */}
        <p 
          className={`text-rose-500/60 text-sm max-w-md mx-auto italic transition-all duration-700 delay-500 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          "In all the world, there is no heart for me like yours. 
          In all the world, there is no love for you like mine."
        </p>

        {/* Final hearts */}
        <div 
          className={`flex justify-center gap-2 mt-8 transition-all duration-700 delay-600 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Heart size={14} className="text-rose-300 fill-rose-200" />
          <Heart size={18} className="text-rose-400 fill-rose-300" />
          <Heart size={14} className="text-rose-300 fill-rose-200" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
