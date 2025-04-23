import gsap from 'gsap';

/**
 * Animation de zoom in
 * @param element - L'élément HTML à animer
 * @param duration - Durée de l'animation en secondes
 * @param onComplete - Callback à la fin de l'animation
 */
export function zoomIn(element: HTMLElement, duration: number = 0.5, onComplete?: () => void): gsap.core.Timeline {
  const timeline = gsap.timeline({
    paused: true,
    onComplete
  });
  
  // Animation de zoom
  timeline
    .set(element, { opacity: 0, scale: 0.5 })
    .to(element, {
      opacity: 1,
      scale: 1,
      duration,
      ease: "back.out(1.7)"
    });
  
  return timeline;
} 