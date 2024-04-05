import { useState, useEffect } from 'react';

const AnimatedText = ({ text, ms = 100 }: { text: string, ms?: number }) => {
  const [animatedText, setAnimatedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex <= text.length) {
            setAnimatedText(text.slice(0, currentIndex));
            currentIndex++;
        } else {
            clearInterval(interval);
        }
    }, ms);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{animatedText}</span>;
};
export default AnimatedText;