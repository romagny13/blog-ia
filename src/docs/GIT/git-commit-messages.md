---
category: GIT
title: Git Commit Messages
date: 2024-11-26
author: Romagny13
---

# Git Commit Messages

Voici quelques bonnes pratiques pour rédiger des messages de commit dans un environnement de développement en équipe, en particulier pour les ajouts et modifications de code :

### 1. **Commencer par un verbe à l'infinitif (action claire)**

- Ex : `Add`, `Fix`, `Update`, `Refactor`, `Remove`, `Improve`, etc.
- Cela donne une idée claire de ce qui a été fait.

### 2. **Être concis mais précis**

- Le message doit être court (idéalement 50-72 caractères pour la première ligne) mais suffisamment descriptif.
- Ex : `Fix user authentication bug` plutôt que `Fix bug`.

### 3. **Utiliser des messages impératifs pour une action claire**

- Ex : `Add user login validation` au lieu de `Added user login validation`.
- Cela se rapproche du style de Git lui-même, ce qui donne plus de cohérence.

### 4. **Diviser les commits par sujet ou fonctionnalité**

- Chaque commit doit se concentrer sur un seul sujet ou une seule fonctionnalité.
- Ex : Si vous avez à la fois un ajout de fonctionnalité et une correction de bug, faites deux commits distincts.

### 5. **Utiliser des références (si applicable)**

- Faites référence aux tickets, issues ou PRs en utilisant des identifiants de bug ou de tâche si nécessaire.
- Ex : `Fix login issue #123` ou `Closes #45`.

### 6. **Utiliser une structure plus détaillée si nécessaire**

- Si le changement est complexe, vous pouvez ajouter un corps de message qui explique pourquoi le changement a été effectué, quel problème il résout, ou toute information utile pour le révisionnaire.
- Ex :

  ```
  Add user authentication

  This commit introduces a login form that verifies the user's credentials
  before granting access. It also handles error messages for invalid inputs.
  ```

### 7. **Utiliser des conventions propres à l'équipe ou au projet**

- Certaines équipes ou projets ont des règles supplémentaires pour la rédaction des messages de commit. Par exemple, utiliser des tags comme `feat:`, `fix:`, `docs:`, `refactor:`.
- Ex : `feat(auth): add JWT authentication` ou `docs(readme): update installation instructions`.

### 8. **Eviter les commits trop larges ou trop vagues**

- Les commits doivent être suffisamment petits pour qu'ils puissent être révisés facilement et éviter d'introduire plusieurs changements dans un seul commit.
- Ex : `Refactor auth module` peut être trop vague si la modification concerne plusieurs fichiers sans lien direct.

### 9. **Eviter les commits "WIP" (Work In Progress)**

- Si vous travaillez en équipe, il est important de communiquer l’état du travail, mais des commits "WIP" ne devraient pas être fusionnés dans des branches principales sans révision.

### Exemple de messages de commit :

- `Add search functionality to the homepage`
- `Fix issue where form inputs were not being validated`
- `Refactor user service to improve performance`
- `Update README to reflect new build steps`
- `Remove deprecated method in user controller`

Cela permet non seulement de garder une traçabilité claire et ordonnée des modifications, mais aussi de faciliter les révisions de code.
