# Projet 6 : Application Node.js avec CI/CD, Docker, Redis & PostgreSQL

Ce projet a été réalisé dans le cadre de la formation DevOps. Il démontre la mise en place d'une application web complète, conteneurisée avec Docker et déployée via un pipeline de CI/CD avec GitHub Actions.

## 🎯 Objectif

L'application est un simple service de gestion d'utilisateurs qui expose une API REST. L'objectif principal est de maîtriser les concepts suivants :
-   **Conteneurisation** : Isoler l'application et ses dépendances (base de données, cache) avec Docker et Docker Compose.
-   **Intégration Continue (CI)** : Automatiser les tests et le build de l'image Docker à chaque modification du code sur la branche `proj6`.
-   **Déploiement Continu (CD)** : Pousser automatiquement l'image Docker vers un registre (Docker Hub).
-   **Utilisation de services tiers** : Intégrer une base de données PostgreSQL pour la persistance des données et un cache Redis pour l'optimisation des performances.

## 🛠️ Technologies utilisées

-   **Backend** : Node.js avec le framework Express.
-   **Base de données** : PostgreSQL pour le stockage des utilisateurs.
-   **Cache** : Redis pour mettre en cache les requêtes de la liste des utilisateurs.
-   **Conteneurisation** : Docker & Docker Compose.
-   **CI/CD** : GitHub Actions.

## 🚀 Lancer le projet en local

1.  Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.
2.  Clonez le dépôt et placez-vous dans le dossier `proj6`.
3.  Exécutez la commande suivante pour construire les images et démarrer les conteneurs :

    ```bash
    docker-compose up --build
    ```

4.  L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## ⚙️ Pipeline CI/CD

Le pipeline est défini dans le fichier `.github/workflows/deploy.yaml`. Il se déclenche à chaque `push` sur la branche `proj6` et effectue les étapes suivantes :

1.  **Récupération du code** : Checkout de la branche.
2.  **Installation de Node.js** : Mise en place de l'environnement Node.js v20.
3.  **Installation des dépendances** : Exécution de `npm install`.
4.  **Build de l'image Docker** : Construction de l'image de l'application avec le tag `proj6`.
5.  **Connexion à Docker Hub** : Authentification en utilisant des secrets stockés dans GitHub.
6.  **Push de l'image** : Tag et push de l'image vers le registre Docker Hub de l'utilisateur.

## 🗄️ Connexion à la base de données

Pour vous connecter à la base de données PostgreSQL depuis un client SQL (comme DBeaver, pgAdmin ou une extension VS Code), utilisez les informations suivantes :

-   **Hôte** : `localhost`
-   **Port** : `5432`
-   **Base de données** : `db_proj6`
-   **Utilisateur** : `postgres`
-   **Mot de passe** : `postgres`
