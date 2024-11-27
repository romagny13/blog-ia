---
category: GIT
title: Guide Complet de Git
date: 2024-11-26
author: Romagny13
---

# Guide Complet de Git

## 1. Introduction à Git

Git est un système de contrôle de version distribué conçu pour suivre et gérer les modifications apportées aux fichiers, en particulier dans le développement logiciel. Il permet à plusieurs développeurs de collaborer sur un même projet, de tester des fonctionnalités sans risque pour le code principal, et de maintenir un historique complet des changements.

### Avantages principaux

- **Suivi des modifications :** Historique détaillé des évolutions du projet.
- **Collaboration :** Permet à plusieurs développeurs de travailler simultanément.
- **Récupération :** Facilité de revenir à une version antérieure.
- **Branches :** Expérimentation de nouvelles fonctionnalités sans impact sur le code principal.

## 2. Installation et Configuration Initiale

### Installation

```bash
# macOS (avec Homebrew)
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get install git

# Windows
Téléchargez le fichier d'installation depuis [git-scm.com](https://git-scm.com)
```

### Configuration Initiale

```bash
# Configurer votre identité
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@exemple.com"

# Voir ou modifier la configuration
git config --list
git config --global --edit
```

_Astuce : Utilisez des informations cohérentes avec votre compte GitHub ou GitLab pour synchroniser efficacement votre travail._

## 3. Création et Initialisation de Dépôts

### Créer un dépôt Git local

```bash
# Initialiser un dépôt dans le dossier actuel
git init
```

### Cloner un dépôt distant

```bash
# Cloner un dépôt
git clone https://github.com/utilisateur/depot.git

# Cloner une branche spécifique
git clone -b nom-de-branche https://github.com/utilisateur/depot.git
```

## 4. Opérations de Base

### Ajouter et Commiter des Fichiers

```bash
# Ajouter un fichier spécifique
git add fichier.txt

# Ajouter tous les fichiers modifiés
git add .

# Voir l'état actuel
git status

# Enregistrer les modifications
git commit -m "Message descriptif"
```

### Modifier un Commit

```bash
# Amender le dernier commit
git commit --amend
```

Voici une version améliorée et simplifiée de la section **Gestion des Branches**, organisée pour être plus claire et accessible :

---

## 5. Gestion des Branches

### Concept des Branches

Une **branche** est une version parallèle du code, permettant de travailler sur des fonctionnalités, des correctifs ou des expérimentations sans affecter le projet principal.

- La branche principale (`main` ou `master`) est utilisée pour conserver une version stable du projet.
- Les branches secondaires (souvent nommées `feature/nom-fonctionnalite` ou `fix/nom-correctif`) sont utilisées pour isoler les développements.
- Une fois le travail terminé, les branches secondaires sont fusionnées dans la branche principale.

### Commandes Essentielles

#### Créer une nouvelle branche

Pour commencer une nouvelle fonctionnalité ou un correctif :

```bash
git branch nom-branche
```

- Cela crée une branche, mais vous restez sur la branche actuelle.

#### Basculer sur une branche

Pour passer d'une branche à une autre :

```bash
git checkout nom-branche
```

- Vous changez votre contexte de travail vers la branche spécifiée.

#### Créer et basculer directement sur une nouvelle branche

Pour combiner les deux actions précédentes :

```bash
git checkout -b nouvelle-fonctionnalite
```

- Une nouvelle branche est créée, et vous y basculez automatiquement.

#### Fusionner une branche

Pour intégrer les modifications d'une branche secondaire dans la branche principale (par exemple, `main`) :

```bash
git checkout main
git merge nouvelle-fonctionnalite
```

- **Astuce :** Résolvez les éventuels conflits avant de finaliser avec `git commit`.

#### Supprimer une branche

Après avoir fusionné une branche secondaire, vous pouvez la supprimer pour garder le dépôt propre :

```bash
git branch -d ancienne-branche
```

- Utilisez `git branch -D ancienne-branche` pour une suppression forcée si la branche n’a pas été fusionnée.

### Bonnes Pratiques pour les Branches

1. **Travaillez toujours sur des branches secondaires :** Ne développez jamais directement sur la branche principale.
2. **Nommez vos branches clairement :** Adoptez un format standard comme :
   - `feature/nouvelle-fonctionnalite`
   - `fix/correctif-important`
3. **Synchronisez régulièrement avec la branche principale :**
   ```bash
   git checkout main
   git pull origin main
   git merge main
   ```
   Cela évite les conflits majeurs lors des fusions.
4. **Supprimez les branches inutiles :** Une fois fusionnées, supprimez les branches secondaires pour garder un historique clair.

---

### Résumé Visuel des Commandes (Étapes Typiques)

1. **Créer et basculer sur une branche secondaire :**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```
2. **Développer et committer vos modifications :**
   ```bash
   git add fichier.txt
   git commit -m "Ajout de la fonctionnalité"
   ```
3. **Revenir sur la branche principale et intégrer vos modifications :**
   ```bash
   git checkout main
   git merge feature/nouvelle-fonctionnalite
   ```
4. **Supprimer la branche après fusion :**
   ```bash
   git branch -d feature/nouvelle-fonctionnalite
   ```

Cette organisation rend le processus de gestion des branches plus fluide et compréhensible.

## 6. Authentification et Gestion des Clés SSH

### Générer et Configurer une Clé SSH

1. **Créer une clé SSH :**

   ```bash
   ssh-keygen -t rsa -b 4096 -C "votre.email@exemple.com"
   ```

   Une clé privée (`id_rsa`) et une clé publique (`id_rsa.pub`) sont créées dans `~/.ssh/`.

2. **Ajouter la clé à l'agent SSH :**

   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa
   ```

3. **Configurer la clé sur GitHub :**
   - Copier la clé publique :
     ```bash
     cat ~/.ssh/id_rsa.pub
     ```
   - Se connecter à GitHub > Paramètres > SSH and GPG keys > Add new key.

### Vérifier la Configuration SSH

```bash
ssh -T git@github.com
# Résultat attendu : "Hi username! You've successfully authenticated..."
```

### Astuce : Gérer Plusieurs Clés SSH

Si vous utilisez plusieurs comptes (personnel et professionnel), configurez un fichier `~/.ssh/config` :

```txt
Host github-perso
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_perso

Host github-travail
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_travail
```

Ensuite, utilisez les hôtes correspondants pour cloner ou synchroniser vos dépôts.

Voici une version améliorée et mieux expliquée de la section **7. Gestion Avancée**, avec des explications plus claires sur la signification de `HEAD^` et sur les cas d'utilisation.

---

## 7. Gestion Avancée

### Annuler des Modifications

1. **Annuler les modifications locales (avant le commit) :**
   Si vous avez modifié un fichier mais que vous souhaitez revenir à la dernière version enregistrée dans Git (HEAD), utilisez :

   ```bash
   git checkout -- fichier.txt
   ```

   Cela rétablit l'état du fichier à sa dernière version commitée.

2. **Annuler un commit (localement, sans perdre les modifications) :**
   Si vous voulez annuler le dernier commit mais conserver vos fichiers dans l'état où ils étaient après le commit, utilisez :

   ```bash
   git reset --soft HEAD^
   ```

   - `HEAD` représente le dernier commit dans l'historique.
   - `HEAD^` fait référence au commit précédent (un seul niveau en arrière).
   - `--soft` annule uniquement le commit et garde les modifications dans la zone de staging (`git add`).

   **Exemple :**

   - Vous avez commité un fichier avec un message incorrect.
   - Avec `git reset --soft HEAD^`, vous pouvez corriger votre message en refaisant un commit :
     ```bash
     git commit -m "Message corrigé"
     ```

3. **Annuler et supprimer les commits (irréversiblement) :**
   Si vous voulez complètement annuler le dernier commit et supprimer les modifications associées (perte de données), utilisez :

   ```bash
   git reset --hard HEAD^
   ```

   - Cette commande **supprime** tout ce qui a été ajouté ou modifié dans le commit annulé.
   - **Attention :** Utilisez cette commande avec précaution, car elle est irréversible.

   **Exemple :**

   - Vous avez commité un fichier sensible par erreur.
   - Avec `git reset --hard HEAD^`, vous supprimez le commit et restaurez l'état exact du dépôt au commit précédent.

4. **Annuler plusieurs commits :**
   Pour revenir plusieurs commits en arrière, utilisez :
   ```bash
   git reset --hard HEAD~n
   ```
   - `n` correspond au nombre de commits à annuler (par exemple, `HEAD~3` pour 3 commits).

---

### Gestion des Conflits

1. **Conflit lors d'une fusion (merge) :**
   Les conflits surviennent lorsque Git ne peut pas automatiquement fusionner des modifications dans deux branches. Les fichiers en conflit contiennent des sections marquées ainsi :

   ```txt
   <<<<<<< HEAD
   Vos modifications locales
   =======
   Modifications de la branche fusionnée
   >>>>>>> nom-de-branche
   ```

2. **Étapes pour résoudre un conflit :**

   - **Éditez manuellement les fichiers concernés** pour décider quelles modifications conserver.
   - Une fois les conflits résolus, ajoutez les fichiers modifiés à la zone de staging :
     ```bash
     git add fichier_resolu
     ```
   - Validez les résolutions :
     ```bash
     git commit
     ```

3. **Vérifier les conflits restants :**
   Utilisez `git status` pour voir si d'autres fichiers nécessitent une résolution.

4. **Astuce : Utiliser un outil de fusion graphique :**
   Certains outils comme `git mergetool`, VS Code, ou Sourcetree rendent la résolution des conflits plus intuitive.

---

Avec ces explications, la signification de `HEAD^` et les étapes de gestion des conflits devraient être plus compréhensibles et utiles.

## 8. Meilleures Pratiques

### Principes Essentiels

- Commits atomiques et descriptifs
- Utiliser des branches pour chaque fonctionnalité
- Garder la branche `main` stable
- Faire des pull requests pour la revue de code
- Utiliser `.gitignore` pour exclure les fichiers inutiles

### Fichier .gitignore Exemple

```
# Fichiers système
.DS_Store
Thumbs.db

# Environnements
venv/
*.env

# Fichiers de compilation
*.pyc
__pycache__/

# IDE
.vscode/
.idea/
```

## 9. Outils Git Recommandés

### Clients Graphiques

- GitHub Desktop
- GitKraken
- SourceTree
- Tower

### Extensions VS Code

- GitLens
- Git History
- GitHub Pull Requests

## 10. Workflows Populaires

### Git Flow

- Branche `main`
- Branche `develop`
- Branches de fonctionnalités
- Branches de release
- Branches de hotfix

### GitHub Flow

- Branche `main`
- Branches de fonctionnalités
- Pull Requests
- Déploiement continu

## 11. Ressources Complémentaires

### Documentation Officielle

- [Git Documentation Officielle](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
