import { useState, useEffect } from 'react';

const AnimatedText = ({
  text,
  ms = 100,
  className = '',
  reverse = false
}: { text: string, ms?: number, className?: string, reverse?: boolean }) => {
  const [animatedText, setAnimatedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(reverse ? text.length : 0);

  useEffect(() => {
    setAnimatedText('');
    setCurrentIndex(reverse ? text.length : 0);
  }, [text]);
  
  useEffect(() => {
    const textLength = text.length;
    const interval = setInterval(() => {
      if (!reverse && currentIndex <= textLength) {
        setAnimatedText(text.slice(0, currentIndex));
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else if (reverse && currentIndex >= 0) {
        setAnimatedText(text.slice(0, currentIndex));
        setCurrentIndex(prevIndex => prevIndex - 1);
      } else {
        clearInterval(interval);
      }
    }, ms);
    return () => clearInterval(interval);
  }, [text, currentIndex, ms, reverse]);

  return <span className={className}>⠀{animatedText}</span>;
};
export default AnimatedText;