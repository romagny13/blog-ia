---
category: SQL
title: Guide général SQL
date: 2024-11-26
author: Romagny13
---

# Guide général SQL : Commandes essentielles et spécifiques

Ce guide couvre les commandes SQL fondamentales applicables à **SQL Server**, **MySQL**, et **PostgreSQL**. Des notes spécifiques sont incluses pour chaque SGBD (Système de Gestion de Base de Données) si nécessaire.

---

## **1. Commandes de base pour les tables**

### **Créer une table (`CREATE TABLE`)**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Auto-incrément (MySQL : AUTO_INCREMENT)
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- **MySQL** : Utilise `AUTO_INCREMENT` pour les colonnes auto-incrémentées.
- **PostgreSQL** : Utilise `SERIAL` ou `GENERATED AS IDENTITY`.
- **SQL Server** : Utilise `IDENTITY(1,1)` pour les colonnes auto-incrémentées.

---

### **Modifier une table (`ALTER TABLE`)**

#### Ajouter une colonne

```sql
ALTER TABLE users ADD COLUMN age INT;
```

#### Modifier une colonne

```sql
ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(100); -- PostgreSQL
ALTER TABLE users MODIFY COLUMN username VARCHAR(100); -- MySQL
ALTER TABLE users ALTER COLUMN username NVARCHAR(100); -- SQL Server
```

#### Supprimer une colonne

```sql
ALTER TABLE users DROP COLUMN age;
```

---

### **Supprimer une table (`DROP TABLE`)**

```sql
DROP TABLE users;
```

---

### **Renommer une table**

```sql
ALTER TABLE users RENAME TO customers; -- PostgreSQL
RENAME TABLE users TO customers; -- MySQL
EXEC sp_rename 'users', 'customers'; -- SQL Server
```

---

## **2. Commandes de manipulation de données (DML)**

### **Insertion de données (`INSERT`)**

#### Une seule ligne

```sql
INSERT INTO users (username, email) VALUES ('JohnDoe', 'john@example.com');
```

#### Plusieurs lignes

```sql
INSERT INTO users (username, email) VALUES
('JaneDoe', 'jane@example.com'),
('MarkSmith', 'mark@example.com');
```

#### Copier des données d'une autre table

```sql
INSERT INTO users (username, email)
SELECT name, contact FROM old_users;
```

---

### **Mise à jour des données (`UPDATE`)**

```sql
UPDATE users
SET email = 'new_email@example.com'
WHERE username = 'JohnDoe';
```

---

### **Suppression de données (`DELETE`)**

```sql
DELETE FROM users
WHERE username = 'JohnDoe';
```

---

### **Lecture des données (`SELECT`)**

#### Basique

```sql
SELECT * FROM users;
```

#### Avec condition

```sql
SELECT username, email
FROM users
WHERE created_at > '2023-01-01';
```

#### Ordre et limites

```sql
SELECT username
FROM users
ORDER BY created_at DESC
LIMIT 10; -- PostgreSQL, MySQL
SELECT TOP 10 username FROM users; -- SQL Server
```

---

### **Bulk Operations**

#### `INSERT INTO ... SELECT` pour insérer en masse

```sql
INSERT INTO new_table (col1, col2)
SELECT col1, col2 FROM existing_table;
```

#### Charger un fichier CSV

- **MySQL** :

```sql
LOAD DATA INFILE '/path/to/file.csv' INTO TABLE users
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

- **PostgreSQL** :

```sql
COPY users(username, email)
FROM '/path/to/file.csv'
DELIMITER ',' CSV HEADER;
```

- **SQL Server** :

```sql
BULK INSERT users
FROM 'C:\path\to\file.csv'
WITH (FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');
```

---

## **3. Fonctions et procédures**

### **Fonctions utilisateur (`CREATE FUNCTION`)**

#### PostgreSQL

```sql
CREATE FUNCTION calculate_age(birthdate DATE) RETURNS INT AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birthdate));
END;
$$ LANGUAGE plpgsql;
```

#### SQL Server

```sql
CREATE FUNCTION calculate_age(@birthdate DATE)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @birthdate, GETDATE());
END;
```

---

### **Procédures stockées (`CREATE PROCEDURE`)**

#### MySQL

```sql
DELIMITER //
CREATE PROCEDURE AddUser (IN username VARCHAR(50), IN email VARCHAR(255))
BEGIN
    INSERT INTO users (username, email) VALUES (username, email);
END //
DELIMITER ;
```

#### SQL Server

```sql
CREATE PROCEDURE AddUser
    @username NVARCHAR(50),
    @email NVARCHAR(255)
AS
BEGIN
    INSERT INTO users (username, email) VALUES (@username, @email);
END;
```

#### PostgreSQL

```sql
CREATE OR REPLACE PROCEDURE add_user(username VARCHAR, email VARCHAR)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO users (username, email) VALUES (username, email);
END;
$$;
```

---

### **Exécuter une procédure**

```sql
CALL AddUser('JohnDoe', 'john@example.com'); -- MySQL, PostgreSQL
EXEC AddUser 'JohnDoe', 'john@example.com'; -- SQL Server
```

---

## **4. Commandes de gestion de base de données**

### **Créer une base de données**

```sql
CREATE DATABASE my_database;
```

### **Supprimer une base de données**

```sql
DROP DATABASE my_database;
```

### **Changer de base de données**

```sql
USE my_database; -- MySQL, SQL Server
\c my_database; -- PostgreSQL
```

---

## **5. Points spécifiques et bonnes pratiques**

### **Transactions**

- **Commencer une transaction :**

```sql
BEGIN; -- PostgreSQL
START TRANSACTION; -- MySQL
BEGIN TRANSACTION; -- SQL Server
```

- **Confirmer ou annuler une transaction :**

```sql
COMMIT;
ROLLBACK;
```

### **Indexation**

```sql
CREATE INDEX idx_username ON users(username);
```

### **Jointures**

```sql
SELECT u.username, o.order_id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

## **6. Jointures en SQL**

Les jointures permettent de combiner des données provenant de plusieurs tables en fonction d’une condition. Elles sont essentielles pour travailler avec des bases de données relationnelles.

### **Types de jointures**

#### **1. INNER JOIN**

Récupère uniquement les lignes qui correspondent dans les deux tables.

```sql
SELECT users.username, orders.order_id, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

#### **2. LEFT JOIN (ou LEFT OUTER JOIN)**

Récupère toutes les lignes de la table de gauche, même si aucune correspondance n’existe dans la table de droite.

```sql
SELECT users.username, orders.order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

- **Résultat** : Les utilisateurs sans commandes afficheront `NULL` pour `order_id`.

#### **3. RIGHT JOIN (ou RIGHT OUTER JOIN)**

Récupère toutes les lignes de la table de droite, même si aucune correspondance n’existe dans la table de gauche.

```sql
SELECT users.username, orders.order_id
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```

#### **4. FULL OUTER JOIN**

Récupère toutes les lignes des deux tables, même si elles n’ont pas de correspondance.

```sql
SELECT users.username, orders.order_id
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
```

- **PostgreSQL et SQL Server** : Supportent directement `FULL OUTER JOIN`.
- **MySQL** : Non supporté directement. Utiliser une combinaison de `LEFT JOIN` et `UNION`.

---

### **Jointures multiples**

Vous pouvez joindre plus de deux tables en les enchaînant.

```sql
SELECT u.username, o.order_id, p.product_name
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN products p ON o.product_id = p.id;
```

---

## **7. Sous-requêtes (Subqueries)**

Les sous-requêtes sont des requêtes imbriquées dans une autre requête. Elles sont utiles pour isoler des calculs ou des sélections.

### **1. Sous-requête dans le `SELECT`**

Permet d'effectuer des calculs pour chaque ligne.

```sql
SELECT username,
       (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count
FROM users;
```

### **2. Sous-requête dans le `WHERE`**

Permet de filtrer en fonction d’un résultat spécifique.

```sql
SELECT username
FROM users
WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 100
);
```

- **Explications** :
  - La sous-requête récupère les `user_id` des commandes supérieures à 100.
  - La requête principale filtre les utilisateurs ayant ces IDs.

### **3. Sous-requête dans le `FROM` (Vue temporaire)**

Permet de créer une table temporaire.

```sql
SELECT avg_order.user_id, avg_order.avg_amount
FROM (
    SELECT user_id, AVG(amount) AS avg_amount
    FROM orders
    GROUP BY user_id
) AS avg_order
WHERE avg_order.avg_amount > 50;
```

### **4. Correlated Subquery (Sous-requête corrélée)**

La sous-requête est exécutée pour chaque ligne de la requête principale.

```sql
SELECT username
FROM users u
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.user_id = u.id AND o.amount > 100
);
```

---

## **8. Fonctions avancées et astuces**

### **1. Groupes et agrégats**

Les fonctions d’agrégation permettent de travailler avec des groupes de données.

#### **Groupement avec `GROUP BY`**

```sql
SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
FROM orders
GROUP BY user_id;
```

#### **Filtrer les groupes avec `HAVING`**

```sql
SELECT user_id, SUM(amount) AS total_spent
FROM orders
GROUP BY user_id
HAVING total_spent > 500;
```

---

### **2. CTE (Common Table Expressions)**

Simplifie les requêtes complexes.

#### Exemple CTE pour PostgreSQL et SQL Server

```sql
WITH UserOrders AS (
    SELECT user_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY user_id
)
SELECT u.username, o.order_count
FROM users u
JOIN UserOrders o ON u.id = o.user_id;
```

- **Avantages :** Lisibilité accrue et réutilisation.

---

### **3. Fenêtres analytiques**

Permet d’effectuer des calculs sur des groupes sans les regrouper.

#### Exemple : Rang dans un groupe

```sql
SELECT username, amount, RANK() OVER (PARTITION BY user_id ORDER BY amount DESC) AS rank
FROM orders;
```

---

### **4. Transactions avancées**

Pour les traitements complexes impliquant plusieurs étapes.

```sql
BEGIN; -- PostgreSQL
START TRANSACTION; -- MySQL, SQL Server

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Validation ou annulation
COMMIT; -- Confirme
ROLLBACK; -- Annule
```

---

### **5. Indexation et optimisation**

Créez des index pour accélérer les requêtes sur des colonnes utilisées fréquemment.

```sql
CREATE INDEX idx_username ON users(username);
CREATE UNIQUE INDEX idx_email ON users(email); -- Unicité
```

- **Types d’index :**
  - **B-Tree** (par défaut) : Rapide pour les recherches.
  - **Full-text** : Pour la recherche textuelle (MySQL et PostgreSQL).

---

## **9. Bonnes pratiques pour SQL**

1. **Utilisez des alias pour plus de clarté :**

   ```sql
   SELECT u.username, o.order_id
   FROM users u
   INNER JOIN orders o ON u.id = o.user_id;
   ```

2. **Évitez `SELECT *` dans des requêtes complexes :** Précisez les colonnes pour améliorer la lisibilité et la performance.

3. **Ajoutez des contraintes pour la cohérence des données :**

   ```sql
   CREATE TABLE orders (
       id SERIAL PRIMARY KEY,
       user_id INT NOT NULL REFERENCES users(id),
       amount DECIMAL(10, 2) CHECK (amount >= 0)
   );
   ```

4. **Optimisez avec des index là où c'est pertinent, mais évitez les sur-indexations.**

---

Ce guide couvre les bases et les fonctionnalités avancées pour écrire des requêtes SQL efficaces, quel que soit le SGBD. Si tu as besoin de détails supplémentaires ou d'exemples plus complexes, fais-moi signe !
