---
category: ORM
title: Dapper
date: 2024-11-27
author: Romagny13
---

# Guide complet sur Dapper

[Dapper Tutorial](https://dappertutorial.net/)

Dapper est un micro-ORM léger et rapide pour .NET, souvent utilisé pour interagir avec des bases de données en SQL tout en minimisant la surcharge d'une solution ORM traditionnelle comme Entity Framework. Dapper permet d’exécuter des requêtes SQL tout en offrant des fonctionnalités pratiques pour la gestion des données. Voici un guide détaillé de son installation et de ses méthodes principales, avec des exemples en C# et SQL.

## 1. Installation de Dapper

1. **Via NuGet** :
   Pour installer Dapper, vous pouvez utiliser NuGet dans Visual Studio ou la CLI .NET. Exécutez la commande suivante :

   ```bash
   dotnet add package Dapper
   ```

   Ou dans le gestionnaire de packages NuGet :

   ```bash
   Install-Package Dapper
   ```

2. **Référence via un projet .NET** :
   Assurez-vous d'ajouter la référence à `Dapper` dans votre projet .NET (console, Web API, etc.) pour commencer à l'utiliser.

---

## Méthodes principales de Dapper

### 1. **Execute**

Exécute une commande SQL qui ne retourne pas de données (par exemple, `INSERT`, `UPDATE`, `DELETE`).

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "UPDATE Users SET Name = @Name WHERE Id = @Id";
    connection.Execute(sql, new { Name = "John", Id = 1 });
}
```

### 2. **ExecuteReader**

Exécute une requête SQL qui retourne un `SqlDataReader`. C'est utile lorsque vous souhaitez récupérer des données de manière plus manuelle.

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "SELECT * FROM Users";
    var reader = connection.ExecuteReader(sql);
    while (reader.Read())
    {
        Console.WriteLine(reader["Name"]);
    }
}
```

### 3. **ExecuteScalar**

Exécute une commande SQL et retourne une seule valeur (par exemple, une agrégation comme `COUNT`, `MAX`).

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "SELECT COUNT(*) FROM Users";
    var count = connection.ExecuteScalar<int>(sql);
    Console.WriteLine($"Number of users: {count}");
}
```

### 4. **Query**

Exécute une requête SQL qui retourne plusieurs lignes, généralement sous forme d'une collection d'objets.

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "SELECT * FROM Users";
    var users = connection.Query<User>(sql).ToList();
    foreach (var user in users)
    {
        Console.WriteLine(user.Name);
    }
}
```

### 5. **QueryFirst / QueryFirstOrDefault**

Exécute une requête SQL et retourne la première ligne. Si aucune ligne n'est trouvée, `QueryFirstOrDefault` retourne `null`.

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "SELECT TOP 1 * FROM Users";
    var user = connection.QueryFirst<User>(sql);
    Console.WriteLine(user.Name);
}
```

### 6. **QuerySingle / QuerySingleOrDefault**

Exécute une requête SQL et retourne une seule ligne. Si la requête retourne plusieurs résultats, une exception sera levée. `QuerySingleOrDefault` retourne `null` si aucun résultat n'est trouvé.

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "SELECT * FROM Users WHERE Id = @Id";
    var user = connection.QuerySingle<User>(sql, new { Id = 1 });
    Console.WriteLine(user.Name);
}
```

### 7. **QueryMultiple**

Exécute une requête SQL qui retourne plusieurs ensembles de résultats. C'est utile pour récupérer plusieurs jeux de résultats dans une seule requête.

**Exemple** :

```csharp
using (var connection = new SqlConnection(connectionString))
{
    connection.Open();
    string sql = "SELECT * FROM Users; SELECT * FROM Orders";
    using (var multi = connection.QueryMultiple(sql))
    {
        var users = multi.Read<User>().ToList();
        var orders = multi.Read<Order>().ToList();
        Console.WriteLine($"Users: {users.Count}, Orders: {orders.Count}");
    }
}
```

---

## 2. Paramètres de Dapper

### 1. **Anonymous**

Utilisation des objets anonymes pour les paramètres SQL.

**Exemple** :

```csharp
connection.Execute("UPDATE Users SET Name = @Name WHERE Id = @Id", new { Name = "John", Id = 1 });
```

### 2. **Dynamic**

Utilisation de `DynamicParameters` pour une gestion plus flexible des paramètres.

**Exemple** :

```csharp
var parameters = new DynamicParameters();
parameters.Add("@Id", 1);
parameters.Add("@Name", "John");
connection.Execute("UPDATE Users SET Name = @Name WHERE Id = @Id", parameters);
```

### 3. **List**

Vous pouvez passer une liste d'objets comme paramètre.

**Exemple** :

```csharp
var users = new List<User> { new User { Name = "John" }, new User { Name = "Jane" } };
connection.Execute("INSERT INTO Users (Name) VALUES (@Name)", users);
```

### 4. **Table-Valued Parameter**

Dapper supporte les paramètres de type table pour passer plusieurs lignes dans une seule requête.

**Exemple** :

```csharp
var table = new DataTable();
table.Columns.Add("Name", typeof(string));
table.Rows.Add("John");
table.Rows.Add("Jane");

var parameters = new DynamicParameters();
parameters.Add("@Users", table.AsTableValuedParameter("dbo.UserType"));

connection.Execute("INSERT INTO Users (Name) SELECT Name FROM @Users", parameters);
```

---

## 3. Types de Résultats

### 1. **Anonymous**

Dapper peut retourner des résultats sous forme d'objets anonymes.

**Exemple** :

```csharp
var result = connection.Query("SELECT Name FROM Users").First();
Console.WriteLine(result.Name);
```

### 2. **Strongly Typed**

Dapper permet de mapper des résultats vers des types forts (objets définis par l'utilisateur).

**Exemple** :

```csharp
var user = connection.Query<User>("SELECT * FROM Users WHERE Id = @Id", new { Id = 1 }).First();
Console.WriteLine(user.Name);
```

### 3. **Multi-Mapping**

Utilisé pour faire correspondre plusieurs tables ou objets dans une seule requête.

**Exemple** :

```csharp
var sql = "SELECT * FROM Users u JOIN Orders o ON u.Id = o.UserId";
var result = connection.Query<User, Order, User>(
    sql,
    (user, order) =>
    {
        user.Orders = new List<Order> { order };
        return user;
    },
    splitOn: "UserId").ToList();
```

### 4. **Multi-Result**

Permet de récupérer plusieurs types de résultats dans une même requête.

**Exemple** :

```csharp
var sql = "SELECT * FROM Users; SELECT * FROM Orders";
using (var multi = connection.QueryMultiple(sql))
{
    var users = multi.Read<User>().ToList();
    var orders = multi.Read<Order>().ToList();
}
```

### 5. **Multi-Type**

Les résultats peuvent être combinés dans des types distincts.

**Exemple** :

```csharp
var sql = "SELECT * FROM Users; SELECT * FROM Orders";
using (var multi = connection.QueryMultiple(sql))
{
    var users = multi.Read<User>().ToList();
    var orders = multi.Read<Order>().ToList();
    return new { Users = users, Orders = orders };
}
```

---

## 4. Utilitaires

### 1. **Async**

Dapper prend en charge les opérations asynchrones pour une meilleure gestion de la concurrence.

**Exemple** :

```csharp
var users = await connection.QueryAsync<User>("SELECT * FROM Users");
```

### 2. **Buffered**

Par défaut, Dapper "bufferise" les résultats, ce qui signifie qu'il charge tous les résultats en mémoire. Vous pouvez désactiver cela si nécessaire.

**Exemple** :

```csharp
var users = connection.Query<User>("SELECT * FROM Users", buffered: false);
```

### 3. **Transaction**

Dapper fonctionne bien avec les transactions pour assurer l'intégrité des données.

**Exemple** :

```csharp
using (var transaction = connection.BeginTransaction())
{
    connection.Execute("UPDATE Users SET Name = @Name WHERE Id = @Id", new { Name = "John", Id = 1 }, transaction: transaction);


transaction.Commit();
}
```

---

## 5. Stored Procedures avec Dapper

### Exécution d'une procédure stockée (CRUD + SELECT)

**Exemple de CRUD** :

```csharp
var parameters = new DynamicParameters();
parameters.Add("@Name", "John");
parameters.Add("@Id", 1);
connection.Execute("sp_UpdateUser", parameters, commandType: CommandType.StoredProcedure);
```

**Sélection d'un enregistrement** :

```csharp
var parameters = new { Id = 1 };
var user = connection.QueryFirstOrDefault<User>("sp_GetUserById", parameters, commandType: CommandType.StoredProcedure);
```

### Récupérer un ID après insertion

Vous pouvez utiliser une procédure stockée pour récupérer l'ID généré après une insertion.

```sql
CREATE PROCEDURE sp_InsertUser
@Name NVARCHAR(100),
@Id INT OUTPUT
AS
BEGIN
    INSERT INTO Users (Name) VALUES (@Name)
    SET @Id = SCOPE_IDENTITY()
END
```

**C#** :

```csharp
var parameters = new DynamicParameters();
parameters.Add("@Name", "John");
parameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);
connection.Execute("sp_InsertUser", parameters, commandType: CommandType.StoredProcedure);
int id = parameters.Get<int>("@Id");
```

---

## 6. Dapper Contrib

Dapper Contrib simplifie encore plus les opérations CRUD pour les entités en permettant des méthodes comme `Insert`, `Update`, `Delete`, et `Get`.

**Exemple** :

```csharp
connection.Insert(new User { Name = "John" });
var user = connection.Get<User>(1);
connection.Update(user);
connection.Delete(user);
```

---

## 7. Bulk Copy

Dapper ne prend pas en charge directement les opérations de copie en masse, mais vous pouvez utiliser `SqlBulkCopy` pour effectuer une insertion rapide de grandes quantités de données.

**Exemple** :

```csharp
using (var bulkCopy = new SqlBulkCopy(connection))
{
    bulkCopy.DestinationTableName = "Users";
    bulkCopy.WriteToServer(userDataTable);
}
```

---

## 8. Bases de données supportées

Dapper est compatible avec plusieurs bases de données, notamment :

- SQL Server
- SQLite
- PostgreSQL
- MySQL
- Oracle

Assurez-vous d'utiliser le fournisseur ADO.NET approprié pour chaque base de données. Dapper fonctionne avec n'importe quelle base de données compatible avec ADO.NET.

---

## 9. Gestion des relations et Pattern Repository

Le **Pattern Repository** est utilisé pour encapsuler l'accès aux données. En combinaison avec Dapper, vous pouvez centraliser les appels de la base de données et gérer les requêtes complexes plus facilement.

**Exemple** :

```csharp
public class UserRepository
{
    private readonly IDbConnection _connection;

    public UserRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public User GetById(int id)
    {
        return _connection.QueryFirstOrDefault<User>("SELECT * FROM Users WHERE Id = @Id", new { Id = id });
    }

    public IEnumerable<User> GetAll()
    {
        return _connection.Query<User>("SELECT * FROM Users");
    }
}
```

## 10. Type Handlers

Les **Type Handlers** dans Dapper sont utilisés pour gérer les types personnalisés qui ne sont pas pris en charge directement par Dapper lors du mappage des résultats des requêtes SQL vers des objets C#. Ils permettent de contrôler la manière dont Dapper lit et écrit des données dans la base de données, offrant ainsi une plus grande flexibilité pour travailler avec des types complexes, des types non standards ou des types personnalisés qui nécessitent un traitement spécial.

### **Pourquoi utiliser des Type Handlers ?**

Dapper, par défaut, utilise des mappers pour associer les colonnes de la base de données aux propriétés des objets C# en fonction des noms de colonnes et de propriétés. Cependant, il existe des cas où Dapper ne sait pas comment traiter un certain type de donnée ou si vous avez besoin d'une conversion personnalisée (par exemple, convertir une chaîne de caractères en un type `Enum` ou gérer des types `DateTime` dans un format spécifique).

Les **Type Handlers** permettent de résoudre ce problème en fournissant une logique personnalisée de lecture et d'écriture des données dans et depuis la base de données.

### **Création d’un Type Handler**

Un **Type Handler** est une classe qui implémente l’interface `SqlMapper.ITypeHandler`. Vous devez définir deux méthodes principales :

1. **SetValue** : Cette méthode est utilisée pour définir la valeur d'un paramètre de la requête SQL (c'est-à-dire pour convertir un type C# en un type compréhensible par la base de données).
2. **Parse** : Cette méthode est utilisée pour lire une valeur depuis la base de données et la convertir en un type C#.

### **Exemple d’un Type Handler personnalisé**

Supposons que vous ayez une base de données qui stocke des valeurs `DateTime` sous forme de chaînes de caractères dans un format spécifique (`yyyy-MM-dd HH:mm:ss`), mais vous souhaitez que Dapper gère cela comme un `DateTime` en C#.

Voici un exemple de type handler pour ce cas :

```csharp
public class CustomDateTimeHandler : SqlMapper.TypeHandler<DateTime>
{
    public override void SetValue(IDbDataParameter parameter, DateTime value)
    {
        // Convertir DateTime en chaîne dans le format souhaité avant d'insérer dans la base
        parameter.Value = value.ToString("yyyy-MM-dd HH:mm:ss");
    }

    public override DateTime Parse(object value)
    {
        // Convertir la chaîne de la base de données en DateTime
        return DateTime.ParseExact((string)value, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
    }
}
```

Dans cet exemple, nous avons créé un `CustomDateTimeHandler` qui gère la conversion des objets `DateTime` entre la base de données et le modèle C#. Le paramètre est converti en chaîne lors de l'insertion et converti en `DateTime` lors de la lecture.

### **Enregistrement d'un Type Handler**

Une fois le type handler créé, vous devez l'enregistrer auprès de Dapper. Cela permet à Dapper de savoir quel type handler utiliser pour les types personnalisés lors de l'exécution des requêtes.

Voici comment enregistrer un type handler :

```csharp
SqlMapper.AddTypeHandler(new CustomDateTimeHandler());
```

Cela signifie que Dapper utilisera maintenant le `CustomDateTimeHandler` chaque fois qu’il rencontrera un `DateTime` dans la base de données.

### **Utilisation d’un Type Handler dans une requête**

Une fois le type handler enregistré, vous pouvez l'utiliser lors de l'exécution d'une requête SQL. Dapper appliquera automatiquement la logique du handler lors de la lecture ou de l’écriture des données.

**Exemple** :

```csharp
var users = connection.Query<User>("SELECT * FROM Users");
```

Si la colonne `DateOfBirth` dans la base de données est de type `VARCHAR` mais que vous souhaitez la traiter comme un `DateTime`, Dapper utilisera le `CustomDateTimeHandler` pour gérer la conversion.

### **Exemple avec Enum**

Un autre exemple courant est l’utilisation des `Enum`. Dapper ne sait pas comment manipuler automatiquement les `Enum` lorsqu'ils sont stockés sous forme de `int` dans la base de données. Un type handler peut être utilisé pour gérer cela.

Supposons que vous ayez un `Enum` pour représenter le statut d'un utilisateur (`Active`, `Inactive`, `Suspended`), et que ce statut soit stocké sous forme d'entier dans la base de données :

```csharp
public enum UserStatus
{
    Active = 1,
    Inactive = 2,
    Suspended = 3
}
```

Vous pouvez créer un type handler pour gérer cette conversion :

```csharp
public class EnumTypeHandler : SqlMapper.TypeHandler<UserStatus>
{
    public override void SetValue(IDbDataParameter parameter, UserStatus value)
    {
        parameter.Value = (int)value;  // Convertir l'enum en entier
    }

    public override UserStatus Parse(object value)
    {
        return (UserStatus)Enum.ToObject(typeof(UserStatus), value);  // Convertir l'entier en enum
    }
}
```

Une fois le type handler créé, vous l'enregistrez de la même manière :

```csharp
SqlMapper.AddTypeHandler(new EnumTypeHandler());
```

### **Utilisation avec des types personnalisés (classes complexes)**

Les Type Handlers peuvent également être utilisés pour des types personnalisés. Par exemple, si vous avez une classe `Money` qui contient une valeur et une devise, vous pouvez créer un type handler pour manipuler ce type dans Dapper.

Voici un exemple d'un type `Money` :

```csharp
public class Money
{
    public decimal Amount { get; set; }
    public string Currency { get; set; }
}
```

Et un type handler pour `Money` :

```csharp
public class MoneyHandler : SqlMapper.TypeHandler<Money>
{
    public override void SetValue(IDbDataParameter parameter, Money value)
    {
        parameter.Value = $"{value.Amount} {value.Currency}";
    }

    public override Money Parse(object value)
    {
        var str = (string)value;
        var parts = str.Split(' ');
        return new Money
        {
            Amount = decimal.Parse(parts[0]),
            Currency = parts[1]
        };
    }
}
```

L'enregistrement du type handler se fait comme d'habitude :

```csharp
SqlMapper.AddTypeHandler(new MoneyHandler());
```

### **Gestion de Type Handlers avec des procédures stockées**

Lors de l’utilisation de procédures stockées, vous pouvez appliquer des type handlers pour les paramètres d’entrée et de sortie, ce qui est utile lorsqu’une procédure stockée retourne des types personnalisés ou des objets complexes. Par exemple, si une procédure retourne une colonne de type `Money`, le type handler sera utilisé pour convertir les résultats avant de les mapper.

```csharp
var result = connection.Query<Money>("EXEC GetTotalAmount @UserId", new { UserId = 123 }).FirstOrDefault();
```

### **Conclusion**

Les **Type Handlers** dans Dapper offrent une grande flexibilité pour gérer des types de données complexes ou non standard entre C# et la base de données. Ils sont particulièrement utiles lorsque vous travaillez avec des types comme des `Enum`, des classes personnalisées, des dates dans des formats spécifiques ou des types non gérés directement par Dapper. Leur utilisation permet de garder votre code propre, maintenable et extensible sans avoir à écrire manuellement des conversions répétitives.

## 11. Bonnes pratiques

Voici quelques recommandations et bonnes pratiques collectées auprès des développeurs utilisant Dapper, qui peuvent vous aider à tirer le meilleur parti de cette bibliothèque tout en optimisant vos performances et la lisibilité de votre code :

### 1. **Utiliser les Types Forts (Strongly Typed) pour les Résultats**

Bien que Dapper prenne en charge les résultats anonymes, il est recommandé d'utiliser des types forts (les classes définies) pour une meilleure lisibilité, une gestion plus facile des erreurs et un mappage automatique des colonnes aux propriétés des objets. Cela permet également de bénéficier de l'auto-complétion et de la validation de type lors du développement.

**Exemple** :

```csharp
var users = connection.Query<User>("SELECT * FROM Users").ToList();
```

Cela améliore la maintenabilité et réduit les erreurs de type.

### 2. **Paramétrer les Requêtes SQL**

Utiliser des paramètres dans vos requêtes SQL plutôt que de concaténer des chaînes pour éviter les attaques par injection SQL. Dapper permet une gestion facile des paramètres via des objets anonymes ou `DynamicParameters`.

**Exemple** :

```csharp
var user = connection.QuerySingle<User>("SELECT * FROM Users WHERE Id = @Id", new { Id = 1 });
```

Cela améliore la sécurité et la clarté du code.

### 3. **Utiliser `QueryMultiple` pour Récupérer Plusieurs Ensembles de Résultats**

Si vous devez exécuter plusieurs requêtes SQL dans une seule transaction, utilisez `QueryMultiple` pour récupérer plusieurs ensembles de résultats à partir d'une seule exécution. Cela permet de réduire le nombre de requêtes envoyées au serveur de base de données.

**Exemple** :

```csharp
var sql = "SELECT * FROM Users; SELECT * FROM Orders";
using (var multi = connection.QueryMultiple(sql))
{
    var users = multi.Read<User>().ToList();
    var orders = multi.Read<Order>().ToList();
}
```

Cela est particulièrement utile pour les rapports ou lorsque vous devez récupérer des données liées dans une seule requête.

### 4. **Optimisation des Performances avec `Buffered: false`**

Par défaut, Dapper "bufferise" tous les résultats en mémoire. Pour des ensembles de données très volumineux, vous pouvez désactiver cette fonctionnalité en passant `buffered: false`. Cela permet à Dapper de commencer à traiter les résultats avant de récupérer toute la requête, ce qui peut améliorer les performances pour les requêtes sur de grandes tables.

**Exemple** :

```csharp
var users = connection.Query<User>("SELECT * FROM Users", buffered: false);
foreach (var user in users)
{
    Console.WriteLine(user.Name);
}
```

### 5. **Transactions pour Assurer la Cohérence des Données**

Si vous effectuez plusieurs mises à jour ou inserts qui doivent être traitées comme une seule unité de travail, utilisez des transactions. Dapper facilite la gestion des transactions en les passant à chaque commande SQL.

**Exemple** :

```csharp
using (var transaction = connection.BeginTransaction())
{
    connection.Execute("UPDATE Users SET Name = @Name WHERE Id = @Id", new { Name = "John", Id = 1 }, transaction);
    connection.Execute("UPDATE Orders SET Status = 'Processed' WHERE UserId = @Id", new { Id = 1 }, transaction);
    transaction.Commit();
}
```

Cela garantit que toutes les modifications se produisent ou sont annulées en même temps.

### 6. **Utiliser `DynamicParameters` pour une Gestion Flexible des Paramètres**

Pour des requêtes plus complexes, vous pouvez utiliser `DynamicParameters` pour ajouter dynamiquement des paramètres à vos commandes SQL. Cela est particulièrement utile lorsque le nombre de paramètres n'est pas connu à l'avance ou varie selon la situation.

**Exemple** :

```csharp
var parameters = new DynamicParameters();
parameters.Add("@Name", "John");
parameters.Add("@Age", 30);
connection.Execute("INSERT INTO Users (Name, Age) VALUES (@Name, @Age)", parameters);
```

Cela vous permet de travailler plus facilement avec des données dynamiques sans avoir à ajuster manuellement vos requêtes.

### 7. **Gérer les Résultats avec `SplitOn` pour le Multi-Mapping**

Lorsque vous travaillez avec des jointures entre plusieurs tables (par exemple, un utilisateur et ses commandes), vous pouvez utiliser `SplitOn` pour indiquer à Dapper où diviser les résultats dans les objets retournés.

**Exemple** :

```csharp
var sql = "SELECT * FROM Users u JOIN Orders o ON u.Id = o.UserId";
var usersWithOrders = connection.Query<User, Order, User>(
    sql,
    (user, order) =>
    {
        user.Orders = new List<Order> { order };
        return user;
    },
    splitOn: "UserId").ToList();
```

Cela vous permet de mapper plusieurs objets à partir de résultats combinés sans confusion.

### 8. **Utilisation des Requêtes Asynchrones (`QueryAsync`, `ExecuteAsync`)**

Pour des applications hautement performantes et réactives, surtout dans des environnements web ou de services, utilisez les méthodes asynchrones de Dapper. Cela permet de ne pas bloquer le thread principal pendant l'exécution de la requête SQL.

**Exemple** :

```csharp
var users = await connection.QueryAsync<User>("SELECT * FROM Users");
```

Cela garantit que votre application reste réactive tout en effectuant des opérations de base de données intensives.

### 9. **Utiliser Dapper Contrib pour des Opérations CRUD Simples**

Si vous devez effectuer des opérations de base (CRUD) sur des entités, Dapper Contrib peut simplifier considérablement le code en vous offrant des méthodes comme `Insert`, `Update`, `Delete` et `Get` sans avoir besoin d'écrire des requêtes SQL manuelles.

**Exemple** :

```csharp
connection.Insert(new User { Name = "John" });
var user = connection.Get<User>(1);
connection.Update(user);
connection.Delete(user);
```

Cela réduit la complexité pour des cas d'utilisation simples et permet de se concentrer davantage sur la logique métier.

### 10. **Optimisation des Requêtes avec `QueryFirstOrDefault` et `QuerySingleOrDefault`**

Si vous vous attendez à un seul enregistrement dans le résultat, utilisez `QueryFirstOrDefault` ou `QuerySingleOrDefault` pour récupérer directement un seul objet au lieu d’une liste.

**Exemple** :

```csharp
var user = connection.QueryFirstOrDefault<User>("SELECT * FROM Users WHERE Id = @Id", new { Id = 1 });
```

Cela est plus clair et évite d'avoir à manipuler des listes lorsque vous n'en avez pas besoin.

---

## Autres Bonnes Pratiques

- **Éviter les Requêtes Trop Complexes dans les Contrôleurs** : Essayez de centraliser les requêtes complexes dans des services ou des repositories pour améliorer la maintenabilité et la lisibilité du code.
- **Optimiser les Requêtes avec des Index** : Lorsque vous travaillez avec de grandes bases de données, assurez-vous que vos tables sont bien indexées. Cela réduira considérablement le temps d'exécution des requêtes, en particulier les `JOIN` et `WHERE`.

- **Utilisation de `Bulk Insert` pour de Grandes Quantités de Données** : Si vous devez insérer ou mettre à jour un grand nombre de lignes, utilisez `SqlBulkCopy` ou un autre mécanisme de chargement en masse pour améliorer les performances.

En appliquant ces bonnes pratiques, vous optimiserez la performance, la lisibilité et la maintenabilité de votre code avec Dapper.
