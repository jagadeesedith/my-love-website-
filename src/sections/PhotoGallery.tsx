import { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, Camera, X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';
import { useInView } from '@/hooks/useScrollProgress';
import { useTilt } from '@/hooks/useMousePosition';
import Photo1 from '@/assets/photo1.jpg';
import Photo2 from '@/assets/photo2.jpg';
import Photo3 from '@/assets/photo3.jpg';
import Photo4 from '@/assets/photo4.jpg';
import Photo5 from '@/assets/photo5.jpg';
import Photo6 from '@/assets/photo6.jpg';

// Photo placeholder data
interface Photo {
  id: number;
  placeholder: string;
  caption: string;
  description: string;
  category: string;
  image : string;
}

const photos: Photo[] = [
  {
    id: 1,
    placeholder: 'Photo 1',
    caption: 'Our First Picture Together',
    description: 'The moment we captured our first memory together',
    category: 'Special Moments',
    image : Photo1,
  },
  {
    id: 2,
    placeholder: 'Photo 2',
    caption: 'That Beautiful Smile',
    description: 'Your smile that melts my heart every single time',
    category: 'Your Beauty',
    image : Photo2,
  },
  {
    id: 3,
    placeholder: 'Photo 3',
    caption: 'A Special Moment',
    description: 'A day I will always cherish in my heart',
    category: 'Memories',
    image : Photo3,
  },
  {
    id: 4,
    placeholder: 'Photo 4',
    caption: 'Together Forever',
    description: 'Us against the world, always and forever',
    category: 'Together',
    image : Photo4,
  },
  {
    id: 5,
    placeholder: 'Photo 5',
    caption: 'My Favorite Memory',
    description: 'The moment I fell even more deeply in love',
    category: 'Love',
    image : Photo5,
  },
  {
    id: 6,
    placeholder: 'Photo 6',
    caption: 'You & Me',
    description: 'The perfect pair, you and I, forever',
    category: 'Together',
    image : Photo6,
  },
];

// Lightbox component
const Lightbox = ({ 
  photo, 
  onClose, 
  onPrev, 
  onNext,
  currentIndex,
  totalPhotos 
}: { 
  photo: Photo; 
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalPhotos: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div 
      className={`fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 lightbox-overlay"
        onClick={onClose}
      />

      {/* Content */}
      <div className={`relative z-10 w-full max-w-4xl mx-4 transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <X size={24} />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={onPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <ChevronRight size={32} />
        </button>

        {/* Photo container */}
        <div className="glass-premium rounded-3xl overflow-hidden">
          {/* Placeholder */}
          <div className="aspect-[4/3] bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center relative">
            <div className="text-center">
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />

              <p className="text-rose-400 text-sm mt-2">Add your beautiful photo here</p>
            </div>
            
            {/* Decorative hearts */}
            <div className="absolute top-4 left-4">
              <Heart size={24} className="text-rose-300 fill-rose-200 animate-float" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Heart size={28} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Caption area */}
          <div className="p-6 bg-white/50">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full mb-3">
              {photo.category}
            </span>
            <h3 className="text-2xl font-bold text-rose-700 mb-2">{photo.caption}</h3>
            <p className="text-rose-500">{photo.description}</p>
          </div>
        </div>

        {/* Photo counter */}
        <div className="text-center mt-4 text-white/70 text-sm">
          {currentIndex + 1} / {totalPhotos}
        </div>
      </div>
    </div>
  );
};

// Gallery item component with 3D tilt effect
const GalleryItem = ({ 
  photo, 
  index, 
  onClick 
}: { 
  photo: Photo; 
  index: number;
  onClick: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt<HTMLDivElement>(15);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative group transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        ref={tilt.ref}
        style={tilt.style}
        {...tilt.handlers}
        className="gallery-item relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 aspect-[4/5] shadow-romantic cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/70 backdrop-blur-sm text-rose-600 text-xs font-medium rounded-full">
            {photo.category}
          </span>
        </div>

       {/* Show real image */}
        <img
          src={photo.image}
          alt={photo.caption}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"

        />

        {/* Hover overlay with zoom icon */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-rose-600/90 via-rose-500/50 to-transparent flex flex-col items-center justify-end p-6 transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`mb-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <ZoomIn size={32} className="text-white" />
          </div>
          <Heart
            size={24}
            className="text-white fill-white/80 mb-3 animate-pulse-heart"
          />
          <h3 className="text-white font-semibold text-xl mb-1">{photo.caption}</h3>
          <p className="text-white/90 text-sm">{photo.description}</p>
        </div>

        {/* Shine effect on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transition-transform duration-700 ${
            isHovered ? 'translate-x-full' : '-translate-x-full'
          }`}
          style={{ transform: isHovered ? 'translateX(100%) skewX(-15deg)' : 'translateX(-100%) skewX(-15deg)' }}
        />

        {/* Corner decorations */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
          <Heart size={18} className="text-white fill-white/60" />
        </div>
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
          <Heart size={16} className="text-white fill-white/50" />
        </div>
      </div>

      {/* Caption below image */}
      <div className="mt-4 text-center">
        <p className="text-rose-600 font-medium group-hover:text-rose-700 transition-colors">{photo.caption}</p>
      </div>
    </div>
  );
};

// Main Photo Gallery section
const PhotoGallery = () => {
  const [sectionRef, isInView] = useInView<HTMLElement>(0.1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const openLightbox = useCallback((photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const goToPrev = useCallback(() => {
    const newIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    const newIndex = selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  }, [selectedIndex]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-romantic-gradient-animated overflow-hidden"
    >
      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
          currentIndex={selectedIndex}
          totalPhotos={photos.length}
        />
      )}

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-rose-200/30 blur-3xl animate-blob" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-pink-300/25 blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />

      {/* Floating hearts */}
      <div className="absolute top-32 right-16 animate-float-3d">
        <Heart size={26} className="text-rose-300 fill-rose-200" />
      </div>
      <div className="absolute bottom-40 left-24 animate-float-slow" style={{ animationDelay: '1s' }}>
        <Heart size={30} className="text-pink-300 fill-pink-200" />
      </div>
      <div className="absolute top-1/2 right-12 animate-float" style={{ animationDelay: '2s' }}>
        <Heart size={22} className="text-rose-400 fill-rose-300" />
      </div>

      {/* Sparkles */}
      <div className="absolute top-1/4 left-16 animate-sparkle">
        <Sparkles size={28} className="text-yellow-300" />
      </div>
      <div className="absolute bottom-1/3 right-24 animate-sparkle" style={{ animationDelay: '2s' }}>
        <Sparkles size={22} className="text-yellow-200" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Camera size={32} className="text-rose-400 animate-bounce" style={{ animationDuration: '2s' }} />
            <Heart size={40} className="text-rose-500 fill-rose-400 animate-pulse-heart" />
            <Camera size={32} className="text-rose-400 animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>

          <h2 className="font-elegant text-6xl sm:text-7xl md:text-8xl text-rose-600 mb-6">
            Our Memories
          </h2>

          <p className="text-lg sm:text-xl text-rose-500/80 max-w-2xl mx-auto leading-relaxed">
            Every picture tells a story of our love. These moments captured in time 
            remind me of how blessed I am to have you in my life.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`h-0.5 bg-gradient-to-r from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
            <Heart size={20} className="text-rose-400 fill-rose-300 animate-pulse" />
            <div className={`h-0.5 bg-gradient-to-l from-transparent to-rose-300 rounded-full transition-all duration-1000 delay-500 ${isInView ? 'w-24' : 'w-0'}`} />
          </div>
        </div>

        {/* Photo grid with masonry-like layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <GalleryItem 
              key={photo.id} 
              photo={photo} 
              index={index}
              onClick={() => openLightbox(photo, index)}
            />
          ))}
        </div>

        {/* Bottom message */}
        <div
          className={`text-center mt-20 transition-all duration-1000 delay-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="glass-premium rounded-3xl p-8 inline-block max-w-xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl" />
            
            <p className="relative z-10 text-rose-600 font-handwritten text-2xl sm:text-3xl mb-4">
              "A picture is worth a thousand words, but our memories are priceless."
            </p>
            
            <div className="flex justify-center gap-3 relative z-10">
              <Heart size={20} className="text-rose-400 fill-rose-300 animate-float" />
              <Heart size={28} className="text-rose-500 fill-rose-400 animate-float-3d" />
              <Heart size={20} className="text-rose-400 fill-rose-300 animate-float" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
