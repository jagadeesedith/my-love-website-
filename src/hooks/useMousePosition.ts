import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

// Hook to track mouse position
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// Hook for 3D tilt effect on cards
export function useTilt<T extends HTMLElement>(intensity: number = 15): {
  ref: RefObject<T | null>;
  style: React.CSSProperties;
  handlers: {
    onMouseMove: (e: React.MouseEvent<T>) => void;
    onMouseLeave: () => void;
  };
} {
  const ref = useRef<T | null>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -intensity;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * intensity;
    
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setTransform('rotateX(0deg) rotateY(0deg)');
  }, []);

  return {
    ref,
    style: {
      transform,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.1s ease-out',
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// Hook for magnetic button effect
export function useMagnetic<T extends HTMLElement>(strength: number = 0.3): {
  ref: RefObject<T | null>;
  style: React.CSSProperties;
  handlers: {
    onMouseMove: (e: React.MouseEvent<T>) => void;
    onMouseLeave: () => void;
  };
} {
  const ref = useRef<T | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    
    setPosition({ x: distanceX, y: distanceY });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// Hook for cursor following effect
export function useCursorFollower(smoothness: number = 0.1): {
  followerRef: RefObject<HTMLDivElement | null>;
  updatePosition: (x: number, y: number) => void;
} {
  const followerRef = useRef<HTMLDivElement | null>(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const animate = useCallback(() => {
    currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * smoothness;
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * smoothness;

    if (followerRef.current) {
      followerRef.current.style.transform = `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px)`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, [smoothness]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animate]);

  const updatePosition = useCallback((x: number, y: number) => {
    targetPosition.current = { x, y };
  }, []);

  return { followerRef, updatePosition };
}
