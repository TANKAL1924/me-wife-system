import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation - triggers a CSS class when element enters viewport
 * @param options - IntersectionObserver options
 * @param options.threshold - visibility threshold (default 0.12)
 * @param options.rootMargin - root margin (default '0px 0px -40px 0px')
 * @param options.once - only trigger once (default true)
 */
interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

const useScrollAnimation = <T extends HTMLElement = HTMLElement>(options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer?.observe(element);
    return () => observer?.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
};

export default useScrollAnimation;
