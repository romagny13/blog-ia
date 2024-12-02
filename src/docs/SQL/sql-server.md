---
category: SQL
title: SQL Server
date: 2024-11-26
author: Romagny13
---

# SQL Server

## **1. Versions de SQL Server**

SQL Server est disponible en plusieurs éditions, adaptées à différents besoins :

### **1.1. Éditions les plus courantes**

- **Express** :

  - Gratuit, idéal pour les petites applications.
  - Limitations : 10 Go par base de données, 1 Go de RAM, 4 cœurs maximum.
  - Inclus **SQL Server Management Studio (SSMS)**.

- **Developer** :

  - Gratuit, destiné au développement et aux tests.
  - Fonctionnalités complètes identiques à l'édition Enterprise, mais non destiné à la production.

- **Standard** :

  - Payant, pour des applications moyennes.
  - Moins de fonctionnalités avancées que l'édition Enterprise.

- **Enterprise** :

  - Payant, destiné aux entreprises avec des besoins critiques (clustering, partitionnement avancé, etc.).

- **LocalDB** :
  - Version légère de SQL Server Express pour les développeurs.
  - Fonctionne directement depuis le processus de l'application.
  - Ne nécessite pas d'installation de serveur.

### **1.2. Versions importantes**

- SQL Server 2012 : Première version avec **AlwaysOn Availability Groups**.
- SQL Server 2016 : Introduit **In-Memory OLTP** et **Dynamic Data Masking**.
- SQL Server 2019 : Intégration avec **Big Data Clusters**.
- SQL Server 2022 : Nouveautés pour l'intégration cloud avec **Azure**.

---

## **2. Installation de SQL Server**

### **2.1. Télécharger SQL Server**

- Téléchargez SQL Server Express, Developer ou Standard sur le site officiel de Microsoft :  
  [https://www.microsoft.com/fr-fr/sql-server](https://www.microsoft.com/fr-fr/sql-server)

### **2.2. Installer SQL Server**

1. Lancez l’installateur et choisissez un type d’installation :

   - **Basic** : Configuration minimale, rapide.
   - **Custom** : Permet de choisir les fonctionnalités (SSIS, SSRS, etc.).
   - **Download Media** : Pour créer une image ISO.

2. Configurez l’authentification :

   - **Mixed Mode** : Authentification Windows et SQL Server (recommandé).
   - Définissez un mot de passe pour le compte `sa`.

3. Installez **SQL Server Management Studio (SSMS)** :
   - Téléchargez depuis [SSMS](https://learn.microsoft.com/fr-fr/sql/ssms/download-sql-server-management-studio-ssms).

---

## **3. Outils pour gérer SQL Server**

### **3.1. SQL Server Management Studio (SSMS)**

- Interface graphique officielle pour :
  - Gérer les bases de données.
  - Exécuter des requêtes SQL.
  - Sauvegarder/restaurer des bases.
- Téléchargement : [SSMS](https://learn.microsoft.com/fr-fr/sql/ssms/download-sql-server-management-studio-ssms).

### **3.2. Azure Data Studio**

- Interface moderne pour SQL Server et Azure SQL.
- Prise en charge des extensions et du mode sombre.

### **3.3. Autres outils**

- **SQLCMD** : Outil en ligne de commande.
- **Visual Studio** : Intégré avec SQL Server pour les projets de bases de données.
- **PowerShell** : Automatisation avec le module `SqlServer`.

---

## **4. Gestion de la sécurité**

### **4.1. Créer un login SQL**

Un **login** est nécessaire pour accéder au serveur SQL.

```sql
-- Créer un login SQL
CREATE LOGIN myLogin WITH PASSWORD = 'Password123';

-- Associer un utilisateur à une base
USE myDatabase;
CREATE USER myUser FOR LOGIN myLogin;

-- Ajouter des permissions
ALTER ROLE db_datareader ADD MEMBER myUser;
ALTER ROLE db_datawriter ADD MEMBER myUser;
```

### **4.2. Types d'authentification**

- **Windows Authentication** : Basé sur les comptes Windows.
- **SQL Server Authentication** : Utilise les logins SQL.

### **4.3. Permissions et rôles**

- **Rôles serveur** :
  - `sysadmin` : Droits complets.
  - `dbcreator` : Création de bases.
- **Rôles base de données** :
  - `db_owner` : Contrôle complet sur une base.
  - `db_datareader` : Lecture uniquement.
  - `db_datawriter` : Écriture uniquement.

---

## **5. Sauvegarde et restauration**

### **5.1. Sauvegarde d’une base**

```sql
BACKUP DATABASE myDatabase TO DISK = 'C:\backups\myDatabase.bak'
WITH FORMAT, COMPRESSION, STATS = 10;
```

- **Options courantes :**
  - `WITH FORMAT` : Écrase les sauvegardes précédentes.
  - `WITH COMPRESSION` : Réduit la taille du fichier.

### **5.2. Restauration d’une base**

```sql
RESTORE DATABASE myDatabase FROM DISK = 'C:\backups\myDatabase.bak'
WITH RECOVERY;
```

---

## **6. Profiling des requêtes**

### **6.1. Activer le Query Store**

Le Query Store enregistre les statistiques des requêtes.

```sql
ALTER DATABASE myDatabase SET QUERY_STORE = ON;
```

- Utilisez SSMS pour visualiser les plans de requêtes.

### **6.2. Analyse avec `SET STATISTICS`**

- Afficher les statistiques d’exécution :
  ```sql
  SET STATISTICS IO ON;
  SET STATISTICS TIME ON;
  ```

### **6.3. SQL Server Profiler**

- Outil graphique pour tracer les requêtes.
- Inclus dans SSMS.

---

## **7. Outils d’optimisation**

### **7.1. Indexation**

Créez des index pour améliorer la performance des requêtes.

```sql
CREATE INDEX idx_column1 ON myTable (column1);
```

### **7.2. Maintenance des index**

- Reconstruire un index :
  ```sql
  ALTER INDEX idx_column1 ON myTable REBUILD;
  ```

### **7.3. Analyse des performances**

- Utilisez le **Database Engine Tuning Advisor** pour des recommandations.

---

## **8. Tâches programmées (SQL Agent)**

### **8.1. Configurer une tâche**

1. Activez le **SQL Server Agent**.
2. Dans SSMS, créez une tâche planifiée :
   - Exemple : Sauvegarde automatique.

### **8.2. Script d’automatisation**

```sql
EXEC sp_add_job @job_name = 'Backup Job';
EXEC sp_add_jobstep @job_name = 'Backup Job',
    @step_name = 'Database Backup',
    @command = 'BACKUP DATABASE myDatabase TO DISK = ''C:\backups\myDatabase.bak''',
    @subsystem = 'TSQL';
EXEC sp_add_schedule @schedule_name = 'Daily Backup',
    @freq_type = 4, -- 4 = Daily
    @freq_interval = 1;
EXEC sp_attach_schedule @job_name = 'Backup Job', @schedule_name = 'Daily Backup';
EXEC sp_start_job @job_name = 'Backup Job';
```

---

## **9. Bonnes pratiques pour SQL Server**

1. **Toujours utiliser des backups réguliers.**
2. **Mettre en place des index sur les colonnes fréquemment utilisées dans les `WHERE` et `JOIN`.**
3. **Activer le Query Store pour suivre les performances.**
4. **Limiter les permissions au strict nécessaire.**
5. **Automatiser les tâches répétitives avec SQL Agent.**
6. **Surveiller les ressources (RAM, disque) et configurer les alertes.**

---

Ce guide couvre les fonctionnalités principales et avancées de SQL Server. Si tu veux des exemples plus approfondis sur un sujet particulier (comme les tâches planifiées ou l'optimisation), fais-le-moi savoir !

## **10. Points spécifiques pour SQL Server**

Voici des solutions détaillées pour insérer des données en désactivant une colonne `IDENTITY`, et pour obtenir des informations complètes sur une base de données, comme les tables, vues, procédures, clés primaires et étrangères, etc.

---

### **1. Insérer des données en désactivant l'IDENTITY**

#### **1.1. Désactiver l'IDENTITY temporairement**

Les colonnes marquées comme `IDENTITY` (auto-incrément) empêchent l'insertion manuelle des valeurs par défaut. Pour forcer une insertion manuelle, utilisez `SET IDENTITY_INSERT`.

```sql
-- Activer l'insertion manuelle sur une table spécifique
SET IDENTITY_INSERT myTable ON;

-- Insérer une ligne avec une valeur pour la colonne IDENTITY
INSERT INTO myTable (id, column1, column2)
VALUES (100, 'valeur1', 'valeur2');

-- Désactiver l'insertion manuelle
SET IDENTITY_INSERT myTable OFF;
```

#### **1.2. Contraintes**

- `SET IDENTITY_INSERT` ne peut être activé que pour une seule table à la fois dans une session.
- Nécessite des permissions suffisantes (comme `db_owner`).

---

### **2. Obtenir des informations sur une base de données**

SQL Server propose des vues système pour récupérer des informations sur les métadonnées.

#### **2.1. Lister toutes les tables**

```sql
SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';
```

#### **2.2. Lister toutes les vues**

```sql
SELECT TABLE_NAME, TABLE_SCHEMA
FROM INFORMATION_SCHEMA.VIEWS;
```

#### **2.3. Lister toutes les procédures stockées**

```sql
SELECT ROUTINE_NAME, ROUTINE_SCHEMA, ROUTINE_TYPE
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_TYPE = 'PROCEDURE';
```

#### **2.4. Obtenir les colonnes d'une table**

```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'myTable';
```

#### **2.5. Lister les clés primaires**

```sql
SELECT
    tc.TABLE_NAME,
    kcu.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY';
```

#### **2.6. Lister les clés étrangères**

```sql
SELECT
    fk.TABLE_NAME AS ForeignTable,
    fk.COLUMN_NAME AS ForeignColumn,
    pk.TABLE_NAME AS PrimaryTable,
    pk.COLUMN_NAME AS PrimaryColumn
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS rc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS fk
    ON rc.CONSTRAINT_NAME = fk.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS pk
    ON rc.UNIQUE_CONSTRAINT_NAME = pk.CONSTRAINT_NAME;
```

#### **2.7. Obtenir les relations entre tables**

Pour avoir un aperçu complet des relations (clés étrangères et primaires) dans une base de données :

```sql
SELECT
    OBJECT_NAME(fk.parent_object_id) AS ForeignTable,
    c1.name AS ForeignKeyColumn,
    OBJECT_NAME(fk.referenced_object_id) AS PrimaryTable,
    c2.name AS PrimaryKeyColumn
FROM sys.foreign_key_columns AS fk
JOIN sys.columns AS c1
    ON fk.parent_object_id = c1.object_id AND fk.parent_column_id = c1.column_id
JOIN sys.columns AS c2
    ON fk.referenced_object_id = c2.object_id AND fk.referenced_column_id = c2.column_id;
```

---

### **3. Infos complémentaires**

#### **3.1. Lister toutes les bases de données**

```sql
SELECT name AS DatabaseName, state_desc AS Status
FROM sys.databases;
```

#### **3.2. Taille d'une base de données**

```sql
EXEC sp_spaceused;
```

#### **3.3. Lister les index sur une table**

```sql
SELECT
    i.name AS IndexName,
    i.type_desc AS IndexType,
    c.name AS ColumnName
FROM sys.indexes AS i
JOIN sys.index_columns AS ic
    ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns AS c
    ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE OBJECT_NAME(i.object_id) = 'myTable';
```

---

### **4. Générer des scripts automatiques dans SSMS**

1. **Lister les tables, vues et procédures** :  
   Ouvrez SSMS, faites un clic droit sur la base de données > **Tâches** > **Générer des scripts**.

2. **Exporter des structures ou des données** :

   - Cochez **Structure uniquement** ou **Données uniquement** selon vos besoins.
   - Personnalisez les options pour inclure les relations et contraintes.

3. **Requêtes d'exploration rapide** :  
   Utilisez le volet **Object Explorer** de SSMS pour explorer visuellement les objets (tables, vues, etc.) avec un clic droit > **Script as** > **SELECT/INSERT/DELETE/CREATE**.

### **5. Gestion des tables temporaires dans SQL Server**

Les **tables temporaires** dans SQL Server sont utilisées pour stocker des données temporairement durant la session de l'utilisateur ou jusqu'à ce que la session soit fermée. Elles sont particulièrement utiles pour les opérations complexes ou les calculs intermédiaires. SQL Server propose deux types de tables temporaires : les **tables temporaires locales** et les **tables temporaires globales**.

---

#### **1. Types de Tables Temporaires**

##### **1.1. Tables Temporaires Locales**

Les tables temporaires locales sont créées avec un seul `#` devant leur nom. Elles sont visibles uniquement pour la session ou la connexion dans laquelle elles ont été créées. Dès que la connexion est fermée ou que la session se termine, la table temporaire est automatiquement supprimée.

###### **Exemple de création de table temporaire locale**

```sql
CREATE TABLE #TempTable (
    ID INT,
    Name VARCHAR(100)
);
```

- **Insérer des données dans une table temporaire locale :**

```sql
INSERT INTO #TempTable (ID, Name) VALUES (1, 'John Doe');
```

- **Sélectionner des données depuis la table temporaire :**

```sql
SELECT * FROM #TempTable;
```

- **Supprimer une table temporaire locale explicitement (bien que non nécessaire à la fin de la session) :**

```sql
DROP TABLE #TempTable;
```

---

##### **1.2. Tables Temporaires Globales**

Les tables temporaires globales sont créées avec deux `##` devant leur nom. Contrairement aux tables locales, elles sont visibles pour toutes les sessions SQL Server jusqu'à ce que la dernière session qui y accède soit fermée.

###### **Exemple de création de table temporaire globale**

```sql
CREATE TABLE ##GlobalTempTable (
    ID INT,
    Name VARCHAR(100)
);
```

- **Insérer des données dans une table temporaire globale :**

```sql
INSERT INTO ##GlobalTempTable (ID, Name) VALUES (2, 'Jane Doe');
```

- **Sélectionner des données depuis la table temporaire globale :**

```sql
SELECT * FROM ##GlobalTempTable;
```

- **Supprimer une table temporaire globale explicitement :**

```sql
DROP TABLE ##GlobalTempTable;
```

---

#### **2. Caractéristiques des Tables Temporaires**

- **Scope de visibilité** :
  - Les tables temporaires locales sont visibles uniquement pour la session où elles ont été créées.
  - Les tables temporaires globales sont visibles pour toutes les sessions jusqu'à ce que la dernière session soit fermée.
- **Durée de vie** :

  - Les tables temporaires locales et globales sont automatiquement supprimées lorsque la session ou la connexion est fermée, ou après avoir été explicitement supprimées par l'utilisateur.

- **Performance** :

  - Les tables temporaires sont souvent utilisées dans des processus de traitement des données temporaires ou complexes. Elles sont généralement stockées dans la base de données `tempdb`, qui est un espace dédié aux objets temporaires dans SQL Server.

- **Indexed** :

  - Il est possible d’ajouter des index sur les tables temporaires pour optimiser les performances, surtout dans le cas de grands volumes de données.

  ```sql
  CREATE CLUSTERED INDEX IX_TempTable ON #TempTable (ID);
  ```

---

#### **3. Utilisation courante des Tables Temporaires**

Les tables temporaires sont souvent utilisées dans les scénarios suivants :

- **Traitement des données intermédiaires** : Lorsque des données doivent être manipulées ou agrégées avant d'être insérées dans une table permanente.
- **Opérations complexes** : Pour stocker des résultats d'une requête complexe qui sont ensuite utilisés dans des opérations supplémentaires.
- **Partitionnement de données** : Pour diviser un grand ensemble de données en morceaux plus petits pour un traitement plus efficace.
- **Calculs temporaires** : Pour des calculs qui ne nécessitent pas de stockage permanent.

##### **Exemple : Utilisation d'une table temporaire dans une procédure stockée**

```sql
CREATE PROCEDURE ProcessData
AS
BEGIN
    -- Création de la table temporaire
    CREATE TABLE #TempResults (
        ID INT,
        CalculationResult DECIMAL
    );

    -- Insérer des données dans la table temporaire
    INSERT INTO #TempResults (ID, CalculationResult)
    SELECT ID, SUM(Value) FROM SalesData GROUP BY ID;

    -- Utiliser les données de la table temporaire
    SELECT * FROM #TempResults;

    -- Supprimer la table temporaire
    DROP TABLE #TempResults;
END;
```

---

#### **4. Bonnes Pratiques avec les Tables Temporaires**

- **Utilisation avec précaution des tables temporaires globales** : Comme elles sont accessibles par toutes les sessions, elles peuvent entraîner des conflits de noms ou des problèmes de concurrence. Préférez les tables temporaires locales dans la majorité des cas.
- **Gestion des index** : Bien qu'il soit possible d'ajouter des index aux tables temporaires pour améliorer les performances, assurez-vous que cela est nécessaire, car cela peut introduire un overhead dans les opérations d'insertion.

- **Suppression explicite** : Bien que les tables temporaires locales soient supprimées à la fermeture de la session, il est recommandé de les supprimer explicitement lorsque vous n'en avez plus besoin, pour libérer des ressources dans `tempdb`.

---

#### **5. Vérifier l'existence des Tables Temporaires**

Si vous devez vérifier l'existence d'une table temporaire avant de l'utiliser (par exemple dans une procédure stockée), vous pouvez utiliser une requête sur les vues système de SQL Server.

```sql
IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL
    PRINT 'Table temporaire existe';
ELSE
    PRINT 'Table temporaire n\'existe pas';
```

---

#### **6. Table Temporaire vs Table Permanente**

Voici un tableau récapitulatif des différences entre les tables permanentes et les tables temporaires :

| **Critère**         | **Table Temporaire**                          | **Table Permanente**                 |
| ------------------- | --------------------------------------------- | ------------------------------------ |
| **Durée de vie**    | Durée de vie limitée à la session/connexion   | Durée de vie indéfinie               |
| **Visibilité**      | Locales ou globales selon le type             | Visible à toutes les sessions        |
| **Stockage**        | Dans `tempdb`                                 | Dans la base de données principale   |
| **Indexation**      | Possible (indexage plus léger)                | Indexage complet possible            |
| **Usage principal** | Traitement temporaire, données intermédiaires | Données permanentes et de production |

---

Les tables temporaires sont un outil puissant pour la gestion des données temporaires dans SQL Server, en particulier pour les processus complexes ou les calculs qui nécessitent de manipuler les données avant qu'elles ne soient définitivement insérées dans des tables permanentes.

### **5. Types de données particuliers dans SQL Server**

SQL Server propose une série de types de données spécialisés qui peuvent être utilisés pour stocker et manipuler des informations dans des formats spécifiques. Ces types incluent le **JSON**, le **XML**, les **types géographiques** (comme les points, les lignes et les polygones), ainsi que des types dédiés à des usages particuliers. Voici un aperçu de ces types de données et de leur utilisation dans SQL Server.

---

#### **1. Type JSON**

SQL Server prend en charge le **JSON** (JavaScript Object Notation), bien que le type `JSON` n'existe pas directement en tant que type de données dans SQL Server. Le JSON est simplement stocké dans des **colonnes de type `NVARCHAR`** ou `VARCHAR`. Cependant, SQL Server offre une série de fonctions intégrées pour travailler avec les données JSON, comme la lecture, l'écriture et l'extraction de données.

##### **Exemples d'utilisation du JSON en SQL Server**

- **Création d'une colonne JSON dans une table** :

  ```sql
  CREATE TABLE Users (
      UserID INT PRIMARY KEY,
      UserData NVARCHAR(MAX)
  );
  ```

- **Insertion de données JSON** :

  ```sql
  INSERT INTO Users (UserID, UserData)
  VALUES (1, '{"name": "John Doe", "age": 30, "email": "john.doe@example.com"}');
  ```

- **Lecture des données JSON** :
  Vous pouvez extraire des valeurs spécifiques du JSON en utilisant la fonction `JSON_VALUE`.

  ```sql
  SELECT JSON_VALUE(UserData, '$.name') AS Name
  FROM Users
  WHERE UserID = 1;
  ```

- **Filtrer les données JSON avec `OPENJSON`** :

  ```sql
  SELECT *
  FROM OPENJSON((SELECT UserData FROM Users WHERE UserID = 1))
  WITH (
      name NVARCHAR(100),
      age INT,
      email NVARCHAR(100)
  );
  ```

- **Modifier un document JSON** :
  Utilisez la fonction `JSON_MODIFY` pour changer une valeur dans le JSON.
  ```sql
  UPDATE Users
  SET UserData = JSON_MODIFY(UserData, '$.age', 31)
  WHERE UserID = 1;
  ```

---

#### **2. Type XML**

SQL Server offre un type de données spécifique pour stocker des documents XML : le type **`XML`**. Ce type est très puissant pour la gestion et le traitement des données XML, permettant l'utilisation de méthodes spécifiques pour interroger et manipuler le contenu XML.

##### **Exemples d'utilisation du XML en SQL Server**

- **Création d'une colonne XML dans une table** :

  ```sql
  CREATE TABLE Orders (
      OrderID INT PRIMARY KEY,
      OrderDetails XML
  );
  ```

- **Insertion de données XML** :

  ```sql
  INSERT INTO Orders (OrderID, OrderDetails)
  VALUES (1, '<order><item>Book</item><quantity>2</quantity><price>15.00</price></order>');
  ```

- **Interrogation des données XML** :
  SQL Server fournit des méthodes pour interroger des documents XML en utilisant le langage XQuery.

  - Extraire une valeur d'un élément XML :

    ```sql
    SELECT OrderDetails.value('(/order/item/text())[1]', 'VARCHAR(100)') AS Item
    FROM Orders
    WHERE OrderID = 1;
    ```

  - Extraire plusieurs valeurs à l'aide de `nodes` et `OPENXML` :
    ```sql
    SELECT Item.value('text()', 'VARCHAR(100)') AS Item
    FROM Orders
    CROSS APPLY OrderDetails.nodes('/order/item') AS Items(Item);
    ```

- **Modifier un document XML** :
  ```sql
  UPDATE Orders
  SET OrderDetails.modify('replace value of (/order/quantity/text())[1] with "3"')
  WHERE OrderID = 1;
  ```

---

#### **3. Types Géographiques**

SQL Server prend en charge des types de données spécifiques pour le stockage et la manipulation des données géospatiales, notamment les types **`GEOMETRY`** et **`GEOGRAPHY`**. Ces types sont utilisés pour stocker des informations géographiques et géométriques, telles que des points, des lignes et des polygones.

### **Types de données géographiques**

- **`GEOMETRY`** : Utilisé pour représenter des données géométriques dans un espace plat (2D), comme des lignes, des polygones et des points.
- **`GEOGRAPHY`** : Utilisé pour représenter des données géographiques dans un espace sphérique (basé sur la courbure de la Terre), comme des points, des lignes et des polygones sur la surface terrestre.

##### **Exemples d'utilisation des types géographiques**

- **Création d'une colonne de type géographique** :

  ```sql
  CREATE TABLE Locations (
      LocationID INT PRIMARY KEY,
      Location GEOGRAPHY
  );
  ```

- **Insertion de données géographiques** :

  ```sql
  INSERT INTO Locations (LocationID, Location)
  VALUES (1, GEOGRAPHY::STPointFromText('POINT(-122.360 47.656)', 4326));
  ```

- **Interrogation des données géographiques** :
  Vous pouvez utiliser les méthodes intégrées de SQL Server pour interroger des données géographiques.

  - Calculer la distance entre deux points géographiques :

    ```sql
    SELECT Location.STDistance(GEOGRAPHY::STPointFromText('POINT(-122.350 47.650)', 4326)) AS Distance
    FROM Locations
    WHERE LocationID = 1;
    ```

  - Vérifier si un point se trouve à l'intérieur d'un polygone géographique :
    ```sql
    DECLARE @polygon GEOGRAPHY = GEOGRAPHY::STGeomFromText('POLYGON((-122.362 47.656, -122.359 47.656, -122.359 47.654, -122.362 47.654, -122.362 47.656))', 4326);
    SELECT Location.STWithin(@polygon) AS IsInside
    FROM Locations
    WHERE LocationID = 1;
    ```

---

#### **4. Types de données supplémentaires**

##### **4.1. Type `VARBINARY`**

Le type **`VARBINARY`** est utilisé pour stocker des données binaires. Il peut contenir des fichiers ou d'autres types de données binaires. Ce type est souvent utilisé pour le stockage de documents, images ou fichiers binaires.

- **Exemple d'insertion de données binaires** :

  ```sql
  CREATE TABLE Documents (
      DocumentID INT PRIMARY KEY,
      DocumentData VARBINARY(MAX)
  );

  INSERT INTO Documents (DocumentID, DocumentData)
  VALUES (1, 0x54686973206973206120626C6F622066696C65);  -- Hexadecimal data
  ```

##### **4.2. Type `TIMESTAMP`**

Le type **`TIMESTAMP`** dans SQL Server est utilisé pour stocker un nombre unique qui est mis à jour chaque fois qu'une ligne est modifiée. Il est souvent utilisé pour la gestion de la concurrence.

- **Exemple de création d'une table avec un `TIMESTAMP`** :
  ```sql
  CREATE TABLE AuditLogs (
      LogID INT PRIMARY KEY,
      Action VARCHAR(100),
      Timestamp TIMESTAMP
  );
  ```

##### **4.3. Type `MONEY` et `SMALLMONEY`**

Les types **`MONEY`** et **`SMALLMONEY`** sont utilisés pour stocker des valeurs monétaires. `MONEY` a une précision plus grande que `SMALLMONEY`.

- **Exemple d'insertion avec le type `MONEY`** :

  ```sql
  CREATE TABLE Transactions (
      TransactionID INT PRIMARY KEY,
      Amount MONEY
  );

  INSERT INTO Transactions (TransactionID, Amount)
  VALUES (1, 100.50);
  ```

---

#### **Résumé des types particuliers dans SQL Server**

| **Type de Données**      | **Description**                                                    | **Exemple d'utilisation**                                          |
| ------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `JSON`                   | Stockage de données au format JSON.                                | `NVARCHAR(MAX)` avec fonctions `JSON_VALUE`, `OPENJSON`, etc.      |
| `XML`                    | Stockage et manipulation de documents XML.                         | `XML` avec méthodes XQuery, `value()`, `modify()`, etc.            |
| `GEOMETRY` / `GEOGRAPHY` | Stockage et manipulation de données géographiques et géométriques. | `GEOGRAPHY::STPointFromText()`, `STDistance()`, `STWithin()`, etc. |
| `VARBINARY`              | Stockage de données binaires.                                      | `VARBINARY(MAX)` pour documents ou fichiers binaires.              |
| `MONEY` / `SMALLMONEY`   | Stockage de valeurs monétaires.                                    | `MONEY` pour les montants d'argent.                                |
| `TIMESTAMP`              | Gère les versions des lignes pour la concurrence.                  | Suivi des changements avec un champ `TIMESTAMP`.                   |

Ces types particuliers de données permettent à SQL Server d’offrir une plus grande flexibilité pour gérer des données complexes, comme des documents JSON ou XML, des informations géographiques ou géométriques, ou des données binaires, en fonction des besoins de votre application.

#### **4. Le type `ROWVERSION` dans SQL Server**

Le type **`ROWVERSION`** (anciennement appelé **`TIMESTAMP`**) est un type de données particulier dans SQL Server qui est utilisé principalement pour la gestion de la concurrence optimiste. Il est un mécanisme utile pour suivre les modifications dans une table sans avoir besoin d'utiliser des verrous, en permettant de détecter si une ligne a été modifiée depuis qu'elle a été lue.

Le champ **`ROWVERSION`** est un type de données binaire qui génère un numéro unique et croissant à chaque modification d'une ligne. Chaque fois qu'une ligne est insérée ou mise à jour, SQL Server génère un nouveau **`ROWVERSION`** pour cette ligne.

#### **Principaux points à propos de `ROWVERSION`** :

- **Type de données binaire** : Le type `ROWVERSION` est stocké sous forme de **`BINARY(8)`** (8 octets).
- **Valeur auto-générée** : SQL Server gère automatiquement la génération des valeurs de `ROWVERSION` lorsque des modifications sont apportées à une ligne. Vous n'avez pas besoin de l'assigner manuellement.
- **Unicité** : La valeur de `ROWVERSION` est unique dans le cadre d'une instance SQL Server, ce qui permet de détecter de manière fiable les modifications apportées aux lignes.
- **Concurrence optimiste** : `ROWVERSION` est souvent utilisé dans un contexte de gestion de la concurrence optimiste, où les applications vérifient si une ligne a été modifiée avant de la mettre à jour.

---

#### **Exemple d'utilisation de `ROWVERSION`**

##### **1. Création d'une table avec `ROWVERSION`**

Lors de la création d'une table, vous pouvez ajouter une colonne de type `ROWVERSION`. Cette colonne générera automatiquement un identifiant unique chaque fois qu'une ligne est insérée ou mise à jour.

```sql
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName NVARCHAR(100),
    Price DECIMAL(10, 2),
    LastUpdated ROWVERSION
);
```

Dans cet exemple, la colonne `LastUpdated` est de type `ROWVERSION`. À chaque fois qu'une ligne dans cette table est modifiée, SQL Server met automatiquement à jour la valeur de `LastUpdated`.

##### **2. Insertion d'une ligne dans la table**

Lorsque vous insérez une ligne dans la table, vous ne devez pas spécifier la valeur de la colonne `ROWVERSION`. SQL Server s'en charge pour vous.

```sql
INSERT INTO Products (ProductID, ProductName, Price)
VALUES (1, 'Widget', 19.99);
```

##### **3. Mise à jour d'une ligne avec un contrôle de version**

Supposons que vous ayez une application qui souhaite mettre à jour un produit, mais vous souhaitez vous assurer que la ligne n'a pas été modifiée par quelqu'un d'autre entre-temps. Vous pouvez utiliser le champ `ROWVERSION` pour effectuer cette vérification.

1. **Lisez la valeur de `ROWVERSION`** avant de mettre à jour la ligne :

   ```sql
   SELECT ProductID, ProductName, Price, LastUpdated
   FROM Products
   WHERE ProductID = 1;
   ```

   Imaginons que la valeur retournée de `LastUpdated` soit `0x00000000000007D2`.

2. **Mettez à jour la ligne en vérifiant que la valeur de `ROWVERSION` correspond à celle lue** :

   ```sql
   UPDATE Products
   SET Price = 17.99
   WHERE ProductID = 1 AND LastUpdated = 0x00000000000007D2;
   ```

   Si la valeur de `LastUpdated` a changé entre-temps, c'est-à-dire si la ligne a été modifiée par un autre utilisateur ou un autre processus, l'update échouera (aucune ligne ne sera affectée).

##### **4. Utilisation de `ROWVERSION` pour la gestion de la concurrence**

Le mécanisme de concurrence optimiste est un concept où une application vérifie si une ligne a été modifiée avant de l'actualiser, pour éviter d'écraser les modifications d'un autre utilisateur. Par exemple, lorsque plusieurs utilisateurs tentent de mettre à jour une ligne en même temps, chaque utilisateur pourrait récupérer la valeur de `ROWVERSION` au moment où ils accèdent à la ligne. Lorsqu'ils essaient de sauvegarder leurs modifications, ils vérifient si la valeur de `ROWVERSION` a changé. Si elle a changé, cela signifie que quelqu'un d'autre a modifié la ligne, et l'utilisateur peut alors décider de recharger les données ou de gérer le conflit autrement.

---

##### **Différences entre `ROWVERSION` et `TIMESTAMP`**

Bien que le type **`ROWVERSION`** ait été appelé **`TIMESTAMP`** dans les versions antérieures de SQL Server, ils ne représentent pas des **horodatages** dans le sens traditionnel (c'est-à-dire la date et l'heure). Le nom **`TIMESTAMP`** était historiquement utilisé pour ce type, mais cela a été source de confusion, car les utilisateurs s'attendaient à ce que le champ représente un **horodatage** réel.

Dans SQL Server, le type `ROWVERSION` ne stocke pas une date et une heure précises, mais plutôt une valeur binaire unique et croissante qui indique l'ordre des modifications dans une table.

---

#### **Quelques points importants à retenir sur `ROWVERSION`** :

1. **Génération automatique** : SQL Server génère et met à jour automatiquement la valeur `ROWVERSION` à chaque insertion ou mise à jour.
2. **Uniqueness** : Les valeurs `ROWVERSION` sont uniques dans l'ensemble d'une instance SQL Server, ce qui permet d'identifier de manière fiable si une ligne a changé.
3. **Concurrence optimiste** : Utilisé principalement dans les systèmes où plusieurs utilisateurs peuvent accéder et modifier simultanément les mêmes données, `ROWVERSION` permet de gérer efficacement les conflits sans utiliser de verrous.
4. **Non interprétable** : Le champ `ROWVERSION` est un nombre binaire qui ne représente pas une date et ne peut pas être utilisé comme un horodatage.

---

#### **Résumé des caractéristiques du type `ROWVERSION`** :

| **Caractéristique**        | **Détail**                                                                        |
| -------------------------- | --------------------------------------------------------------------------------- |
| **Type de données**        | `BINARY(8)`                                                                       |
| **Valeur auto-générée**    | Oui, mise à jour automatiquement                                                  |
| **Utilisation principale** | Gestion de la concurrence optimiste                                               |
| **Comportement**           | Chaque insertion ou mise à jour génère une nouvelle valeur unique                 |
| **Nom**                    | `ROWVERSION` (anciennement `TIMESTAMP`)                                           |
| **Comparaison**            | Utilisé pour détecter les modifications concurrentes, mais pas un horodatage réel |

Le type `ROWVERSION` est une excellente option pour gérer les mises à jour simultanées de manière efficace, en minimisant les conflits grâce à une méthode de gestion de la concurrence optimiste.
