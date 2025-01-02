---
category: Package Manager
title: Packages NuGet
date: 2025-01-02
author: Romagny13
---

# Guide Complet sur les Packages NuGet

## Introduction à NuGet

NuGet est le gestionnaire de packages officiel pour la plateforme .NET. Il permet de distribuer des bibliothèques, outils et frameworks pour des applications .NET. Ce guide couvre toutes les étapes de création, gestion et déploiement d'un package NuGet, ainsi que des conseils pratiques et ressources utiles.

---

## Création d'un Package NuGet

### 1. Prérequis

- **SDK .NET** : Assurez-vous que le SDK .NET est installé.
- **Visual Studio** : Une version compatible avec votre projet .NET.
- **NuGet CLI** : L'utilitaire en ligne de commande pour créer et publier des packages.

#### Installation de NuGet CLI

Si vous n’avez pas NuGet CLI, téléchargez-le ici : [NuGet CLI](https://www.nuget.org/downloads).

---

### 2. Créer un Package NuGet avec Visual Studio

1. **Configurer le projet** :

   - Ouvrez votre projet dans Visual Studio.
   - Cliquez avec le bouton droit sur le projet et sélectionnez **Propriétés**.
   - Sous l'onglet **Général**, assurez-vous que toutes les informations sur l'assemblage (nom, version, etc.) sont correctement renseignées.

2. **Configurer le Packaging** :

   - Allez à l'onglet **Package NuGet**.
   - Remplissez les champs obligatoires tels que le titre, la description, les auteurs et l’URL du projet.
   - Activez l’option **Générer un package NuGet à la compilation**.

3. **Compiler le projet** :
   - Lancez une compilation (Release de préférence). Le package sera généré dans le dossier `bin\Release`.

---

### 3. Créer un Package NuGet manuellement

1. **Structure minimale du fichier `.nuspec`** :

```xml
<?xml version="1.0"?>
<package xmlns="http://schemas.microsoft.com/packaging/2013/05/nuspec.xsd">
  <metadata>
    <id>MonPackage</id>
    <version>1.0.0</version>
    <authors>MonNom</authors>
    <description>Une description de mon package.</description>
    <dependencies>
      <group targetFramework="net6.0">
        <dependency id="Newtonsoft.Json" version="13.0.1" />
      </group>
    </dependencies>
  </metadata>
</package>
```

2. **Génération du package avec NuGet CLI** :

   - Placez le fichier `.nuspec` à la racine du dossier contenant vos fichiers.
   - Exécutez la commande suivante :
     ```bash
     nuget pack MonPackage.nuspec
     ```

3. **Structure du package généré** :
   - Le package généré aura l'extension `.nupkg` et contiendra les fichiers, ressources, et métadonnées définis dans le fichier `.nuspec`.

---

## Propriétés d’un fichier `.nuspec`

Voici une liste des principales propriétés utilisables dans un fichier `.nuspec` :

- **id** : Identifiant unique du package.
- **version** : Version du package.
- **authors** : Liste des auteurs.
- **owners** : Liste des propriétaires.
- **licenseUrl** : URL vers la licence.
- **projectUrl** : URL du projet.
- **iconUrl** : URL de l’icône.
- **requireLicenseAcceptance** : Indique si l’utilisateur doit accepter une licence.
- **description** : Description du package.
- **tags** : Mots-clés pour le package.
- **dependencies** : Liste des dépendances avec leurs versions.
- **contentFiles** : Fichiers à inclure dans le package.

Pour obtenir la liste complète de toutes les propriétés possibles et des exemples détaillés, vous pouvez consulter la documentation officielle de NuGet : [Propriétés du fichier `.nuspec`](https://learn.microsoft.com/en-us/nuget/reference/nuspec)

---

## Gérer les versions et cibles de frameworks

1. **Configurer les cibles multiples** :

   - Dans le fichier `.nuspec`, ajoutez des groupes de dépendances pour chaque framework :
     ```xml
     <dependencies>
       <group targetFramework="net6.0">
         <dependency id="Newtonsoft.Json" version="13.0.1" />
       </group>
       <group targetFramework="net48">
         <dependency id="Newtonsoft.Json" version="12.0.3" />
       </group>
     </dependencies>
     ```

2. **Configurer les fichiers dans le package** :

   - Structurez vos fichiers dans des sous-dossiers `lib/net6.0`, `lib/net48`, etc.

3. **Générer le package** :
   - Assurez-vous que la commande `nuget pack` ou les outils Visual Studio incluent correctement ces fichiers dans le package.

---

## Utilisation de `directory.build.props` pour partager des propriétés entre plusieurs projets

Dans des solutions comportant plusieurs projets, vous pouvez utiliser un fichier `Directory.Build.props` pour partager des propriétés, comme la version du package ou les informations d'auteur, entre tous les projets de la solution.

### Exemple de `Directory.Build.props` :

```xml
<Project>
  <PropertyGroup>
    <PackageId>MonPackage</PackageId>
    <PackageVersion>1.0.0</PackageVersion>
    <Authors>MonNom</Authors>
    <Company>MaCompagnie</Company>
  </PropertyGroup>
</Project>
```

Cela permet de centraliser la gestion des informations de package et d'éviter de les répéter dans chaque fichier `.csproj`.

---

## Utilisation d'un script PowerShell pour automatiser la création de packages

Vous pouvez automatiser la génération de vos packages NuGet à l'aide d'un script PowerShell.

### Exemple de script PowerShell :

```powershell
# Script pour générer un package NuGet
$projectPath = "C:\chemin\vers\mon\projet"
$version = "1.0.0"

cd $projectPath
dotnet pack --configuration Release --version-suffix $version
```

---

## Intégration avec GitHub Actions pour publier automatiquement un package

Vous pouvez utiliser GitHub Actions pour automatiser la publication de votre package NuGet après chaque push.

### Exemple de workflow GitHub Actions :

```yaml
name: Publish NuGet Package

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up .NET
        uses: actions/setup-dotnet@v2
        with:
          dotnet-version: "6.0"

      - name: Restore dependencies
        run: dotnet restore

      - name: Build the project
        run: dotnet build --configuration Release

      - name: Pack the project
        run: dotnet pack --configuration Release --output ./nupkgs

      - name: Publish package to NuGet
        run: dotnet nuget push ./nupkgs/*.nupkg --api-key ${{secrets.NUGET_API_KEY}} --source https://api.nuget.org/v3/index.json
```

N'oubliez pas de configurer votre clé API NuGet dans les secrets GitHub (`NUGET_API_KEY`).

---

## Publier un Package sur NuGet.org

### 1. Créer un compte NuGet

- Inscrivez-vous sur [NuGet.org](https://www.nuget.org/) si ce n’est pas déjà fait.

### 2. Obtenir une clé API

- Connectez-vous à votre compte.
- Allez dans **API Keys** et générez une clé.

### 3. Publier le package

- Utilisez NuGet CLI pour envoyer votre package :
  ```bash
  nuget push MonPackage.nupkg -Source https://api.nuget.org/v3/index.json -ApiKey VOTRE_CLE_API
  ```

---

## Ressources utiles

- [Documentation officielle NuGet](https://learn.microsoft.com/en-us/nuget/)
- [NuGet Gallery](https://www.nuget.org/)
- [Exemples de fichiers .nuspec](https://learn.microsoft.com/en-us/nuget/reference/nuspec)

---

Ce guide met en avant les bonnes pratiques pour créer, gérer et publier des packages NuGet, tout en ajoutant des moyens d'automatiser ce processus, comme l'utilisation de `directory.build.props`, PowerShell et GitHub Actions.
