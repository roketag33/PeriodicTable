<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { selectedElement, clearSelectedElement } from '../stores/elementsStore';
  import { currentLang } from '../stores/langStore';
  import { t } from '../i18n';
  import gsap from 'gsap';
  
  // État local pour l'animation
  let modalRef: HTMLDivElement;
  let contentRef: HTMLDivElement;
  let elementSymbolRef: HTMLSpanElement;
  let isExpanded = false;
  let timeline: gsap.core.Timeline;
  
  $: isOpen = $selectedElement !== null;
  
  // Création de la timeline GSAP
  onMount(() => {
    timeline = gsap.timeline({ paused: true });
  });
  
  // Nettoyer la timeline à la destruction
  onDestroy(() => {
    if (timeline) {
      timeline.kill();
    }
  });
  
  // Observer les changements d'état pour déclencher l'animation
  $: if (isOpen && modalRef && contentRef && elementSymbolRef) {
    // Animation d'entrée améliorée
    gsap.set(modalRef, { display: 'flex' });
    
    // Animation de l'arrière-plan
    gsap.fromTo(
      modalRef,
      { backgroundColor: 'rgba(0, 0, 0, 0)' },
      { backgroundColor: 'rgba(0, 0, 0, 0.5)', duration: 0.4, ease: "power2.out" }
    );
    
    // Animation du contenu principal
    gsap.fromTo(
      contentRef,
      { scale: 0.8, y: 50, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
    );
    
    // Animation du symbole de l'élément
    gsap.fromTo(
      elementSymbolRef,
      { scale: 0.5, opacity: 0, rotate: -10 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.7, delay: 0.2, ease: "elastic.out(1, 0.5)" }
    );
  } else if (!isOpen && modalRef) {
    // Animation de sortie
    const tween = gsap.to(modalRef, { 
      backgroundColor: 'rgba(0, 0, 0, 0)', 
      duration: 0.3,
      ease: "power1.in",
      onComplete: () => {
        gsap.set(modalRef, { display: 'none' });
      } 
    });
    
    // Animation de sortie du contenu
    gsap.to(contentRef, { 
      scale: 0.9, 
      y: 30, 
      opacity: 0, 
      duration: 0.3, 
      ease: "power1.in" 
    });
  }
  
  // Toggle des détails techniques avec animation
  const toggleDetails = () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      gsap.fromTo('.technical-details', 
        { height: 0, opacity: 0 }, 
        { height: 'auto', opacity: 1, duration: 0.4, ease: "power1.out" }
      );
    } else {
      gsap.to('.technical-details', 
        { height: 0, opacity: 0, duration: 0.3, ease: "power1.in" }
      );
    }
  };
  
  // Fermeture de la modal
  const closeModal = () => {
    clearSelectedElement();
  };
  
  // Gestion des touches clavier
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      closeModal();
    }
  };
  
  // Gestion des événements clavier dans le contenu
  const handleContentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Gérer la navigation clavier à l'intérieur du modal
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      closeModal();
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  bind:this={modalRef}
  class="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50 p-4"
  on:click={() => closeModal()}
  on:keydown={(e) => e.key === 'Escape' && closeModal()}
  role="dialog"
  aria-modal="true"
  aria-labelledby="element-modal-title"
  tabindex="-1"
>
  {#if $selectedElement}
    <div
      bind:this={contentRef}
      class="modal-content bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation={() => {}}
      on:keydown|stopPropagation={handleContentKeydown}
      role="document"
      tabindex="0"
    >
      <div class="p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 id="element-modal-title" class="text-3xl font-bold flex items-center gap-2">
              <span class="element-number text-base font-normal">{$selectedElement.number}</span>
              {$currentLang === 'fr' ? $selectedElement.name_fr : $selectedElement.name_en}
              <span bind:this={elementSymbolRef} class="text-4xl font-bold ml-2">{$selectedElement.symbol}</span>
            </h2>
            <p class="text-lg opacity-80">
              {$t(`categories.${$selectedElement.category.replace('-', '_')}`)}
            </p>
          </div>
          
          <button
            class="text-white/60 hover:text-white transition-colors duration-200"
            on:click={closeModal}
            aria-label={$t('element.close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="mb-4">
              {$currentLang === 'fr' ? $selectedElement.description_fr : $selectedElement.description_en}
            </p>
            
            <h3 class="font-semibold text-lg mb-2 flex items-center">
              {$t('element.fun_fact')}
              <span class="ml-2 text-xl" aria-hidden="true">😲</span>
            </h3>
            <p class="mb-4 italic bg-white/10 p-3 rounded-lg text-white/90">
              {$currentLang === 'fr' ? $selectedElement.fun_fact_fr : $selectedElement.fun_fact_en}
            </p>
            
            <h3 class="font-semibold text-lg mb-2">{$t('element.uses')}</h3>
            <ul class="list-disc pl-5 mb-4 space-y-1">
              {#each ($currentLang === 'fr' ? $selectedElement.uses_fr : $selectedElement.uses_en) as use}
                <li class="transition-all duration-200 hover:translate-x-1">{use}</li>
              {/each}
            </ul>
          </div>
          
          <div>
            <table class="w-full">
              <tbody>
                <tr>
                  <td class="py-1 font-semibold">{$t('element.atomic_mass')}</td>
                  <td class="py-1">{$selectedElement.atomic_mass} u</td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">{$t('element.state')}</td>
                  <td class="py-1">{$t(`states.${$selectedElement.state_at_stp}`)}</td>
                </tr>
                {#if $selectedElement.discovery_year}
                  <tr>
                    <td class="py-1 font-semibold">{$t('element.discovery_year')}</td>
                    <td class="py-1">{$selectedElement.discovery_year}</td>
                  </tr>
                {/if}
                {#if $selectedElement.discoverer}
                  <tr>
                    <td class="py-1 font-semibold">{$t('element.discovered_by')}</td>
                    <td class="py-1">{$selectedElement.discoverer}</td>
                  </tr>
                {/if}
                {#if $selectedElement.electron_configuration}
                  <tr>
                    <td class="py-1 font-semibold">{$t('element.electron_config')}</td>
                    <td class="py-1">{$selectedElement.electron_configuration}</td>
                  </tr>
                {/if}
                {#if $selectedElement.electronegativity}
                  <tr>
                    <td class="py-1 font-semibold">Électronégativité</td>
                    <td class="py-1">{$selectedElement.electronegativity}</td>
                  </tr>
                {/if}
                {#if $selectedElement.melting_point}
                  <tr>
                    <td class="py-1 font-semibold">{$t('element.melting_point')}</td>
                    <td class="py-1">{$selectedElement.melting_point} K</td>
                  </tr>
                {/if}
                {#if $selectedElement.boiling_point}
                  <tr>
                    <td class="py-1 font-semibold">{$t('element.boiling_point')}</td>
                    <td class="py-1">{$selectedElement.boiling_point} K</td>
                  </tr>
                {/if}
                {#if $selectedElement.density}
                  <tr>
                    <td class="py-1 font-semibold">{$t('element.density')}</td>
                    <td class="py-1">{$selectedElement.density} g/cm³</td>
                  </tr>
                {/if}
              </tbody>
            </table>
            
            {#if $selectedElement.technical_details_fr || $selectedElement.technical_details_en}
              <div class="mt-4">
                <button
                  class="text-purple-400 hover:text-purple-300 flex items-center gap-1 focus:outline-none transition-colors duration-200 font-medium"
                  on:click={toggleDetails}
                  aria-expanded={isExpanded}
                >
                  {$t('element.learn_more')}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-300"
                    class:rotate-180={isExpanded}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div class="technical-details overflow-hidden" style="height: 0; opacity: 0;">
                  <div class="mt-2 p-3 bg-white/10 rounded-lg text-white/90">
                    <p>
                      {$currentLang === 'fr' 
                        ? $selectedElement.technical_details_fr 
                        : $selectedElement.technical_details_en}
                    </p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 