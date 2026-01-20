# Bijoux - App Préférences Salons

Application mobile-first pour collecter les préférences bijoux de vos salons partenaires.

## Fonctionnalités

- 🔐 Accès sécurisé par code (Bijoux2024)
- 📤 Import CSV de la liste des salons
- 🔍 Recherche rapide par nom ou ville
- ✅ Formulaire de préférences (taille, couleurs, ratio, rotation)
- 📊 Stats en temps réel (complétés / en attente)
- 📥 Export Excel complet

## Guide de déploiement pas à pas

### Prérequis

- Un compte GitHub (gratuit) : https://github.com
- Un compte Vercel (gratuit) : https://vercel.com

### Étape 1 : Créer un compte GitHub

1. Va sur https://github.com
2. Clique sur "Sign up"
3. Suis les étapes pour créer ton compte

### Étape 2 : Créer un nouveau repository

1. Une fois connecté sur GitHub, clique sur le "+" en haut à droite
2. Clique sur "New repository"
3. Nom du repository : `bijoux-app`
4. Laisse en "Public"
5. Clique sur "Create repository"

### Étape 3 : Uploader les fichiers

1. Sur la page de ton nouveau repository, clique sur "uploading an existing file"
2. Glisse-dépose TOUS les fichiers et dossiers de ce projet
3. Clique sur "Commit changes"

### Étape 4 : Créer un compte Vercel

1. Va sur https://vercel.com
2. Clique sur "Sign Up"
3. Choisis "Continue with GitHub"
4. Autorise Vercel à accéder à ton GitHub

### Étape 5 : Déployer l'application

1. Sur Vercel, clique sur "Add New..." puis "Project"
2. Tu verras la liste de tes repositories GitHub
3. Trouve `bijoux-app` et clique sur "Import"
4. Vercel détecte automatiquement que c'est un projet Vite
5. Clique sur "Deploy"
6. Attends 1-2 minutes que le déploiement se termine

### Étape 6 : Configurer la base de données (Vercel KV)

1. Une fois déployé, va dans ton projet sur Vercel
2. Clique sur l'onglet "Storage"
3. Clique sur "Create Database"
4. Choisis "KV" (Key-Value)
5. Donne un nom : `bijoux-kv`
6. Clique sur "Create"
7. Vercel va automatiquement connecter la base à ton projet

### Étape 7 : Redéployer

1. Va dans l'onglet "Deployments"
2. Clique sur les "..." à côté du dernier déploiement
3. Clique sur "Redeploy"
4. Confirme

### C'est terminé ! 🎉

Ton application est maintenant accessible à l'URL fournie par Vercel (genre `bijoux-app.vercel.app`).

## Utilisation

1. Ouvre l'URL sur ton téléphone
2. Entre le code d'accès : `Bijoux2024`
3. Importe ton fichier CSV de salons
4. Recherche un salon et remplis ses préférences
5. Exporte les résultats en Excel quand tu veux

## Modifier le code d'accès

Dans le fichier `src/App.jsx`, ligne 6 :
```javascript
const ACCESS_CODE = 'Bijoux2024'
```

Change `Bijoux2024` par le code de ton choix, puis redéploie.

## Support

En cas de problème, vérifie :
- Que Vercel KV est bien créé et connecté
- Que tu as bien redéployé après avoir ajouté KV
