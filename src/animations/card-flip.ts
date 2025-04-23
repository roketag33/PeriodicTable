import gsap from 'gsap';

/**
 * Animation de flip de carte
 * @param element - L'élément HTML à animer
 * @param duration - Durée de l'animation en secondes
 * @param onComplete - Callback à la fin de l'animation
 */
export function cardFlip(element: HTMLElement, duration: number = 0.6, onComplete?: () => void): gsap.core.Timeline {
  const timeline = gsap.timeline({
    paused: true,
    onComplete
  });
  
  // Animation de flip
  timeline
    .set(element, { transformPerspective: 1000 })
    .to(element, {
      rotationY: 90,
      duration: duration / 2,
      ease: "power1.in"
    })
    .set(element, { rotationY: -90 })
    .to(element, {
      rotationY: 0,
      duration: duration / 2,
      ease: "power1.out"
    });
  
  return timeline;
} 