<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import gsap from 'gsap';
  import ElementCard from '../components/element-card.svelte';
  import { filteredElements, selectElement, loadElements, activeFilters } from '../stores/elementsStore';
  import { t } from '../i18n';
  
  // Configuration du tableau périodique
  const tableLayout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 0, 0],
    [0, 0, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 0, 0]
  ];

  // Référence pour l'élément du tableau périodique
  let tableRef: HTMLDivElement;
  let prevActiveFilters: string[] = [];
  
  // Pulsation pour indiquer qu'il faut interagir
  const animatePulse = () => {
    // Sélectionner aléatoirement quelques éléments pour l'animation
    const pulseCount = 3;
    const elements = document.querySelectorAll('.element-card');
    
    if (elements.length > 0) {
      for (let i = 0; i < pulseCount; i++) {
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * elements.length);
          gsap.to(elements[randomIndex], {
            scale: 1.15,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
          });
        }, i * 500);
      }
    }
  };

  // Fonction pour appliquer l'animation de filtrage
  const applyFilterAnimation = () => {
    if (!tableRef) return;
    
    // Vérifier si des filtres spécifiques sont actifs (pas 'all' et pas vide)
    const hasSpecificFilters = $activeFilters.length > 0 && !$activeFilters.includes('all');
    
    // Toujours réinitialiser tous les éléments d'abord
    const allElements = document.querySelectorAll('.element-card');
    gsap.to(allElements, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power1.out"
    });
    
    // Seulement si des filtres spécifiques sont actifs, diminuer l'opacité des éléments non filtrés
    if (hasSpecificFilters) {
      const nonFiltered = document.querySelectorAll('.element-card:not(.filtered-element)');
      gsap.to(nonFiltered, {
        opacity: 0.3,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.01,
        ease: "power1.out"
      });
    }
  };
  
  // Observer les changements de filtres
  $: if ($activeFilters !== prevActiveFilters) {
    prevActiveFilters = [...$activeFilters];
    setTimeout(() => applyFilterAnimation(), 10); // Léger délai pour s'assurer que le DOM est mis à jour
  }

  // Chargement des éléments au montage du composant
  onMount(async () => {
    await loadElements();
    
    // Animation du tableau à l'apparition
    gsap.from(tableRef, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power2.out"
    });
    
    // Déclencher la pulsation après un délai
    setTimeout(animatePulse, 1500);
  });
  
  // S'assurer que l'animation est appliquée après chaque mise à jour
  afterUpdate(() => {
    applyFilterAnimation();
  });
  
  // Gestionnaire d'événements pour la sélection d'un élément
  const handleElementClick = (number: number) => {
    selectElement(number);
  };
  
  // Vérifie si un élément est présent dans les éléments filtrés
  // Lorsqu'il n'y a pas de filtre actif ou "tous les éléments" est sélectionné, tous les éléments sont considérés comme filtrés
  const isElementFiltered = (number: number) => {
    if ($activeFilters.length === 0 || $activeFilters.includes('all')) {
      return true;
    }
    return $filteredElements.some(e => e.number === number);
  };
</script>

<div class="periodic-table-container" bind:this={tableRef}>
  <div class="periodic-table w-full p-4">
    <h2 class="text-lg text-center text-gray-600 dark:text-gray-400 mb-4">{$t('table.interactive_title')}</h2>
    
    <div class="grid-container">
      {#each tableLayout as row, rowIndex}
        <div class="table-row">
          {#each row as atomicNumber, colIndex}
            <div class="element-cell">
              {#if atomicNumber > 0}
                {#each $filteredElements.filter(e => e.number === atomicNumber) as element (element.number)}
                  <div class={isElementFiltered(element.number) ? 'filtered-element' : ''}>
                    <ElementCard 
                      element={element} 
                      onClick={handleElementClick}
                    />
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
    
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {$t('table.click_element')}
      </p>
    </div>
  </div>
</div>

<style>
  .periodic-table-container {
    width: 100%;
  }
  
  .periodic-table {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    border-radius: 0.5rem;
  }
  
  .grid-container {
    display: grid;
    grid-template-columns: repeat(18, 1fr);
    grid-gap: 2px;
    width: 100%;
  }
  
  .table-row {
    display: contents;
  }
  
  .element-cell {
    aspect-ratio: 1;
    min-width: 0;
  }
  
  .filtered-element {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: repeat(18, minmax(0, 1fr));
      grid-gap: 1px;
    }
  }
</style> 