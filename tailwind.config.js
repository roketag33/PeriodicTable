/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Couleurs pour les différentes catégories d'éléments
        'metal': '#8F8F8F',
        'nonmetal': '#33CC33',
        'metalloid': '#FF9900',
        'noble-gas': '#66CCFF',
        'alkali-metal': '#FF6666',
        'alkaline-earth': '#FFCC66',
        'transition-metal': '#CCCCCC',
        'lanthanide': '#FF99CC',
        'actinide': '#FF99FF',
        'halogen': '#99CC00',
      },
    },
  },
  plugins: [],
} 