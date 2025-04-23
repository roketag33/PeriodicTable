<script lang="ts">
  import { activeFilters, localizedFilters, toggleFilter } from '../stores/elementsStore';
  import { t } from '../i18n';
  
  // Props
  export let className: string = '';
</script>

<div class={`filter-panel ${className}`}>
  <h2 class="text-lg font-semibold mb-3">{$t('filters.title')}</h2>
  
  <div class="flex flex-wrap gap-2">
    {#each $localizedFilters as filter (filter.id)}
      <button
        class="px-3 py-1 text-sm rounded-full transition-colors"
        class:bg-blue-500={$activeFilters.includes(filter.id)}
        class:text-white={$activeFilters.includes(filter.id)}
        class:bg-gray-200={!$activeFilters.includes(filter.id)}
        class:text-gray-800={!$activeFilters.includes(filter.id)}
        class:hover:bg-blue-600={$activeFilters.includes(filter.id)}
        class:hover:bg-gray-300={!$activeFilters.includes(filter.id)}
        on:click={() => toggleFilter(filter.id)}
        aria-label={filter.label}
        aria-pressed={$activeFilters.includes(filter.id)}
      >
        {filter.label}
      </button>
    {/each}
  </div>
</div> 