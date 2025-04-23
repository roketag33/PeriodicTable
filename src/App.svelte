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
    // Initialiser avec le filtre "tous les éléments" par défaut
    addFilter('all');
  });
</script>

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <div class="container mx-auto px-4 py-8">
    <header class="mb-6">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-blue-600">{$t('app.title')}</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">{$t('app.subtitle')}</p>
        </div>
        
        <div class="flex items-center gap-4">
          <SearchBar />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
    
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <FilterPanel className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow" />
      <CategoryLegend className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow" />
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <PeriodicTable />
    </div>
    
    <footer class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>© 2023 - Tableau Périodique Interactif</p>
    </footer>
  </div>
  
  <ElementModal />
</main>
