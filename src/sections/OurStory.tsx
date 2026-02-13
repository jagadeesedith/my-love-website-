import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Calendar, Star, Sparkles, Clock, MapPin } from 'lucide-react';
import { useInView, useParallax } from '@/hooks/useScrollProgress';
import { useTilt } from '@/hooks/useMousePosition';
import firstChat from '@/assets/firstchat.jpg';
import firstMeet from '@/assets/firstmeet.jpg';
import firstDate from '@/assets/firstdate.jpg';
import specialMoment from '@/assets/specialmoment.jpg';

// Timeline event data
interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  caption: string;
  color: string;
  image?: string;
  video?: string;
}

const timelineEvents: TimelineEvent[] = [
 {
  id: 1,
  date: '02 Feb 2025',
  title: 'Our First Chat',
  description: 'The day our paths crossed...',
  icon: <MessageCircle size={24} />,
  caption: 'Where it all began... 💬',
  color: 'from-rose-400 to-pink-500',
  image: firstChat,
},

  {
    id: 2,
    date: '09 mar 2025',
    title: 'First Time We Met',
    description:
      'Seeing you for the first time took my breath away. Your smile was even more beautiful in person.',
    icon: <MapPin size={24} />,
    caption: 'The day my dreams came true... 🌟',
    color: 'from-pink-400 to-rose-500',
    image: firstMeet, // 🖼 image
  },

  {
    id: 3,
    date: '14 Apr 2025',
    title: 'Our First Date',
    description:
      'Every moment with you felt like magic. From the way you laughed at my jokes to how your eyes sparkled.',
    icon: <Calendar size={24} />,
    caption: "A night I'll never forget... 💕",
    color: 'from-rose-500 to-pink-400',
    image: firstDate, // 🖼 image
  },

  {
    id: 4,
    date: '12  Oct 2025',
    title: 'A Special Moment',
    description:
      'The moment I realized I was falling for you. Your kindness and beauty captivated me completely.',
    icon: <Star size={24} />,
    caption: 'When I knew you were the one... ✨',
    color: 'from-pink-500 to-rose-400',
    image: specialMoment, // 🖼 image
  },
];

// 3D Flip Card Component
const FlipCard = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt<HTMLDivElement>(10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`relative flex items-center gap-4 md:gap-8 mb-20 last:mb-0 ${
        isEven ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Content side */}
      <div className={`w-[45%] flex ${isEven ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
        <div
          className={`inline-block perspective-1000 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-x-0'
              : `opacity-0 ${isEven ? '-translate-x-20' : 'translate-x-20'}`
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
          {/* 3D Flip Card */}
          <div
            ref={tilt.ref}
            style={tilt.style}
            {...tilt.handlers}
            className="relative w-full max-w-[600px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`relative w-full transition-transform duration-700 preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div 
                className="glass-premium rounded-2xl p-6 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Date badge */}
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r ${event.color} text-white text-sm font-medium rounded-full mb-4 shadow-lg`}>
                  <Clock size={14} />
                  {event.date}
                </span>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-rose-700 mb-3 flex items-center gap-2 justify-center">
                  {isEven && event.icon}
                  {event.title}
                  {!isEven && event.icon}
                </h3>

                {/* Preview text */}
                <p className="text-rose-500/70 text-sm mb-4">
                  Click to reveal the memory...
                </p>

                {/* Click hint */}
                <div className="flex justify-center">
                  <Sparkles size={20} className="text-rose-400 animate-pulse" />
                </div>
              </div>

              {/* Back of card */}
              <div 
                className="absolute inset-0 glass-premium rounded-2xl p-6 backface-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Description */}
                <p className="text-rose-700 leading-relaxed mb-4 text-sm sm:text-base">
                  {event.description}
                </p>

                {/* Caption */}
                <p className="text-base text-rose-500 italic font-handwritten border-t border-rose-200 pt-3">
                  {event.caption}
                </p>  

                {/* Hearts */}
                <div className="flex justify-center gap-2 mt-4">
                  <Heart size={16} className="text-rose-400 fill-rose-300 animate-float" />
                  <Heart size={20} className="text-rose-500 fill-rose-400 animate-float" style={{ animationDelay: '0.2s' }} />
                  <Heart size={16} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center node */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-romantic-lg transition-all duration-500 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          style={{ 
            transitionDelay: `${index * 200 + 300}ms`,
            boxShadow: '0 0 30px rgba(255, 107, 157, 0.5)',
          }}
        >
          <span className="text-white">{event.icon}</span>
        </div>
        
        {/* Pulse rings */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${event.color} opacity-30 animate-ping`}
          style={{ animationDuration: '2s' }}
        />
        <div
          className={`absolute inset-[-8px] rounded-full border-2 border-rose-300/50 animate-pulse`}
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Empty space for alternating layout */}
      <div className="flex-1" />

      {/* Image Side */}
<div className="w-[40%] hidden md:flex justify-start ml-[60px]">

  <div
  className={`transition-all duration-1000 ease-out ${
    isVisible
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-75 translate-y-10'
  }`}

    style={{ transitionDelay: `${index * 200 + 400}ms` }}
  >

    {/* If video exists */}
    {event.video && (
  <video
    src={event.video}
    autoPlay
    muted
    playsInline
    loop
    preload="auto"
    className="
      rounded-2xl 
      w-full 
      max-w-md 
      object-cover 
      transition-all 
      duration-700 
      hover:scale-110 
      hover:rotate-1
      border-4 
      border-white/40
      shadow-[0_20px_60px_rgba(255,105,180,0.35)]
      hover:shadow-[0_25px_80px_rgba(255,105,180,0.55)]
      bg-white/20
      backdrop-blur-xl
    "
  />
)}


    {/* If image exists */}
   {event.image && (
  <img
    src={event.image}
    alt={event.title}
    className="
      rounded-2xl
      w-full
      max-w-[600px]
      h-auto
      object-cover
      transition-all
      duration-700
      hover:scale-105
      border-4
      border-white/40
      shadow-[0_20px_60px_rgba(255,105,180,0.35)]
      hover:shadow-[0_25px_80px_rgba(255,105,180,0.55)]
      ml-4 md:ml-0
    "
  />
)}


  </div>
</div>


    </div>
  );
};

// Animated counter
const LoveCounter = () => {
  const [days, setDays] = useState(0);
  const [ref, isInView] = useInView<HTMLDivElement>(0.5);

  useEffect(() => {
    if (!isInView) return;
    
    const targetDays = 365; // Example: days together
    const duration = 2000;
    const steps = 60;
    const increment = targetDays / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetDays) {
        setDays(targetDays);
        clearInterval(timer);
      } else {
        setDays(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <div ref={ref} className="flex justify-center gap-8 sm:gap-16 mt-16">
      {[
        { value: days, label: 'Days Together' },
        { value: '∞', label: 'Love Forever' },
        { value: '100%', label: 'My Heart' },
      ].map((item, i) => (
        <div 
          key={i}
          className={`text-center transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${i * 150}ms` }}
        >
          <div className="text-4xl sm:text-5xl font-bold text-rose-600 mb-2 animate-pulse-heart">
            {item.value}
          </div>
          <div className="text-sm text-rose-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// Main Our Story section
const OurStory = () => {
  const [sectionRef, isInView] = useInView<HTMLElement>(0.1);
  const [parallaxRef, parallaxOffset] = useParallax<HTMLDivElement>(0.3);

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-soft-pink-gradient overflow-hidden"
    >
      {/* Parallax decorative elements */}
      <div 
        ref={parallaxRef}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-rose-200/40 blur-3xl"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      />
      <div 
        className="absolute bottom-32 right-20 w-40 h-40 rounded-full bg-pink-300/30 blur-3xl"
        style={{ transform: `translateY(${-parallaxOffset * 0.3}px)` }}
      />

      {/* Floating hearts with different animations */}
      <div className="absolute top-24 right-16 animate-float-orbit" style={{ animationDuration: '12s' }}>
        <Heart size={28} className="text-rose-300 fill-rose-200" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float-3d">
        <Heart size={24} className="text-pink-300 fill-pink-200" />
      </div>
      <div className="absolute top-1/3 right-24 animate-float-slow" style={{ animationDelay: '2s' }}>
        <Heart size={20} className="text-rose-400 fill-rose-300" />
      </div>

      {/* Sparkle decorations */}
      <div className="absolute top-40 left-1/4 animate-sparkle">
        <Sparkles size={24} className="text-yellow-300" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 animate-sparkle" style={{ animationDelay: '1.5s' }}>
        <Sparkles size={20} className="text-yellow-200" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with enhanced animation */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles size={28} className="text-rose-400 animate-pulse" />
            <Heart size={36} className="text-rose-500 fill-rose-400 animate-pulse-heart" />
            <Sparkles size={28} className="text-rose-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="font-elegant text-6xl sm:text-7xl md:text-8xl text-rose-600 mb-6">
            Our Story
          </h2>

          <p className="text-lg sm:text-xl text-rose-500/80 max-w-2xl mx-auto leading-relaxed">
            Every love story is beautiful, but ours is my favorite. 
            Here are the moments that made us <span className="font-handwritten text-2xl text-rose-600">"us"</span>.
          </p>

          {/* Decorative animated line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`h-0.5 bg-gradient-to-r from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
            <Heart size={20} className="text-rose-400 fill-rose-300 animate-bounce" />
            <div className={`h-0.5 bg-gradient-to-l from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line with glow effect - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 timeline-line-glow rounded-full transform -translate-x-1/2">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-400 via-pink-400 to-rose-300 rounded-full animate-shimmer" />
          </div>

          {/* Mobile line */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 timeline-line-glow rounded-full" />

          {/* Timeline events */}
          <div className="space-y-24 md:space-y-32">

            {timelineEvents.map((event, index) => (
              <FlipCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* Love counter */}
        <LoveCounter />

        {/* Bottom message */}
        <div
          className={`text-center mt-20 transition-all duration-1000 delay-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="glass-premium rounded-3xl p-8 inline-block max-w-xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl" />
            
            <p className="relative z-10 text-rose-600 font-handwritten text-2xl sm:text-3xl">
              "And our story continues to unfold, one beautiful chapter at a time..."
            </p>
            
            <div className="flex justify-center gap-3 mt-6 relative z-10">
              <Heart size={18} className="text-rose-400 fill-rose-300 animate-float" />
              <Heart size={24} className="text-rose-500 fill-rose-400 animate-float-3d" />
              <Heart size={18} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
