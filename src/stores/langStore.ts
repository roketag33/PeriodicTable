import { writable } from 'svelte/store';

// Type pour les langues supportées
export type Lang = 'fr' | 'en';

// Récupérer la langue du navigateur ou utiliser le français par défaut
const getBrowserLang = (): Lang => {
  if (typeof window === 'undefined') return 'fr';
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'fr';
};

// Créer le store avec la langue par défaut
export const currentLang = writable<Lang>(getBrowserLang());

// Fonction pour changer la langue
export const setLang = (lang: Lang): void => {
  currentLang.set(lang);
  // On pourrait stocker la préférence dans localStorage ici
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredLanguage', lang);
  }
}; 