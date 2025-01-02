---
category: CLI
title: DOTNET CLI
date: 2025-01-02
author: Romagny13
---

# Guide Complet sur la CLI .NET

La CLI (Command Line Interface) .NET est un outil puissant permettant de gérer vos projets et applications .NET directement depuis un terminal. Ce guide détaille les commandes essentielles, des astuces et des informations utiles pour travailler efficacement avec la CLI .NET.

---

## Commandes Générales

### Vérification de la Version de .NET

```bash
$ dotnet --version
```

Affiche la version actuelle de .NET installée.

### Aide Générale

```bash
$ dotnet --help
```

Affiche une liste des commandes disponibles et leurs descriptions.

---

## Types de Projets Disponibles

Voici un tableau des types de projets créables de base avec la CLI .NET :

| Type de Projet          | Commande                  | Description                                   |
| ----------------------- | ------------------------- | --------------------------------------------- |
| Console                 | `dotnet new console`      | Application console de base.                  |
| Bibliothèque de classes | `dotnet new classlib`     | Crée une bibliothèque réutilisable.           |
| Web API                 | `dotnet new webapi`       | Crée une API REST avec ASP.NET Core.          |
| MVC                     | `dotnet new mvc`          | Application web avec ASP.NET Core MVC.        |
| Razor Pages             | `dotnet new razor`        | Application web avec des Razor Pages.         |
| Angular                 | `dotnet new angular`      | Application Angular avec ASP.NET Core.        |
| React                   | `dotnet new react`        | Application React avec ASP.NET Core.          |
| Blazor Server           | `dotnet new blazorserver` | Application Blazor côté serveur.              |
| Blazor WebAssembly      | `dotnet new blazorwasm`   | Application Blazor côté client (WebAssembly). |
| Tests Unitaires         | `dotnet new xunit`        | Projet pour les tests unitaires avec xUnit.   |

Pour une liste complète et à jour, consultez la [documentation officielle](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new).

### Obtenir l'Aide pour un Type de Projet

Pour afficher les options spécifiques d'un type de projet, utilisez :

```bash
$ dotnet new <type> --help
```

**Exemple :**

```bash
$ dotnet new webapi --help
```

Cette commande affiche toutes les options disponibles pour créer un projet Web API.

### Ajout de Types de Projets via des Packages

Certains packages peuvent ajouter de nouveaux types de projets. Par exemple :

- **Duende IdentityServer** permet de créer des projets liés à l'authentification et à l'autorisation.
- **NUnit** ou **MSTest** ajoutent des options supplémentaires pour les projets de tests.

Pour découvrir ces extensions, vous pouvez installer les packages concernés et vérifier les nouveaux modèles disponibles via :

```bash
$ dotnet new list
```

---

## Gestion des Projets

### Lister les Types de Projets Disponibles

```bash
$ dotnet new list
```

Affiche tous les modèles de projet disponibles, comme `console`, `classlib`, `web`, etc.

### Créer un Nouveau Projet

```bash
$ dotnet new <type> -n <NomProjet>
```

**Exemple :**

```bash
$ dotnet new console -n HelloWorld
```

Crée une application console nommée _HelloWorld_.

### Ajouter un Fichier ou une Classe au Projet

```bash
$ dotnet new class -n <NomClasse>
```

**Exemple :**

```bash
$ dotnet new class -n Person
```

Ajoute un fichier `Person.cs` dans le projet.

---

## Gestion des Dépendances

### Ajouter un Package NuGet

```bash
$ dotnet add package <NomPackage> --version <Version>
```

**Exemple :**

```bash
$ dotnet add package Newtonsoft.Json --version 13.0.1
```

Ajoute le package Newtonsoft.Json à votre projet.

### Lister les Packages Installés

```bash
$ dotnet list package
```

Affiche tous les packages NuGet installés dans le projet.

---

## Compilation et Exécution

### Compiler le Projet

```bash
$ dotnet build
```

Compile le projet dans le répertoire `bin/`.

### Exécuter le Projet

```bash
$ dotnet run
```

Compile et exécute directement le projet.

### Nettoyer les Fichiers de Compilation

```bash
$ dotnet clean
```

Supprime les fichiers générés par la compilation.

---

## Gestion des Projets ASP.NET Core

### Créer un Projet Web API

```bash
$ dotnet new webapi -n <NomProjet>
```

**Exemple :**

```bash
$ dotnet new webapi -n MyApi
```

Crée un projet Web API nommé _MyApi_.

### Créer un Projet MVC

```bash
$ dotnet new mvc -n <NomProjet>
```

**Exemple :**

```bash
$ dotnet new mvc -n MyMvcApp
```

Crée un projet ASP.NET Core MVC nommé _MyMvcApp_.

### Tester un Projet avec le Serveur de Développement

```bash
$ dotnet watch run
```

Lance le projet en mode surveillance. Les modifications sont automatiquement détectées et appliquées.

---

## Tests

### Créer un Projet de Tests Unitaires

```bash
$ dotnet new xunit -n <NomProjetTests>
```

**Exemple :**

```bash
$ dotnet new xunit -n MyProject.Tests
```

Crée un projet de tests unitaires avec xUnit.

### Exécuter les Tests

```bash
$ dotnet test
```

Lance tous les tests unitaires définis dans le projet.

---

## Raccourcis et Astuces

### Raccourcis Utiles

- **Lister les projets et solutions :**
  ```bash
  $ dotnet sln list
  ```
- **Ajouter un projet à une solution :**
  ```bash
  $ dotnet sln add <CheminProjet>
  ```
- **Supprimer un projet d'une solution :**
  ```bash
  $ dotnet sln remove <CheminProjet>
  ```

### Gestion des Versions du SDK

- **Lister les SDK installés :**
  ```bash
  $ dotnet --list-sdks
  ```
- **Lister les runtimes installés :**
  ```bash
  $ dotnet --list-runtimes
  ```

---

## Ressources Supplémentaires

- [Documentation officielle de .NET](https://docs.microsoft.com/dotnet/)
- [Commandes CLI avancées](https://learn.microsoft.com/en-us/dotnet/core/tools/)

Ce guide fournit un point de départ pour explorer la CLI .NET et l'utiliser efficacement dans vos projets. N'hésitez pas à personnaliser ces commandes selon vos besoins spécifiques !
