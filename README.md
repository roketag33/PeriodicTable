# Explorateur du Tableau Périodique

Une application interactive pour explorer les éléments du tableau périodique, construite avec Svelte et TypeScript.

## Fonctionnalités

- 📊 Visualisation complète du tableau périodique
- 🔍 Recherche d'éléments par nom, symbole ou numéro atomique
- 🏷️ Filtrage par catégorie chimique ou état de la matière
- 🌐 Interface bilingue (français/anglais)
- 📱 Design responsive pour tous les appareils
- 🎬 Animations fluides pour une expérience utilisateur améliorée

## Technologies utilisées

- [Svelte](https://svelte.dev/) - Framework frontend
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Tailwind CSS](https://tailwindcss.com/) - Styling utilitaire
- [GSAP](https://greensock.com/gsap/) - Animations avancées
- [Vite](https://vitejs.dev/) - Outil de build

## Structure du projet

```
src/
├── animations/     # Animations GSAP réutilisables
├── components/     # Composants UI atomiques
├── data/           # Données des éléments (JSON)
├── features/       # Regroupements fonctionnels
├── i18n/           # Traductions
├── stores/         # Stores Svelte
├── types/          # Définitions TypeScript
└── utils/          # Utilitaires
```

## Installation

```bash
# Installer les dépendances
yarn

# Lancer le serveur de développement
yarn dev

# Construire pour la production
yarn build
```

## Architecture du code

Cette application suit les principes SOLID et DRY :

- **Single Responsibility**: Chaque module a une responsabilité claire
- **Open/Closed**: Le code est facilement extensible sans modification
- **Liskov Substitution**: Les composants sont interchangeables
- **Interface Segregation**: Les interfaces sont spécifiques à leurs usages
- **Dependency Inversion**: Les modules dépendent d'abstractions

## Ajouter un élément

Pour ajouter un nouvel élément chimique, ajoutez un objet au fichier `src/data/elements.json` en suivant le format existant.

## Ajouter une langue

1. Créez un nouveau fichier dans `src/i18n/` (ex: `de.json`)
2. Copiez la structure d'un fichier existant et traduisez les valeurs
3. Mettez à jour `src/stores/langStore.ts` pour inclure la nouvelle langue

## Licence

MIT
