# JFLIX

JFLIX est mon TP React : un mini service de découverte de films inspiré des plateformes de streaming. Les films, affiches et résumés viennent de l'API officielle [TMDB](https://www.themoviedb.org/).

Site publié : _lien ajouté une fois le déploiement GitHub Pages vérifié._

## Le but

Je voulais une application qui ressemble à une vraie salle de cinéma plutôt qu'à une simple grille : une intro animée autour d'un J, un grand visuel de film en ouverture, des affiches grand format et une page détaillée pour chaque film.

## Fonctionnalités

Obligatoires :

- liste des films populaires récupérés depuis TMDB ;
- recherche de films (validation au clavier ou bouton, avec un petit délai pendant la saisie) ;
- page de détail pour chaque film, sur la route `/movie/:id` ;
- navigation entre l'accueil et les détails, avec un bouton retour qui garde la recherche en cours ;
- affichage du titre, de l'affiche, du résumé, de la date, de la note, de la durée et des genres quand ils existent ;
- interface adaptée à l'ordinateur et au téléphone ;
- états de chargement, d'erreur (réseau, jeton refusé, trop de requêtes), de film introuvable et de recherche sans résultat.

Bonus :

- favoris enregistrés dans `localStorage` (seuls les identifiants sont gardés) et page « Ma liste » ;
- pagination précédent / suivant avec le paramètre `page` de TMDB (limité à 500 pages par l'API) ;
- filtre par genre avec les vrais genres TMDB. Pour la liste populaire, le filtre passe par `with_genres`. L'endpoint de recherche n'accepte pas de genre, donc je filtre les résultats de la page affichée.

L'intro se lance une fois par session, peut être passée (bouton ou touche Échap) et ne s'affiche pas si le système demande de réduire les animations. Elle ne bloque jamais le chargement des films, qui se fait derrière.

## Technologies

- React 19 et JavaScript
- Vite
- React Router (routes `/`, `/movie/:id`, `/favoris`)
- `fetch` pour les appels à l'API
- CSS dans des fichiers séparés, animations en CSS et SVG (aucune bibliothèque d'animation)

## Organisation

```
src/
├── components/   Header, Hero, IntroAnimation, SearchBar, MovieCard, MovieGrid,
│                 GenreFilter, Pagination, FavoriteButton, LoadingState, Footer
├── context/      FavoritesContext (favoris + localStorage)
├── hooks/        useTmdb (chargement, erreur, annulation des requêtes)
├── pages/        HomePage, MovieDetailPage, FavoritesPage, NotFoundPage
├── services/     tmdbApi.js (tous les appels à TMDB)
├── styles/       variables, global, components, intro
├── utils/        movieUtils.js (URL des images, dates, notes, durée)
├── App.jsx       routes
└── main.jsx
docs/maquette.html   maquette statique de la page d'accueil
```

## Configuration du jeton TMDB

1. Créer un compte sur TMDB puis récupérer le « jeton d'accès en lecture » dans les paramètres API.
2. Copier `.env.example` en `.env` à la racine du projet.
3. Coller le jeton après `VITE_TMDB_READ_ACCESS_TOKEN=`.

Le fichier `.env` est ignoré par Git. Sans jeton, l'application affiche un message qui explique quoi faire.

Attention : une variable `VITE_` est intégrée dans le JavaScript au moment du build. Sur un site statique, le jeton reste donc lisible par n'importe qui dans le navigateur. C'est pour ça que j'utilise uniquement un jeton de lecture. Le cacher vraiment demanderait un petit serveur intermédiaire, ce qui dépasse le cadre du TP.

## Installation et lancement

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173/tp-TMDB/`.

Compilation :

```bash
npm run build
npm run preview
```

## Déploiement

Le workflow `.github/workflows/deploy.yml` compile le projet et le publie sur GitHub Pages à chaque push sur `main`. Il faut :

- dans **Settings > Pages**, choisir la source **GitHub Actions** ;
- dans **Settings > Secrets and variables > Actions**, ajouter le secret `VITE_TMDB_READ_ACCESS_TOKEN`.

La base Vite est `/tp-TMDB/`, et le workflow copie `index.html` en `404.html` pour que les liens directs vers un film fonctionnent.

## Ce que ce TP m'a fait travailler

- découper l'interface en composants avec une responsabilité claire ;
- `useState`, `useEffect`, `useRef`, `useCallback`, un hook personnalisé et un contexte ;
- les requêtes API avec `fetch`, la gestion des codes HTTP et l'annulation avec `AbortController` ;
- une recherche avec un champ contrôlé et un délai de saisie ;
- le routage avec React Router et les paramètres d'URL ;
- la gestion des états de chargement, d'erreur et des données manquantes.

## Attribution

Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB. Les données et images des films appartiennent à leurs ayants droit et sont fournies par [The Movie Database](https://www.themoviedb.org/).
