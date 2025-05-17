/**
 * Custom hook for smooth scrolling to elements
 */
export const useSmooth = () => {
  /**
   * Smoothly scrolls to an element by ID
   * @param id Element ID to scroll to
   * @param offset Optional offset from the top (default: 80px)
   */
  const scrollToElement = (id: string, offset = 80): void => {
    const element = document.getElementById(id);
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return { scrollToElement };
};
