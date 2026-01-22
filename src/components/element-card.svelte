<script lang="ts">
  import { onMount } from 'svelte';
  import { currentLang } from '../stores/langStore';
  import type { ElementData } from '../types/element';
  import gsap from 'gsap';
  
  // Props
  export let element: ElementData;
  export let onClick: (number: number) => void = () => {};
  
  // Référence pour animer le composant
  let elementCard: HTMLButtonElement;
  
  // Animation au survol
  const handleMouseEnter = () => {
    if (elementCard) {
      gsap.to(elementCard, {
        scale: 1.1,
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        duration: 0.2,
        ease: 'power1.out'
      });
    }
  };
  
  const handleMouseLeave = () => {
    if (elementCard) {
      gsap.to(elementCard, {
        scale: 1,
        zIndex: 1,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: 0.2,
        ease: 'power1.in'
      });
    }
  };
  
  // Animation d'apparition au chargement
  onMount(() => {
    gsap.from(elementCard, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      delay: element.number * 0.005, // Délai progressif basé sur le numéro atomique
      ease: 'power1.out'
    });
  });
  
  // Fonction pour déterminer l'état de l'élément
  const getStateIndicator = (state: string | undefined): string => {
    if (!state) return '';
    
    switch(state) {
      case 'gas':
        return '💨';
      case 'liquid':
        return '💧';
      case 'solid':
        return '🧱';
      default:
        return '';
    }
  };

  // Fonction pour déterminer la catégorie CSS à partir de la catégorie de l'élément
  const getCategoryClass = (category: string | undefined): string => {
    if (!category) return 'category-unknown';

    // Mapping des catégories des données vers les nouvelles classes CSS neon
    if (category.includes('alkali metal')) return 'category-alkali-metal';
    if (category.includes('alkaline earth metal')) return 'category-alkaline-earth';
    if (category.includes('transition metal')) return 'category-transition-metal';
    if (category === 'metal' || category.includes('post-transition metal')) return 'category-post-transition-metal';
    if (category === 'metalloid') return 'category-metalloid';
    if (category === 'nonmetal' || category.includes('diatomic nonmetal')) return 'category-nonmetal';
    if (category === 'halogen') return 'category-halogen';
    if (category === 'noble gas') return 'category-noble-gas';
    if (category === 'lanthanide') return 'category-lanthanide';
    if (category === 'actinide') return 'category-actinide';
    
    return 'category-unknown'; // Couleur par défaut
  };

  // Déterminer la classe CSS pour l'élément actuel
  const categoryClass = getCategoryClass(element.category);
</script>

<button 
  bind:this={elementCard}
  class="element-card hover:z-10 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 {categoryClass}"
  class:opacity-75={element.state_at_stp === 'gas'}
  class:ring-2={element.state_at_stp === 'liquid'}
  class:ring-blue-500={element.state_at_stp === 'liquid'}
  on:click={() => onClick(element.number)}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  aria-label={$currentLang === 'fr' ? `Élément ${element.name_fr}` : `Element ${element.name_en}`}
>
  <div class="element-number">{element.number}</div>
  <div class="element-symbol">{element.symbol}</div>
  <div class="element-name">
    {$currentLang === 'fr' ? element.name_fr : element.name_en}
  </div>
  <div class="element-state">{getStateIndicator(element.state_at_stp)}</div>
</button>

<style>
  .element-card {
    @apply w-full h-full rounded-lg relative flex flex-col items-center justify-center p-1;
    min-height: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .element-card:hover {
    transform: scale(1.15);
    z-index: 20;
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
    border-color: currentColor;
  }
  
  .element-number {
    @apply text-[8px] md:text-xs absolute top-0.5 left-1 opacity-70 font-mono;
  }
  
  .element-symbol {
    @apply text-sm md:text-xl font-bold;
    text-shadow: 0 0 8px currentColor;
  }
  
  .element-name {
    @apply text-[6px] md:text-xs max-w-full opacity-70;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .element-state {
    @apply absolute top-0.5 right-1;
    font-size: min(0.5rem, 1.2vw);
  }
  
  @media (max-width: 1024px) {
    .element-card {
      @apply p-0;
    }
    
    .element-symbol {
      @apply text-xs;
    }
  }
</style> 