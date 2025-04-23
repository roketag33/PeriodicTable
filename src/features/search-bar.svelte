<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import gsap from 'gsap';
  import { allElements, selectElement } from '../stores/elementsStore';
  import { currentLang } from '../stores/langStore';
  import { t } from '../i18n';
  import type { ElementData } from '../types/element';
  
  // Gestion de l'état du composant
  let searchTerm = '';
  let searchResults: typeof $allElements = [];
  let isSearching = false;
  let isResultOpen = false;
  let searchInputRef: HTMLInputElement;
  let resultsRef: HTMLDivElement;
  
  // Animation du focus sur la recherche
  const handleFocus = () => {
    isSearching = true;
    if (searchInputRef) {
      gsap.to(searchInputRef, {
        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleBlur = () => {
    // Petit délai pour permettre le clic sur les résultats avant de les masquer
    setTimeout(() => {
      isSearching = false;
      isResultOpen = false;
      
      if (searchInputRef) {
        gsap.to(searchInputRef, {
          boxShadow: '0 0 0 0px rgba(66, 153, 225, 0)',
          scale: 1,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }, 200);
  };
  
  // Recherche d'éléments en fonction du terme saisi
  $: {
    if (searchTerm.trim().length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      // Recherche par symbole, numéro ou nom
      searchResults = $allElements.filter(element => {
        const nameFr = element.name_fr.toLowerCase();
        const nameEn = element.name_en.toLowerCase();
        const symbol = element.symbol.toLowerCase();
        const numberStr = element.number.toString();
        
        return nameFr.includes(lowerSearchTerm) || 
               nameEn.includes(lowerSearchTerm) || 
               symbol === lowerSearchTerm || 
               numberStr === lowerSearchTerm;
      }).slice(0, 5); // Limiter à 5 résultats pour éviter l'encombrement
      
      isResultOpen = searchResults.length > 0;
    } else {
      searchResults = [];
      isResultOpen = false;
    }
  }
  
  // Sélection d'un élément dans les résultats
  const handleSelectResult = (number: number) => {
    selectElement(number);
    searchTerm = '';
    isResultOpen = false;
  };
  
  // Gestion de l'interaction clavier avec les résultats
  const handleResultKeydown = (event: KeyboardEvent, number: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectResult(number);
    }
  };
  
  // Gestion du raccourci clavier "/" pour focus sur la recherche
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === '/' && document.activeElement !== searchInputRef) {
      event.preventDefault();
      searchInputRef.focus();
    }
  };
  
  // Animation de pulse sur le placeholder
  onMount(() => {
    // Ajouter l'écouteur d'événement pour le raccourci clavier
    document.addEventListener('keydown', handleKeydown);
    
    // Animer le placeholder après un délai
    setTimeout(() => {
      if (searchInputRef) {
        const placeholder = searchInputRef.getAttribute('placeholder') || '';
        searchInputRef.setAttribute('placeholder', '');
        
        // Animation lettre par lettre du placeholder
        let i = 0;
        const interval = setInterval(() => {
          if (i <= placeholder.length) {
            searchInputRef.setAttribute('placeholder', placeholder.slice(0, i));
            i++;
          } else {
            clearInterval(interval);
          }
        }, 100);
      }
    }, 1000);
    
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="relative w-full lg:w-64">
  <div class="relative">
    <input
      bind:this={searchInputRef}
      type="text"
      bind:value={searchTerm}
      on:focus={handleFocus}
      on:blur={handleBlur}
      placeholder={$t('search.placeholder')}
      class="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 
             text-gray-900 dark:text-gray-100 
             border border-gray-300 dark:border-gray-600 
             transition-all duration-200 
             focus:outline-none focus:border-blue-500 focus:ring-blue-500"
      aria-label={$t('search.placeholder')}
    />
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    
    {#if isSearching}
      <div class="absolute right-3 top-2.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
        /{$t('search.shortcut')}
      </div>
    {/if}
  </div>
  
  {#if isResultOpen}
    <div 
      bind:this={resultsRef}
      class="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20"
      transition:fly={{ y: -10, duration: 200 }}
      role="listbox"
      aria-label={$t('search.results')}
    >
      <ul class="py-1">
        {#each searchResults as result (result.number)}
          <li role="option" aria-selected="false">
            <button 
              class="w-full px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors duration-200"
              on:click={() => handleSelectResult(result.number)}
              on:keydown={(e) => handleResultKeydown(e, result.number)}
              in:fade={{ duration: 150, delay: result.number % 5 * 50 }}
            >
              <div 
                class="element-icon w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                class:bg-alkali-metal={result.category === 'alkali-metal'}
                class:bg-alkaline-earth={result.category === 'alkaline-earth'}
                class:bg-transition-metal={result.category === 'transition-metal'}
                class:bg-metal={result.category === 'metal'}
                class:bg-metalloid={result.category === 'metalloid'}
                class:bg-nonmetal={result.category === 'nonmetal'}
                class:bg-halogen={result.category === 'halogen'}
                class:bg-noble-gas={result.category === 'noble-gas'}
                class:bg-lanthanide={result.category === 'lanthanide'}
                class:bg-actinide={result.category === 'actinide'}
                aria-hidden="true"
              >
                {result.symbol}
              </div>
              <div>
                <div class="font-medium">{$currentLang === 'fr' ? result.name_fr : result.name_en}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{$t('element.atomic_number')}: {result.number}</div>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div> 