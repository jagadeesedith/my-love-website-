import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

// Hook for typewriter effect
export function useTypewriter({
  text,
  speed = 50,
  delay = 0,
  onComplete,
}: UseTypewriterOptions): { displayText: string; isComplete: boolean; reset: () => void } {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const reset = useCallback(() => {
    setDisplayText('');
    setIsComplete(false);
    setHasStarted(false);
  }, []);

  useEffect(() => {
    if (hasStarted) return;

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted || isComplete) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, text, speed, isComplete, onComplete]);

  return { displayText, isComplete, reset };
}

// Hook for multiple typewriter texts
export function useMultiTypewriter(
  texts: string[],
  options: {
    speed?: number;
    delay?: number;
    pauseBetween?: number;
  } = {}
): {
  currentText: string;
  currentIndex: number;
  isTyping: boolean;
} {
  const { speed = 50, delay = 0, pauseBetween = 1000 } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentIndex >= texts.length) return;

    const text = texts[currentIndex];
    let charIndex = 0;
    
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          setCurrentText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
            setCurrentText('');
          }, pauseBetween);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [currentIndex, texts, speed, delay, pauseBetween]);

  return { currentText, currentIndex, isTyping };
}
