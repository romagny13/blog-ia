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

---

Si tu souhaites des explications ou des exemples plus détaillés pour un cas particulier (par ex., profiling des performances ou gestion des index), fais-moi signe !