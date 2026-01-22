<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from './i18n';
  import { loadElements, addFilter } from './stores/elementsStore';
  
  // Composants
  import LanguageSwitcher from './components/LanguageSwitcher.svelte';
  import FilterPanel from './features/filter-panel.svelte';
  import PeriodicTable from './features/periodic-table.svelte';
  import ElementModal from './features/element-modal.svelte';
  import SearchBar from './features/search-bar.svelte';
  import CategoryLegend from './features/category-legend.svelte';
  
  // Chargement des données au démarrage
  onMount(async () => {
    await loadElements();
    addFilter('all');
  });
</script>

<main class="min-h-screen text-white">
  <div class="container mx-auto px-4 py-8 max-w-[1600px]">
    <header class="mb-8">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div class="animate-float">
          <div class="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-3">
            <span class="mr-2">⚛️</span>
            <span>Interactive Chemistry</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
            {$t('app.title')}
          </h1>
          <p class="text-lg text-white/50 mt-2">{$t('app.subtitle')}</p>
        </div>
        
        <div class="flex items-center gap-4">
          <SearchBar />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
    
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <FilterPanel className="glass-panel p-4" />
      <CategoryLegend className="glass-panel p-4" />
    </div>
    
    <div class="glass-panel p-4 md:p-6">
      <PeriodicTable />
    </div>
    
    <footer class="mt-8 text-center text-sm text-white/30">
      <p>© 2024 - Tableau Périodique Interactif</p>
    </footer>
  </div>
  
  <ElementModal />
</main>

