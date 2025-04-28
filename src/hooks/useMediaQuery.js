import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Definir o valor inicial
    setMatches(mediaQuery.matches);
    
    // Callback para mudanças no estado da media query
    const handleResize = (event) => {
      setMatches(event.matches);
    };
    
    // Adicionar listener
    mediaQuery.addEventListener('change', handleResize);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [query]);

  return matches;
}