import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically resets scroll position to the top on route changes.
 * This should be placed inside a Router context.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top on path change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
