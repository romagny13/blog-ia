---
category: SQL
title: PostgreSQL
date: 2024-11-26
author: Romagny13
---

# **Guide spécifique pour PostgreSQL : Les particularités**

PostgreSQL, souvent surnommé **Postgres**, est une base de données relationnelle open-source robuste, connue pour sa conformité stricte avec les standards SQL et ses fonctionnalités avancées qui la distinguent des autres systèmes (comme MySQL ou SQL Server). Ce guide met l'accent sur ses particularités.

---

## **1. Versions et Installation**

### **1.1. Versions courantes de PostgreSQL**

- PostgreSQL propose des versions communautaires mises à jour tous les ans avec un support prolongé pour les versions LTS.
- Les installations incluent des outils comme **psql** (ligne de commande) et peuvent être enrichies avec des outils tiers.

### **1.2. Installation**

- **Windows/Mac/Linux** :
  - Utilisez les [installateurs officiels](https://www.postgresql.org/download/).
  - Sur Linux, installez via `apt` ou `yum` (exemple pour Ubuntu) :
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```
- **Docker** :
  ```bash
  docker run --name postgres -e POSTGRES_PASSWORD=my_password -d postgres
  ```

---

## **2. Outils pour PostgreSQL**

### **2.1. Outils natifs**

- **psql** : Interface ligne de commande intégrée.
  - Exemple pour se connecter :
    ```bash
    psql -U postgres -d my_database
    ```
- **pgAdmin** : Interface graphique officielle.

### **2.2. Outils tiers**

- **DBeaver** : Interface universelle pour bases de données.
- **TablePlus** : Gestion graphique légère.
- **Postico** : Gestionnaire MacOS spécifique pour PostgreSQL.

---

## **3. Particularités par rapport aux autres bases de données**

### **3.1. Types de données spécifiques**

- **Types JSON et JSONB** : PostgreSQL gère nativement les données JSON.

  - Différence : `JSON` conserve le format d'origine, tandis que `JSONB` est optimisé pour les requêtes.

  ```sql
  CREATE TABLE my_table (
      id SERIAL PRIMARY KEY,
      data JSONB
  );
  INSERT INTO my_table (data) VALUES ('{"key": "value"}');
  SELECT data->>'key' FROM my_table;
  ```

- **Array** : Prise en charge des tableaux.

  ```sql
  CREATE TABLE example (
      id SERIAL PRIMARY KEY,
      tags TEXT[]
  );
  INSERT INTO example (tags) VALUES (ARRAY['tag1', 'tag2']);
  SELECT * FROM example WHERE 'tag1' = ANY(tags);
  ```

- **Range types** : Gérer des plages de valeurs (`int4range`, `tsrange`).
  ```sql
  CREATE TABLE periods (id SERIAL, period tsrange);
  INSERT INTO periods (period) VALUES ('[2024-01-01, 2024-12-31)');
  ```

### **3.2. Contraintes avancées**

- **Exclusion constraints** : Permet de gérer des colonnes avec des conditions complexes (comme éviter des plages de dates qui se chevauchent).
  ```sql
  CREATE TABLE booking (
      id SERIAL PRIMARY KEY,
      room INT,
      period TSRANGE,
      EXCLUDE USING gist (room WITH =, period WITH &&)
  );
  ```

### **3.3. Gestion des séquences**

PostgreSQL utilise des **séquences** pour gérer les colonnes auto-incrémentées (avec `SERIAL` ou `GENERATED`).

- Obtenir la dernière valeur d'une séquence :

  ```sql
  SELECT currval('table_column_seq');
  ```

- Redémarrer une séquence :
  ```sql
  ALTER SEQUENCE table_column_seq RESTART WITH 1;
  ```

---

## **4. Gestion de la sécurité**

### **4.1. Créer un utilisateur**

```sql
CREATE USER my_user WITH PASSWORD 'my_password';
```

### **4.2. Créer une base et donner l'accès**

```sql
CREATE DATABASE my_database;
GRANT ALL PRIVILEGES ON DATABASE my_database TO my_user;
```

### **4.3. Gestion fine des permissions**

PostgreSQL permet des contrôles précis :

```sql
GRANT SELECT, INSERT ON my_table TO my_user;
REVOKE DELETE ON my_table FROM my_user;
```

---

## **5. Sauvegarde et Restauration**

### **5.1. Sauvegarde**

- Sauvegarde complète :
  ```bash
  pg_dump -U postgres my_database > backup.sql
  ```
- Sauvegarde uniquement les données :
  ```bash
  pg_dump -U postgres --data-only my_database > data.sql
  ```

### **5.2. Restauration**

- Restaurer un fichier SQL :

  ```bash
  psql -U postgres -d my_database < backup.sql
  ```

- Restaurer une sauvegarde binaire :
  ```bash
  pg_restore -U postgres -d my_database backup.dump
  ```

---

## **6. Optimisation et Profiling des requêtes**

### **6.1. Analyser une requête**

Utilisez `EXPLAIN` pour examiner un plan d'exécution.

```sql
EXPLAIN SELECT * FROM my_table WHERE id = 10;
```

Pour des statistiques détaillées, ajoutez `ANALYZE` :

```sql
EXPLAIN ANALYZE SELECT * FROM my_table WHERE id = 10;
```

### **6.2. Activer le logging des requêtes lentes**

Dans le fichier `postgresql.conf`, configurez :

```conf
log_min_duration_statement = 500
```

---

## **7. Métadonnées (découverte des objets de la base)**

### **7.1. Lister les tables**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### **7.2. Lister les colonnes**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'my_table';
```

### **7.3. Lister les clés primaires et étrangères**

- Clés primaires :

  ```sql
  SELECT
      kcu.table_name,
      kcu.column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
  WHERE constraint_type = 'PRIMARY KEY';
  ```

- Clés étrangères :
  ```sql
  SELECT
      tc.table_name AS foreign_table,
      kcu.column_name AS foreign_column,
      ccu.table_name AS primary_table,
      ccu.column_name AS primary_column
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
  WHERE constraint_type = 'FOREIGN KEY';
  ```

---

## **8. Transactions et Gestion des erreurs**

### **8.1. Transactions**

PostgreSQL supporte les transactions explicites et implicites.

- Transaction explicite :

  ```sql
  BEGIN;
  INSERT INTO my_table (col1) VALUES ('value1');
  COMMIT;
  ```

- Annuler une transaction :
  ```sql
  ROLLBACK;
  ```

---

## **9. Différences spécifiques par rapport à MySQL et SQL Server**

| **Fonctionnalité**       | **PostgreSQL**                                            | **MySQL**                  | **SQL Server**        |
| ------------------------ | --------------------------------------------------------- | -------------------------- | --------------------- |
| Support JSON             | `JSON` et `JSONB` natifs                                  | Support JSON simple        | JSON uniquement texte |
| Contraintes avancées     | `EXCLUDE`                                                 | Non                        | Non                   |
| Gestion des transactions | Transactions strictes                                     | Plus laxiste               | Transactions strictes |
| Moteurs de stockage      | Unique (MVCC)                                             | Plusieurs (InnoDB, MyISAM) | Unique                |
| Index                    | B-trees, Hash, GIN, GiST                                  | B-trees                    | B-trees               |
| Extensibilité            | Fonctions définies par l'utilisateur, types personnalisés | Très limitée               | Moyenne               |
