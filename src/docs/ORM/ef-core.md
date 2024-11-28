---
category: ORM
title: EF Core
date: 2024-11-27
author: Romagny13
---

# Guide EF Core

## 1. Installation d'EF Core avec Microsoft.EntityFrameworkCore et Providers

L'installation d'EF Core dépend du **Target Framework** de votre projet. **Microsoft.EntityFrameworkCore** est ajouté automatiquement en tant que dépendance, donc vous n'avez qu'à installer le provider de base de données choisi (par exemple, `Microsoft.EntityFrameworkCore.SqlServer`).

## 1.1 Version d'EF Core selon le TFM

- **.NET 5.0** → EF Core 5.x
- **.NET 6.0** → EF Core 6.x
- **.NET 7.0** → EF Core 7.x
- **.NET 8.0** → EF Core 8.x
- etc.

## 1.2 Installation via NuGet

## 1.2.1 Via NuGet Package Manager (Visual Studio)

1. Ouvrir **Tools > NuGet Package Manager > Manage NuGet Packages for Solution**.
2. Chercher et installer `Microsoft.EntityFrameworkCore` (automatiquement ajouté en dépendance) et le provider souhaité (ex. `Microsoft.EntityFrameworkCore.SqlServer`).

## 1.2.2 Via la Console du Gestionnaire de Package

```bash
Install-Package Microsoft.EntityFrameworkCore.SqlServer -Version 6.0.0
```

## 1.2.3 Via la CLI .NET

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 6.0.0
```

## 1.2.4 Directement dans le fichier .csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="6.0.0" />
  </ItemGroup>
</Project>
```

## 1.3 Providers disponibles

- **SQL Server** : `Microsoft.EntityFrameworkCore.SqlServer`
- **MySQL** : `Pomelo.EntityFrameworkCore.MySql`
- **SQLite** : `Microsoft.EntityFrameworkCore.Sqlite`
- **PostgreSQL** : `Npgsql.EntityFrameworkCore.PostgreSQL`
- **In-Memory** : `Microsoft.EntityFrameworkCore.InMemory`

Exemples d'installation via la CLI :

- MySQL : `dotnet add package Pomelo.EntityFrameworkCore.MySql --version 7.0.0`
- SQLite : `dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 7.0.0`

## 1.4 Mise à jour des packages

Pour mettre à jour EF Core, utilisez la commande :

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 7.0.0
```

Ainsi, selon votre **Target Framework**, installez **EF Core** et le provider de base de données choisi pour commencer à travailler avec votre contexte de données.

## 1.5 Installation de Microsoft.AspNetCore.Identity.EntityFrameworkCore

Si vous souhaitez utiliser **Identity** avec **EF Core**, vous devez installer le package `Microsoft.AspNetCore.Identity.EntityFrameworkCore`. Ce package permet d'intégrer **IdentityDbContext** et de gérer l'authentification et la gestion des utilisateurs dans votre application.

### 1.5.1 Installation via NuGet

#### 1.5.1.1 Via NuGet Package Manager (Visual Studio)

1. Ouvrir **Tools > NuGet Package Manager > Manage NuGet Packages for Solution**.
2. Chercher et installer `Microsoft.AspNetCore.Identity.EntityFrameworkCore`.

#### 1.5.1.2 Via la Console du Gestionnaire de Package

```bash
Install-Package Microsoft.AspNetCore.Identity.EntityFrameworkCore -Version 6.0.0
```

#### 1.5.1.3 Via la CLI .NET

```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 6.0.0
```

#### 1.5.1.4 Directement dans le fichier .csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="6.0.0" />
  </ItemGroup>
</Project>
```

## 1.6 Installation et utilisation de Microsoft.EntityFrameworkCore.Tools

Lorsque vous travaillez avec **EF Core**, vous avez deux options pour gérer les migrations et autres opérations liées à la base de données : utiliser **Package Manager Console** dans Visual Studio ou la commande **dotnet ef** si vous travaillez avec des outils comme **VS Code** ou si vous préférez la ligne de commande.

### 1.6.1 Installation de Microsoft.EntityFrameworkCore.Tools

Le package **Microsoft.EntityFrameworkCore.Tools** vous permet d'utiliser les commandes comme `Add-Migration`, `Update-Database`, et `dotnet ef` pour gérer vos migrations.

**Microsoft.EntityFrameworkCore.Tools** doit être installé dans le projet de démarrage si vous utilisez la méthode `AddDbContext` dans les services (par exemple, dans un projet API ou MVC). Dans ce cas, veillez à sélectionner ce projet de démarrage dans le **Package Manager Console** avant d'exécuter des commandes.

Si, en revanche, vous travaillez avec un projet séparé contenant uniquement le **DbContext** et les migrations, installez **Microsoft.EntityFrameworkCore.Tools** dans ce projet, puis sélectionnez-le dans le **Package Manager Console** avant d'exécuter les commandes.

#### 1.6.1.1 Utilisation avec Visual Studio (Package Manager Console)

Si vous utilisez Visual Studio, vous pouvez utiliser le **Package Manager Console** pour entrer des commandes comme `Add-Migration` et `Update-Database`. Pour cela, vous devez installer le package **Microsoft.EntityFrameworkCore.Tools**.

1. **Ouvrir la Console du Gestionnaire de Package** dans Visual Studio via **Tools > NuGet Package Manager > Package Manager Console**.
2. Installer le package via la console avec la commande suivante :

```bash
Install-Package Microsoft.EntityFrameworkCore.Tools -Version 6.0.0
```

Une fois ce package installé, vous pouvez utiliser des commandes comme :

- `Add-Migration NomDeLaMigration` pour créer une nouvelle migration.
- `Update-Database` pour appliquer les migrations à la base de données.

#### 1.6.1.2 Utilisation avec VS Code ou en ligne de commande (CLI .NET)

Si vous travaillez avec **VS Code**, ou si vous préférez utiliser la ligne de commande en général, vous devez installer l'outil **dotnet ef** globalement sur votre machine. Cela vous permettra d'exécuter des commandes comme `dotnet ef migrations add` et `dotnet ef database update`.

1. **Installation globale de dotnet ef** :

```bash
dotnet tool install --global dotnet-ef
```

Voici les étapes pour vérifier si l'outil `dotnet-ef` est installé, vérifier la version installée et désinstaller une ancienne version :

2. **Vérifier si l'outil est installé**
   Pour vérifier si l'outil `dotnet-ef` est installé, vous pouvez exécuter la commande suivante :

```bash
dotnet tool list --global
```

Cela affichera une liste des outils .NET installés globalement, et vous pourrez vérifier si `dotnet-ef` est présent.

3. **Vérifier la version installée**
   Si l'outil est installé, vous pouvez vérifier sa version en exécutant :

```bash
dotnet ef --version
```

Cela affichera la version de l'outil `dotnet-ef` installé.

4. **Désinstaller une ancienne version**
   Si vous avez une version obsolète ou souhaitez la désinstaller, vous pouvez le faire avec la commande suivante :

```bash
dotnet tool uninstall --global dotnet-ef
```

Cela désinstallera la version de `dotnet-ef` actuellement installée globalement. 

#### 1.6.1.3 Directement dans le fichier .csproj

Si vous voulez que votre projet utilise **Microsoft.EntityFrameworkCore.Tools** en tant que dépendance, vous pouvez également ajouter ce package directement dans le fichier `.csproj` de votre projet :

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.0">
        <PrivateAssets>all</PrivateAssets>
        <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
  </ItemGroup>
</Project>
```

### 1.6.3 Remarques

- **Visual Studio** : Si vous utilisez Visual Studio, vous pouvez simplement utiliser **Package Manager Console** pour les commandes `Add-Migration` et `Update-Database`, sans avoir besoin d'installer **dotnet ef** globalement.
- **VS Code et autres éditeurs** : Si vous travaillez dans un environnement comme **VS Code** ou un éditeur sans gestionnaire de package intégré, l'installation de **dotnet ef** globalement via la CLI est recommandée pour utiliser les commandes **dotnet ef**.
