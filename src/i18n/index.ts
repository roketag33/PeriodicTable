import { derived, writable, get } from 'svelte/store';
import { currentLang } from '../stores/langStore';

// Déclaration des types pour les traductions
interface Translations {
  [key: string]: any;
}

// Type pour faciliter l'autocomplétion et la vérification des clés
type TranslationKey = string;

// Store pour les traductions chargées
const translationsStore = writable<Record<string, Translations>>({});

// Chargement des traductions via fetch
const loadTranslations = async () => {
  try {
    const frResponse = await fetch('/i18n/fr.json');
    const enResponse = await fetch('/i18n/en.json');
    
    if (!frResponse.ok || !enResponse.ok) {
      throw new Error('Erreur lors du chargement des fichiers de traduction');
    }
    
    const fr = await frResponse.json();
    const en = await enResponse.json();
    
    translationsStore.set({ fr, en });
  } catch (error) {
    console.error('Erreur lors du chargement des traductions:', error);
  }
};

// Chargement initial des traductions
loadTranslations();

// Helper pour récupérer une valeur imbriquée à partir d'une clé avec des points
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] ? prev[curr] : '';
  }, obj);
};

// Store dérivé qui réagira aux changements de langue
export const t = derived(
  [currentLang, translationsStore],
  ([$currentLang, $translations]) => 
    (key: TranslationKey): string => {
      const lang = $currentLang === 'fr' ? 'fr' : 'en';
      
      if (!$translations[lang]) {
        console.warn(`Traductions non disponibles pour: ${lang}`);
        return key;
      }
      
      const translation = getNestedValue($translations[lang], key);
      
      if (!translation) {
        console.warn(`Clé de traduction manquante: ${key}`);
        return key;
      }
      
      return translation;
    }
);

// Helper pour obtenir le nom d'un élément dans la langue courante
export const getElementName = derived(
  currentLang,
  ($currentLang) => (element: { name_fr: string; name_en: string }) => {
    return $currentLang === 'fr' ? element.name_fr : element.name_en;
  }
);

// Helper pour obtenir la description d'un élément dans la langue courante
export const getElementDescription = derived(
  currentLang,
  ($currentLang) => (element: { description_fr: string; description_en: string }) => {
    return $currentLang === 'fr' ? element.description_fr : element.description_en;
  }
); 