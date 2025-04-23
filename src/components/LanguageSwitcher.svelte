<script lang="ts">
  import { currentLang, setLang, type Lang } from '../stores/langStore';

  // Props
  export let className: string = '';
</script>

<div class={`language-switcher flex gap-2 items-center ${className}`}>
  <button
    class="px-2 py-1 rounded-md text-sm font-medium transition-colors"
    class:bg-blue-100={$currentLang === 'fr'}
    class:text-blue-800={$currentLang === 'fr'}
    class:bg-gray-100={$currentLang !== 'fr'}
    class:text-gray-800={$currentLang !== 'fr'}
    on:click={() => setLang('fr')}
    aria-label="Changer la langue en français"
  >
    FR
  </button>
  <button
    class="px-2 py-1 rounded-md text-sm font-medium transition-colors"
    class:bg-blue-100={$currentLang === 'en'}
    class:text-blue-800={$currentLang === 'en'}
    class:bg-gray-100={$currentLang !== 'en'}
    class:text-gray-800={$currentLang !== 'en'}
    on:click={() => setLang('en')}
    aria-label="Change language to English"
  >
    EN
  </button>
</div> 