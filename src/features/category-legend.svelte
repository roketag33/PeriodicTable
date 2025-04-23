<script lang="ts">
  import { t } from '../i18n';
  
  // Props
  export let className: string = '';
  
  // Catégories d'éléments avec leur couleur associée
  const categories = [
    { id: 'alkali-metal', translationKey: 'categories.alkali_metal', bgClass: 'bg-alkali-metal' },
    { id: 'alkaline-earth', translationKey: 'categories.alkaline_earth', bgClass: 'bg-alkaline-earth' },
    { id: 'transition-metal', translationKey: 'categories.transition_metal', bgClass: 'bg-transition-metal' },
    { id: 'metal', translationKey: 'categories.metal', bgClass: 'bg-metal' },
    { id: 'metalloid', translationKey: 'categories.metalloid', bgClass: 'bg-metalloid' },
    { id: 'nonmetal', translationKey: 'categories.nonmetal', bgClass: 'bg-nonmetal' },
    { id: 'halogen', translationKey: 'categories.halogen', bgClass: 'bg-halogen' },
    { id: 'noble-gas', translationKey: 'categories.noble_gas', bgClass: 'bg-noble-gas' },
    { id: 'lanthanide', translationKey: 'categories.lanthanide', bgClass: 'bg-lanthanide' },
    { id: 'actinide', translationKey: 'categories.actinide', bgClass: 'bg-actinide' }
  ];
  
  // États de la matière avec leur représentation visuelle
  const states = [
    { id: 'solid', translationKey: 'states.solid', cssClass: '' },
    { id: 'liquid', translationKey: 'states.liquid', cssClass: 'ring-2 ring-blue-500' },
    { id: 'gas', translationKey: 'states.gas', cssClass: 'opacity-75' }
  ];
</script>

<div class={`category-legend ${className}`}>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-2">
    {#each categories as category}
      <div class="flex items-center gap-2">
        <div class={`w-5 h-5 rounded-sm flex-shrink-0 shadow-sm ${category.bgClass}`}></div>
        <span class="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{$t(category.translationKey)}</span>
      </div>
    {/each}
  </div>
  
  <div class="mt-5 pt-4">
    <h3 class="text-base font-medium mb-3">{$t('element.state')}</h3>
    <div class="flex flex-wrap gap-x-8 gap-y-3">
      {#each states as state}
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded-sm flex-shrink-0 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 {state.cssClass}"></div>
          <span class="text-sm font-medium">{$t(state.translationKey)}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .category-legend {
    @apply rounded-lg overflow-hidden p-3;
  }
</style> 