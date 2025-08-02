import { useCallback } from 'react';

export const useScrollTo = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToSection = useCallback((sectionId: string, offset: number = 100) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetPosition = section.offsetTop - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return { scrollToTop, scrollToSection };
};