---
category: EF Core
title: Commandes
date: 2024-11-27
author: Romagny13
---

# Les commandes avec Microsoft.EntityFrameworkCore.Tools et dotnet ef

1. [Commandes PMC](https://www.learnentityframeworkcore.com/migrations/commands/pmc-commands). Ce sont les commandes à utiliser dans la **Package Manager Console** de Visual Studio. Elles permettent d'exécuter les mêmes opérations que les commandes CLI, mais directement dans l'interface de Visual Studio.
2. [Commandes CLI](https://www.learnentityframeworkcore.com/migrations/commands/cli-commands). Ce sont les commandes que vous pouvez utiliser dans un terminal avec `dotnet ef`. Elles sont utiles lorsque vous travaillez en ligne de commande.

Voici une version plus concise du document, en se concentrant sur les étapes essentielles et les commandes nécessaires pour l'installation et l'utilisation d'**Entity Framework Core** avec la ligne de commande (CLI) ou le **Package Manager Console** (PMC) dans Visual Studio.

---

## Installation et utilisation d'EF Core

### 1. Installer **Microsoft.EntityFrameworkCore.Tools**

- **Via CLI** :

  ```bash
  dotnet add package Microsoft.EntityFrameworkCore.Tools
  ```

- **Via PMC** (Visual Studio) :
  ```bash
  Install-Package Microsoft.EntityFrameworkCore.Tools
  ```

### 2. Installer un fournisseur de base de données (par ex. SQL Server)

- **SQL Server** :

  ```bash
  dotnet add package Microsoft.EntityFrameworkCore.SqlServer
  ```

- **Autres fournisseurs** :
  - SQLite :
    ```bash
    dotnet add package Microsoft.EntityFrameworkCore.Sqlite
    ```
  - PostgreSQL :
    ```bash
    dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
    ```
  - MySQL :
    ```bash
    dotnet add package Pomelo.EntityFrameworkCore.MySql
    ```

### 3. Installer **Microsoft.EntityFrameworkCore** (si nécessaire)

- **Via CLI** :

  ```bash
  dotnet add package Microsoft.EntityFrameworkCore
  ```

- **Via PMC** :
  ```bash
  Install-Package Microsoft.EntityFrameworkCore
  ```

### 4. Utiliser les commandes EF Core

#### a. **Dans la console PMC de Visual Studio** :

- Ajouter une migration :

  ```bash
  Add-Migration <NomMigration>
  ```

- Mettre à jour la base de données :
  ```bash
  Update-Database
  ```

#### b. **Dans la CLI (dotnet)** :

- Ajouter une migration :

  ```bash
  dotnet ef migrations add <NomMigration>
  ```

- Mettre à jour la base de données :
  ```bash
  dotnet ef database update
  ```

### Résumé des étapes

| Action                                                | Commande                                                                                                          |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Installer **EF Core Tools**                           | `dotnet add package Microsoft.EntityFrameworkCore.Tools` ou `Install-Package Microsoft.EntityFrameworkCore.Tools` |
| Installer fournisseur de base de données (SQL Server) | `dotnet add package Microsoft.EntityFrameworkCore.SqlServer`                                                      |
| Installer **EF Core**                                 | `dotnet add package Microsoft.EntityFrameworkCore`                                                                |
| Ajouter une migration (PMC)                           | `Add-Migration <NomMigration>`                                                                                    |
| Ajouter une migration (CLI)                           | `dotnet ef migrations add <NomMigration>`                                                                         |
| Mettre à jour la base de données (PMC)                | `Update-Database`                                                                                                 |
| Mettre à jour la base de données (CLI)                | `dotnet ef database update`                                                                                       |

---

Cela permet de configurer rapidement **Entity Framework Core** et d'utiliser les commandes essentielles pour gérer les migrations et la base de données dans votre projet.

### **1. Add-Migration**

**Commandes :**

```powershell
Add-Migration <NomDeMigration> [options]
```

**Description :**
La commande `Add-Migration` permet de créer une nouvelle migration pour appliquer les modifications de modèle (modifications de classes) à la base de données. Elle génère un fichier de migration dans le répertoire `Migrations` du projet.

**Arguments :**

- `<NomDeMigration>` : Nom de la migration (ex : `InitialCreate` ou `AddNewColumn`).

**Exemple d'utilisation :**

```powershell
Add-Migration AddNewColumn
```

Cela crée un fichier de migration avec le nom `AddNewColumn` qui contient les changements de schéma.

**Options :**

- `-Context <DbContext>` : Si vous avez plusieurs `DbContext`, vous pouvez spécifier lequel utiliser.
- `-OutputDir <Dossier>` : Spécifie un répertoire de sortie pour les fichiers de migration.
- `-Force` : Permet de remplacer une migration existante avec le même nom (risqué si des migrations ont déjà été appliquées).

---

### **2. Remove-Migration**

**Commandes :**

```powershell
Remove-Migration [options]
```

**Description :**
La commande `Remove-Migration` permet de supprimer la dernière migration qui n'a pas encore été appliquée à la base de données. Elle ne supprime pas les migrations déjà appliquées.

**Options :**

- `-Context <DbContext>` : Si plusieurs `DbContext` sont présents, spécifie lequel utiliser.
- `-Force` : Supprime la migration même si elle a des changements de base de données non appliqués (en cas de problèmes).

**Exemple d'utilisation :**

```powershell
Remove-Migration
```

Cela supprime la dernière migration ajoutée qui n'a pas encore été appliquée.

---

### **3. Scaffold-DbContext**

**Commandes :**

```powershell
Scaffold-DbContext <ChaineDeConnexion> <Fournisseur> [options]
```

**Description :**
La commande `Scaffold-DbContext` permet de générer des classes de modèle et un `DbContext` à partir d'une base de données existante. Cela peut être utile pour une base de données héritée ou pour démarrer avec une base de données existante.

**Arguments :**

- `<ChaineDeConnexion>` : La chaîne de connexion à la base de données.
- `<Fournisseur>` : Le fournisseur de base de données (par exemple, `Microsoft.EntityFrameworkCore.SqlServer` pour SQL Server).

**Options :**

- `-Context <NomDbContext>` : Spécifie le nom du `DbContext` généré.
- `-OutputDir <Dossier>` : Répertoire où les classes seront générées.
- `-Tables <Tables>` : Génère des modèles uniquement pour certaines tables.
- `-DataAnnotations` : Utilise les annotations de données au lieu de la Fluent API pour la configuration du modèle.

**Exemple d'utilisation :**

```powershell
Scaffold-DbContext "Server=localhost;Database=MyDatabase;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
```

Cela génère les classes de modèle à partir de la base de données `MyDatabase`.

---

### **4. Script-Migration**

**Commandes :**

```powershell
Script-Migration [fromMigration] [toMigration] [options]
```

**Description :**
La commande `Script-Migration` permet de générer un script SQL pour appliquer les migrations d'une version de la base de données à une autre. Cela peut être utile pour appliquer des migrations manuellement ou dans un environnement de production.

**Arguments :**

- `fromMigration` : La migration de départ.
- `toMigration` : La migration cible.

**Exemple d'utilisation :**

```powershell
Script-Migration InitialCreate AddNewColumn
```

Cela génère un script SQL qui effectue les changements entre la migration `InitialCreate` et `AddNewColumn`.

**Options :**

- `-Context <DbContext>` : Si vous avez plusieurs `DbContext`, spécifiez lequel utiliser.
- `-Idempotent` : Crée un script idempotent qui peut être exécuté plusieurs fois sans erreur (utile pour la production).

---

### **5. Update-Database**

**Commandes :**

```powershell
Update-Database [migration] [options]
```

**Description :**
La commande `Update-Database` applique les migrations en attente à la base de données. Cela permet de mettre à jour le schéma de la base de données en fonction des migrations créées.

**Arguments :**

- `migration` : Le nom de la migration jusqu'à laquelle vous voulez appliquer les changements. Si vous ne spécifiez rien, elle applique toutes les migrations en attente.

**Exemple d'utilisation :**

```powershell
Update-Database AddNewColumn
```

Cela applique les migrations jusqu'à `AddNewColumn` à la base de données.

**Options :**

- `-Context <DbContext>` : Si vous avez plusieurs `DbContext`, spécifiez lequel utiliser.
- `-Force` : Force l'application des migrations même si certaines ont échoué.

---

### **6. Use-DbContext**

**Commandes :**

```powershell
Use-DbContext <DbContextType> [options]
```

**Description :**
La commande `Use-DbContext` permet de changer le contexte de la base de données utilisé par les outils EF Core pour exécuter des commandes. Elle est utile dans un projet où plusieurs `DbContext` sont présents et vous souhaitez spécifier lequel utiliser.

**Arguments :**

- `<DbContextType>` : Le type de votre `DbContext`.

**Exemple d'utilisation :**

```powershell
Use-DbContext MyDbContext
```

Cela indique à l'outil EF Core de travailler avec `MyDbContext` pour les prochaines commandes.

---

### Résumé des commandes :

| Commande             | Description                                                                   | Exemple d'utilisation                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Add-Migration`      | Crée une nouvelle migration à partir des modifications du modèle              | `Add-Migration AddNewColumn`                                                                                           |
| `Remove-Migration`   | Supprime la dernière migration non appliquée                                  | `Remove-Migration`                                                                                                     |
| `Scaffold-DbContext` | Génère des classes de modèle et un `DbContext` à partir d'une base de données | `Scaffold-DbContext "Server=localhost;Database=MyDatabase;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models` |
| `Script-Migration`   | Génère un script SQL pour appliquer des migrations                            | `Script-Migration InitialCreate AddNewColumn`                                                                          |
| `Update-Database`    | Applique les migrations en attente à la base de données                       | `Update-Database AddNewColumn`                                                                                         |
| `Use-DbContext`      | Change le contexte de la base de données utilisé par les outils               | `Use-DbContext MyDbContext`                                                                                            |

---

Ces commandes sont essentielles pour la gestion des migrations dans un projet utilisant Entity Framework Core.

Voici la suite du document détaillant les commandes **dotnet ef** pour gérer la base de données, les types de `DbContext` et les migrations, avec des explications pour chaque commande.

---

## 2. dotnet ef

### **Installation de `dotnet ef`**

Pour utiliser les commandes `dotnet ef`, vous devez d'abord installer l'outil **Entity Framework Core CLI**. Voici les étapes pour l'installation et la désinstallation si nécessaire.

#### **1. Installer `dotnet ef`**

##### a. **Installation globale (recommandée)**

L'installation globale permet d'utiliser l'outil `dotnet ef` dans n'importe quel projet sans avoir à l'installer pour chaque projet.

1. Ouvrez une fenêtre de terminal ou de ligne de commande.
2. Exécutez la commande suivante pour installer l'outil **dotnet ef** globalement :
   ```bash
   dotnet tool install --global dotnet-ef
   ```

Cette commande va télécharger et installer l'outil `dotnet ef` globalement sur votre machine, ce qui vous permet d'exécuter les commandes `dotnet ef` depuis n'importe quel projet.

##### b. **Installation locale (dans un projet spécifique)**

Si vous préférez installer l'outil uniquement pour un projet spécifique, vous pouvez utiliser une installation locale :

1. Dans le répertoire de votre projet, ouvrez un terminal.
2. Exécutez la commande suivante pour installer l'outil `dotnet ef` :
   ```bash
   dotnet tool install --local dotnet-ef
   ```

Cela ajoutera `dotnet ef` à votre projet et vous pourrez l'utiliser uniquement dans ce projet.

#### **2. Vérifier l'installation**

Une fois l'outil installé, vous pouvez vérifier que l'installation a réussi en exécutant la commande suivante :

```bash
dotnet ef --version
```

Cela affichera la version de l'outil `dotnet ef` installée.

---

### **Désinstallation de `dotnet ef`**

Si vous souhaitez désinstaller `dotnet ef`, vous pouvez le faire de deux manières : globalement ou localement, selon l'endroit où il a été installé.

#### **1. Désinstallation globale**

Pour désinstaller `dotnet ef` de manière globale (si vous l'avez installé avec l'option `--global`), exécutez la commande suivante dans votre terminal :

```bash
dotnet tool uninstall --global dotnet-ef
```

#### **2. Désinstallation locale**

Si l'outil a été installé localement dans un projet spécifique, exécutez la commande suivante dans le répertoire de votre projet :

```bash
dotnet tool uninstall --local dotnet-ef
```

Cela supprimera l'outil `dotnet ef` du projet.

---

### Résumé des commandes :

| Action                               | Commande                                   |
| ------------------------------------ | ------------------------------------------ |
| Installer `dotnet ef` globalement    | `dotnet tool install --global dotnet-ef`   |
| Installer `dotnet ef` localement     | `dotnet tool install --local dotnet-ef`    |
| Vérifier la version de `dotnet ef`   | `dotnet ef --version`                      |
| Désinstaller `dotnet ef` globalement | `dotnet tool uninstall --global dotnet-ef` |
| Désinstaller `dotnet ef` localement  | `dotnet tool uninstall --local dotnet-ef`  |

Cela vous permet d'installer et de désinstaller facilement **Entity Framework Core CLI** pour gérer vos migrations et bases de données dans vos projets.

### **1. database (Commandes pour gérer la base de données)**

**Description :**
Le sous-ensemble de commandes `dotnet ef database` permet de gérer la base de données elle-même, en appliquant ou supprimant des migrations, en exécutant des scripts ou en réinitialisant la base de données.

#### **1.1. dotnet ef database update**

**Commandes :**

```bash
dotnet ef database update [migration] [options]
```

**Description :**
La commande `dotnet ef database update` applique les migrations en attente à la base de données. Elle permet de mettre à jour le schéma de la base de données en fonction des migrations disponibles.

**Arguments :**

- `migration` : Le nom de la migration cible (si omis, elle applique toutes les migrations en attente).

**Exemple d'utilisation :**

```bash
dotnet ef database update AddNewColumn
```

Cela applique toutes les migrations jusqu'à `AddNewColumn` à la base de données.

**Options :**

- `--context <DbContext>` : Spécifie quel `DbContext` utiliser si plusieurs sont présents.
- `--force` : Force l'application des migrations même si des erreurs sont détectées.

#### **1.2. dotnet ef database drop**

**Commandes :**

```bash
dotnet ef database drop [options]
```

**Description :**
La commande `dotnet ef database drop` permet de supprimer la base de données associée au projet. Elle supprime la base de données mais ne supprime pas les fichiers de migration.

**Exemple d'utilisation :**

```bash
dotnet ef database drop
```

Cela supprime la base de données actuellement utilisée.

**Options :**

- `--context <DbContext>` : Spécifie le `DbContext` à utiliser pour la commande.
- `--force` : Confirme la suppression de la base de données sans demander de confirmation.

---

### **2. dbcontext (Commandes pour gérer les types de DbContext)**

**Description :**
Les commandes sous le groupe `dotnet ef dbcontext` permettent de gérer les types de `DbContext` dans un projet, de les examiner ou de générer des classes de type `DbContext`.

#### **2.1. dotnet ef dbcontext info**

**Commandes :**

```bash
dotnet ef dbcontext info [options]
```

**Description :**
La commande `dotnet ef dbcontext info` affiche des informations sur le `DbContext` actuel, comme les propriétés et les types des entités dans le `DbContext`.

**Exemple d'utilisation :**

```bash
dotnet ef dbcontext info
```

Cela affiche des informations concernant le `DbContext` du projet.

**Options :**

- `--context <DbContext>` : Si plusieurs `DbContext` sont présents, spécifie lequel utiliser.

#### **2.2. dotnet ef dbcontext scaffold**

**Commandes :**

```bash
dotnet ef dbcontext scaffold <ChaineDeConnexion> <Fournisseur> [options]
```

**Description :**
La commande `dotnet ef dbcontext scaffold` génère un `DbContext` et des classes de modèle à partir d'une base de données existante. Cela peut être utilisé pour démarrer un projet avec une base de données existante.

**Arguments :**

- `<ChaineDeConnexion>` : La chaîne de connexion à la base de données.
- `<Fournisseur>` : Le fournisseur de base de données (par exemple, `Microsoft.EntityFrameworkCore.SqlServer` pour SQL Server).

**Exemple d'utilisation :**

```bash
dotnet ef dbcontext scaffold "Server=localhost;Database=MyDatabase;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer --output-dir Models
```

Cela génère les classes de modèle à partir de la base de données spécifiée et crée un `DbContext` correspondant.

**Options :**

- `--context <NomDbContext>` : Spécifie un nom pour le `DbContext` généré.
- `--output-dir <Dossier>` : Spécifie le dossier où les classes de modèle seront générées.
- `--data-annotations` : Utilise des annotations de données pour la configuration du modèle.

---

### **3. migrations (Commandes pour gérer les migrations)**

**Description :**
Le groupe de commandes `dotnet ef migrations` est utilisé pour gérer les migrations dans un projet, permettant de créer, appliquer et supprimer des migrations.

#### **3.1. dotnet ef migrations add**

**Commandes :**

```bash
dotnet ef migrations add <NomDeMigration> [options]
```

**Description :**
La commande `dotnet ef migrations add` crée une nouvelle migration en fonction des modifications apportées au modèle. Elle génère un fichier de migration dans le dossier de migration du projet.

**Arguments :**

- `<NomDeMigration>` : Le nom de la migration à créer.

**Exemple d'utilisation :**

```bash
dotnet ef migrations add AddNewColumn
```

Cela génère une migration nommée `AddNewColumn` basée sur les changements de modèle.

**Options :**

- `--context <DbContext>` : Si plusieurs `DbContext` sont utilisés, vous pouvez spécifier lequel utiliser pour cette migration.
- `--output-dir <Dossier>` : Spécifie où enregistrer la migration.

#### **3.2. dotnet ef migrations remove**

**Commandes :**

```bash
dotnet ef migrations remove [options]
```

**Description :**
La commande `dotnet ef migrations remove` permet de supprimer la dernière migration non appliquée à la base de données.

**Exemple d'utilisation :**

```bash
dotnet ef migrations remove
```

Cela supprime la dernière migration ajoutée qui n'a pas encore été appliquée.

**Options :**

- `--context <DbContext>` : Si plusieurs `DbContext` sont présents, spécifie lequel utiliser.

#### **3.3. dotnet ef migrations list**

**Commandes :**

```bash
dotnet ef migrations list [options]
```

**Description :**
La commande `dotnet ef migrations list` permet d'afficher la liste des migrations appliquées et non appliquées.

**Exemple d'utilisation :**

```bash
dotnet ef migrations list
```

Cela affiche la liste de toutes les migrations dans l'ordre dans lequel elles ont été appliquées ou ajoutées.

**Options :**

- `--context <DbContext>` : Spécifie le `DbContext` à utiliser.

---

### Résumé des commandes :

| Commande                       | Description                                                                   | Exemple d'utilisation                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `dotnet ef database update`    | Applique les migrations en attente à la base de données                       | `dotnet ef database update` <br> `AddNewColumn`                                                                              |
| `dotnet ef database drop`      | Supprime la base de données associée au projet                                | `dotnet ef database drop`                                                                                                    |
| `dotnet ef dbcontext info`     | Affiche des informations sur le `DbContext` actuel                            | `dotnet ef dbcontext info`                                                                                                   |
| `dotnet ef dbcontext scaffold` | Génère un `DbContext` et des classes de modèle à partir d'une base de données | `dotnet ef dbcontext scaffold` <br> `"Server=localhost;"` <br> `Microsoft.EntityFrameworkCore.SqlServer --output-dir Models` |
| `dotnet ef migrations add`     | Crée une nouvelle migration                                                   | `dotnet ef migrations add` <br> `AddNewColumn`                                                                               |
| `dotnet ef migrations remove`  | Supprime la dernière migration non appliquée                                  | `dotnet ef migrations remove`                                                                                                |
| `dotnet ef migrations list`    | Affiche la liste des migrations appliquées et non appliquées                  | `dotnet ef migrations list`                                                                                                  |

---

Ces commandes permettent une gestion fine de la base de données, des migrations, et des types de `DbContext` dans un projet utilisant **Entity Framework Core** avec la commande `dotnet ef`.
