import { readable, writable, derived } from 'svelte/store';
import type { ElementData, ElementFilter } from '../types/element';
import { currentLang } from './langStore';

// Store pour tous les éléments (chargés depuis data/periodicTable.json)
export const allElements = writable<ElementData[]>([]);

// Store pour l'élément actuellement sélectionné
export const selectedElement = writable<ElementData | null>(null);

// Store pour les filtres actifs
export const activeFilters = writable<string[]>([]);

// Liste des filtres disponibles
export const availableFilters = readable<ElementFilter[]>([
  {
    id: 'all',
    label_fr: 'Tous les éléments',
    label_en: 'All elements',
    filter: () => true
  },
  {
    id: 'metals',
    label_fr: 'Métaux',
    label_en: 'Metals',
    filter: (element) => element.category && element.category.includes('metal') && !element.category.includes('metalloid')
  },
  {
    id: 'nonmetals',
    label_fr: 'Non-métaux',
    label_en: 'Non-metals',
    filter: (element) => element.category === 'nonmetal' || element.category === 'diatomic nonmetal'
  },
  {
    id: 'metalloids',
    label_fr: 'Métalloïdes',
    label_en: 'Metalloids',
    filter: (element) => element.category === 'metalloid'
  },
  {
    id: 'alkali-metals',
    label_fr: 'Métaux alcalins',
    label_en: 'Alkali metals',
    filter: (element) => element.category === 'alkali metal'
  },
  {
    id: 'alkaline-earth',
    label_fr: 'Métaux alcalino-terreux',
    label_en: 'Alkaline earth metals',
    filter: (element) => element.category === 'alkaline earth metal'
  },
  {
    id: 'transition-metals',
    label_fr: 'Métaux de transition',
    label_en: 'Transition metals',
    filter: (element) => element.category === 'transition metal'
  },
  {
    id: 'lanthanides',
    label_fr: 'Lanthanides',
    label_en: 'Lanthanides',
    filter: (element) => element.category === 'lanthanide'
  },
  {
    id: 'actinides',
    label_fr: 'Actinides',
    label_en: 'Actinides',
    filter: (element) => element.category === 'actinide'
  },
  {
    id: 'halogens',
    label_fr: 'Halogènes',
    label_en: 'Halogens',
    filter: (element) => element.category === 'halogen'
  },
  {
    id: 'noble-gases',
    label_fr: 'Gaz nobles',
    label_en: 'Noble gases',
    filter: (element) => element.category === 'noble gas'
  },
  {
    id: 'solids',
    label_fr: 'Solides',
    label_en: 'Solids',
    filter: (element) => element.state_at_stp === 'solid' || element.phase === 'Solid'
  },
  {
    id: 'liquids',
    label_fr: 'Liquides',
    label_en: 'Liquids',
    filter: (element) => element.state_at_stp === 'liquid' || element.phase === 'Liquid'
  },
  {
    id: 'gases',
    label_fr: 'Gaz',
    label_en: 'Gases',
    filter: (element) => element.state_at_stp === 'gas' || element.phase === 'Gas'
  }
]);

// Store dérivé pour les filtres localisés
export const localizedFilters = derived(
  [availableFilters, currentLang],
  ([$availableFilters, $currentLang]) => {
    return $availableFilters.map(filter => ({
      ...filter,
      label: $currentLang === 'fr' ? filter.label_fr : filter.label_en
    }));
  }
);

// Store dérivé pour les éléments filtrés
export const filteredElements = derived(
  [allElements, activeFilters, availableFilters],
  ([$allElements, $activeFilters, $availableFilters]) => {
    // Si aucun filtre actif ou si 'all' est sélectionné, retourner tous les éléments
    if ($activeFilters.length === 0 || $activeFilters.includes('all')) {
      return $allElements;
    }

    // Trouver les filtres correspondants
    const filters = $availableFilters.filter(f => $activeFilters.includes(f.id));
    
    // Appliquer chaque filtre (OR entre les filtres)
    return $allElements.filter(element => 
      filters.some(filter => filter.filter(element))
    );
  }
);

// Fonctions pour manipuler le store
export const loadElements = async (): Promise<void> => {
  try {
    const response = await fetch('/data/periodicTable.json');
    if (!response.ok) {
      // Essayer une autre URL si la première échoue
      const fallbackResponse = await fetch('./data/periodicTable.json');
      if (!fallbackResponse.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await fallbackResponse.json();
      processData(data);
    } else {
      const data = await response.json();
      processData(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des éléments :', error);
    allElements.set([]);
  }
};

// Fonction pour traiter les données et les adapter au format attendu
const processData = (data) => {
  // Adapter les données pour correspondre à notre structure ElementData
  const adaptedElements = data.elements.map(element => {
    return {
      number: element.number,
      symbol: element.symbol,
      name_fr: element.name_fr || element.name,
      name_en: element.name,
      category: element.category,
      atomic_mass: element.atomic_mass,
      description_fr: element.description_fr || element.summary,
      description_en: element.description_en || element.summary,
      discovery_year: element.discovery_year,
      discoverer: element.discovered_by,
      electron_configuration: element.electron_configuration,
      electronegativity: element.electronegativity_pauling,
      state_at_stp: element.state_at_stp || element.phase.toLowerCase(),
      melting_point: element.melt,
      boiling_point: element.boil,
      density: element.density,
      uses_fr: element.uses_fr || [],
      uses_en: element.uses_en || [],
      fun_fact_fr: element.fun_fact_fr || null,
      fun_fact_en: element.fun_fact_en || null,
      technical_details_fr: element.technical_details_fr || null,
      technical_details_en: element.technical_details_en || null,
      image: element.image ? element.image.url : null,
      group: element.group,
      period: element.period,
      block: element.block
    };
  });
  
  allElements.set(adaptedElements);
};

export const selectElement = (elementNumber: number): void => {
  allElements.subscribe(elements => {
    const element = elements.find(e => e.number === elementNumber) || null;
    selectedElement.set(element);
  })();
};

export const clearSelectedElement = (): void => {
  selectedElement.set(null);
};

export const addFilter = (filterId: string): void => {
  activeFilters.update(filters => {
    // Si 'all' est sélectionné, on efface les autres filtres
    if (filterId === 'all') {
      return ['all'];
    }
    
    // Si on ajoute un autre filtre, on retire 'all'
    const newFilters = filters.filter(f => f !== 'all');
    
    // Si le filtre n'est pas déjà présent, on l'ajoute
    if (!newFilters.includes(filterId)) {
      newFilters.push(filterId);
    }
    
    return newFilters;
  });
};

export const removeFilter = (filterId: string): void => {
  activeFilters.update(filters => filters.filter(f => f !== filterId));
};

export const toggleFilter = (filterId: string): void => {
  activeFilters.update(filters => {
    if (filters.includes(filterId)) {
      return filters.filter(f => f !== filterId);
    } else {
      // Si on ajoute 'all', on efface les autres
      if (filterId === 'all') {
        return ['all'];
      }
      
      // Sinon, on retire 'all' et on ajoute le filtre
      const newFilters = filters.filter(f => f !== 'all');
      newFilters.push(filterId);
      return newFilters;
    }
  });
}; 