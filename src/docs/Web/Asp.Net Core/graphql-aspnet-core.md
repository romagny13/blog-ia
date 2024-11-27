---
category: Web > Asp.Net Core
title: GraphQL
date: 2024-11-27
author: Romagny13
---

# GraphQL avec ASP.NET Core

## 1. Introduction

GraphQL est un langage de requête pour les API, développé par Facebook. Il permet aux clients de spécifier exactement quelles données ils souhaitent obtenir d'une API, évitant ainsi le surcoût des données inutiles. Avec **ASP.NET Core**, il est possible de mettre en œuvre un serveur GraphQL performant et flexible pour des applications web et mobiles.

Ce document explore la mise en place de GraphQL avec ASP.NET Core, le compare avec d'autres solutions d'API comme REST, présente les packages nécessaires, ainsi que des exemples de consommation, de requêtes et de mutations.

## 2. Pourquoi choisir GraphQL avec ASP.NET Core ?

### 2.1. Comparaison avec REST

1. **Flexibilité des requêtes** :

   - **GraphQL** : Le client contrôle précisément les données qu'il souhaite recevoir. Pas de surcharge ou de sous-chargement de données.
   - **REST** : L'API expose des points de terminaison prédéfinis et le client reçoit les données selon ces points, souvent avec trop ou trop peu de données.

2. **Un seul point d'entrée** :

   - **GraphQL** : Une seule URL pour toutes les requêtes, contrairement à REST qui nécessite plusieurs points de terminaison.
   - **REST** : Chaque ressource a son propre point d'entrée (par exemple, `/users`, `/products`).

3. **Efficacité** :

   - **GraphQL** : Moins de requêtes réseau nécessaires, car un seul appel peut récupérer plusieurs ressources.
   - **REST** : Plusieurs appels peuvent être nécessaires pour obtenir des données liées.

4. **Évolution de l'API** :
   - **GraphQL** : Ajout de nouveaux champs et types sans casser les clients existants.
   - **REST** : Peut nécessiter de nouvelles versions ou des changements de version pour l'ajout de fonctionnalités.

### 2.2. Packages nécessaires pour ASP.NET Core

Pour intégrer **GraphQL** dans une application ASP.NET Core, le package principal est **GraphQL.NET**. Voici les étapes pour configurer GraphQL dans ASP.NET Core :

1. **Installation du package** :
   Installe le package **GraphQL** via NuGet :

   ```bash
   dotnet add package GraphQL
   ```

2. **Ajout du service GraphQL dans `Program.cs`** :
   Dans le fichier `Program.cs`, configure GraphQL en ajoutant les services nécessaires :

   ```csharp
   var builder = WebApplication.CreateBuilder(args);

   // Ajout des services
   builder.Services.AddGraphQL(options =>
   {
       options.EnableMetrics = false;
   })
   .AddSystemTextJson() // Utilisation de JSON pour les réponses
   .AddGraphTypes(ServiceLifetime.Scoped); // Enregistrement des types GraphQL

   var app = builder.Build();

   // Configuration du serveur GraphQL
   app.UseRouting();
   app.MapGraphQL();

   app.Run();
   ```

### 2.3. Définir des Types GraphQL

Les types sont au cœur de GraphQL. Voici comment définir un type dans ASP.NET Core avec GraphQL.NET.

1. **Définir un Type** :
   Crée une classe représentant un type de donnée que l'API exposera :

   ```csharp
   public class Book
   {
       public string Title { get; set; }
       public string Author { get; set; }
   }
   ```

2. **Créer un GraphType** :
   Le `GraphType` lie le type .NET au type GraphQL :

   ```csharp
   public class BookType : ObjectGraphType<Book>
   {
       public BookType()
       {
           Field(x => x.Title);
           Field(x => x.Author);
       }
   }
   ```

3. **Définir un Query** :
   Ensuite, crée une requête (query) qui permet d'obtenir les livres :

   ```csharp
   public class Query : ObjectGraphType
   {
       public Query()
       {
           Field<ListGraphType<BookType>>(
               "books",
               resolve: context => new List<Book>
               {
                   new Book { Title = "1984", Author = "George Orwell" },
                   new Book { Title = "To Kill a Mockingbird", Author = "Harper Lee" }
               });
       }
   }
   ```

4. **Enregistrer le GraphType** :
   Ajoute la configuration dans `Program.cs` pour enregistrer ton `Query` et `BookType` :

   ```csharp
   builder.Services.AddScoped<Query>();
   builder.Services.AddScoped<BookType>();
   builder.Services.AddGraphQL(options => options.EnableMetrics = false)
       .AddSystemTextJson()
       .AddGraphTypes(ServiceLifetime.Scoped);
   ```

### 2.4. Consommer GraphQL

Pour consommer une API GraphQL, tu peux utiliser un client HTTP comme **HttpClient** ou des bibliothèques spécialisées comme **GraphQL.Client**.

#### Exemple de consommation d'une requête GraphQL en C# :

Voici un exemple pour interroger l'API GraphQL avec **HttpClient**.

1. **Création de la requête GraphQL** :

   ```csharp
   var query = @"
   query {
       books {
           title
           author
       }
   }";
   ```

2. **Envoi de la requête avec HttpClient** :

   ```csharp
   var client = new HttpClient();
   var requestBody = new StringContent(JsonConvert.SerializeObject(new { query }), Encoding.UTF8, "application/json");
   var response = await client.PostAsync("https://localhost:5001/graphql", requestBody);
   var responseString = await response.Content.ReadAsStringAsync();
   ```

3. **Analyser la réponse** :
   Ensuite, vous pouvez analyser la réponse dans votre application.

### 2.5. Queries et Mutations

#### 2.5.1. Queries

Les **queries** permettent de lire des données à partir de l'API. Par exemple, une requête pour obtenir tous les livres :

```graphql
{
  books {
    title
    author
  }
}
```

#### 2.5.2. Mutations

Les **mutations** permettent de modifier des données. Par exemple, ajouter un nouveau livre :

```graphql
mutation {
  addBook(title: "New Book", author: "Author Name") {
    title
    author
  }
}
```

### 2.6. Comparaison avec d'autres solutions

| Caractéristique          | GraphQL                                                               | REST                                                                        |
| ------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Point d'entrée           | Un seul point d'entrée pour toutes les requêtes                       | Plusieurs points d'entrée, un par ressource                                 |
| Flexibilité des requêtes | Très flexible, permet de demander exactement ce que l'on veut         | Moins flexible, retourne souvent plus de données que nécessaire             |
| Performance              | Moins de requêtes, plus d'efficacité dans l'utilisation du réseau     | Plus de requêtes, parfois redondantes                                       |
| Versionning              | Aucun besoin de versionner l'API, ajout de nouveaux champs sans casse | Les versions d'API peuvent nécessiter de créer de nouveaux points d'entrées |

## 3. Conclusion

GraphQL avec ASP.NET Core offre une solution moderne et efficace pour créer des API flexibles et performantes. En utilisant des packages comme **GraphQL.NET**, il est possible de construire des API puissantes avec des queries et mutations adaptées aux besoins du client. Comparé à REST, GraphQL permet une meilleure gestion des données et des requêtes, offrant ainsi une expérience plus fluide pour les développeurs et les utilisateurs finaux.

## 4. Intégration de GraphQL avec EF Core dans .NET 6+

### 4.1. Étapes pour configurer GraphQL avec EF Core

### 4.1.1. Installer les packages nécessaires

Pour intégrer **GraphQL** avec **EF Core**, vous devez installer les packages nécessaires :

```bash
dotnet add package GraphQL
dotnet add package GraphQL.EntityFramework
dotnet add package Microsoft.EntityFrameworkCore
```

- **GraphQL** : Package principal pour gérer GraphQL.
- **GraphQL.EntityFramework** : Intégration d'EF Core avec GraphQL.
- **Microsoft.EntityFrameworkCore** : Pour la gestion de la base de données avec EF Core.

### 4.2. Configurer EF Core

Commencez par configurer votre **DbContext** et vos entités.

#### 4.2.1. Créer l'entité

```csharp
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
}
```

#### 4.2.2. Configurer le DbContext

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Book> Books { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
```

#### 4.2.3. Configurer la chaîne de connexion dans `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=BooksDb;Trusted_Connection=True;"
  }
}
```

#### 4.2.4. Ajouter le DbContext dans `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

// Ajouter les services à l'application
builder.Services.AddDbContext<AppDbContext>(options =>


 options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.MapGraphQL();
app.Run();
```

### 4.3. Configurer GraphQL avec EF Core

#### 4.3.1. Créer un `GraphType`

```csharp
public class BookType : ObjectGraphType<Book>
{
    public BookType()
    {
        Field(x => x.Id);
        Field(x => x.Title);
        Field(x => x.Author);
    }
}
```

#### 4.3.2. Ajouter la configuration GraphQL avec EF Core

```csharp
builder.Services.AddGraphQL(options =>
{
    options.EnableMetrics = false;
})
.AddSystemTextJson()
.AddEntityFrameworkServices<AppDbContext>()
.AddGraphTypes(ServiceLifetime.Scoped);
```

## 5. Consommer GraphQL avec EF Core

Après avoir configuré le serveur GraphQL avec **EF Core**, vous pouvez désormais interroger vos données directement depuis votre client.

### 5.1. Exécution de requêtes GraphQL

#### 5.1.1. Exemple de requête pour obtenir une liste de livres

Une fois que vous avez configuré les types GraphQL et que vous avez intégré **EF Core**, vous pouvez interroger la base de données pour obtenir des livres avec une requête GraphQL.

Exemple de requête pour obtenir tous les livres :

```graphql
{
  books {
    id
    title
    author
  }
}
```

### 5.2. Exemple de mutation GraphQL

Les mutations permettent de modifier les données dans votre base de données. Par exemple, ajouter un livre :

```graphql
mutation {
  addBook(title: "New Book", author: "New Author") {
    id
    title
    author
  }
}
```

#### 5.2.1. Créer la mutation pour ajouter un livre

Définissez une mutation dans GraphQL pour ajouter un livre à la base de données.

```csharp
public class Mutation : ObjectGraphType
{
    public Mutation()
    {
        Field<BookType>(
            "addBook",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "title" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "author" }
            ),
            resolve: context =>
            {
                var title = context.GetArgument<string>("title");
                var author = context.GetArgument<string>("author");

                var book = new Book
                {
                    Title = title,
                    Author = author
                };

                // Ajouter le livre à la base de données via EF Core
                using (var dbContext = new AppDbContext())
                {
                    dbContext.Books.Add(book);
                    dbContext.SaveChanges();
                }

                return book;
            }
        );
    }
}
```

### 5.3. Tester les requêtes et mutations

Avec votre API GraphQL en place, vous pouvez tester vos requêtes et mutations en utilisant un outil comme **GraphiQL**, **Postman**, ou **Insomnia** pour envoyer des requêtes à votre serveur GraphQL.

Voici comment effectuer une requête dans **GraphiQL** :

1. Démarrez votre serveur ASP.NET Core.
2. Accédez à l'URL de votre serveur GraphQL, généralement quelque chose comme `http://localhost:5000/graphql`.
3. Exécutez vos requêtes et mutations depuis l'interface graphique de **GraphiQL**.

### 5.4. Filtrage et pagination

Une des caractéristiques puissantes de GraphQL est qu'il permet de filtrer et de paginer les résultats facilement. Par exemple, vous pouvez ajouter un argument de pagination pour limiter le nombre de résultats :

```graphql
query {
  books(page: 1, pageSize: 10) {
    id
    title
    author
  }
}
```

Ensuite, dans votre **resolver**, vous pouvez ajouter la logique de pagination en utilisant **EF Core** :

```csharp
public class Query : ObjectGraphType
{
    public Query(AppDbContext dbContext)
    {
        Field<ListGraphType<BookType>>(
            "books",
            arguments: new QueryArguments(
                new QueryArgument<IntGraphType> { Name = "page" },
                new QueryArgument<IntGraphType> { Name = "pageSize" }
            ),
            resolve: context =>
            {
                var page = context.GetArgument<int>("page");
                var pageSize = context.GetArgument<int>("pageSize");

                return dbContext.Books.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            }
        );
    }
}
```

### 5.5. Utilisation de `Async` pour la gestion asynchrone

Lors de l'utilisation d'**EF Core**, il est recommandé d'effectuer des appels asynchrones afin de ne pas bloquer le thread principal. Voici un exemple de requête asynchrone pour obtenir des livres :

```csharp
public class Query : ObjectGraphType
{
    public Query(AppDbContext dbContext)
    {
        Field<ListGraphType<BookType>>(
            "books",
            resolve: async context =>
            {
                return await dbContext.Books.ToListAsync();
            }
        );
    }
}
```

## 6. Meilleures pratiques

Lors de la mise en œuvre de GraphQL dans ASP.NET Core, il est essentiel de suivre certaines meilleures pratiques pour garantir une API performante, sécurisée et maintenable.

### 6.1. Sécurisation de l'API GraphQL

1. **Authentification et autorisation** :
   Utilisez des mécanismes d'authentification comme **JWT** ou **OAuth2** pour sécuriser les points de terminaison GraphQL. Vous pouvez ajouter un middleware dans ASP.NET Core pour vérifier les jetons JWT avant d'exécuter des requêtes GraphQL.

2. **Filtrage des résultats** :
   Protégez votre API contre les attaques de type **Denial of Service (DoS)** en limitant le nombre de données que l'utilisateur peut demander. Utilisez des arguments comme `limit` ou `offset` pour filtrer les résultats.

### 6.2. Utilisation d'outils comme GraphiQL et Postman

- **GraphiQL** est un IDE interactif pour tester les requêtes GraphQL directement dans le navigateur.
- **Postman** et **Insomnia** offrent également une interface pour tester les requêtes GraphQL, permettant de simuler des appels API avec des requêtes et des mutations.

### 6.3. Gestion des erreurs

Assurez-vous de gérer correctement les erreurs dans vos résolveurs. Vous pouvez renvoyer des messages d'erreur personnalisés à l'utilisateur si une erreur se produit lors de l'exécution d'une requête ou d'une mutation.

## 7. Conclusion

L'intégration de **GraphQL** avec **ASP.NET Core** et **Entity Framework Core** permet de créer des API flexibles et puissantes. Vous bénéficiez de la flexibilité de GraphQL, tout en utilisant les avantages de **EF Core** pour la gestion des données. GraphQL offre de nombreux avantages par rapport aux API REST traditionnelles, notamment la possibilité pour le client de spécifier précisément les données qu'il souhaite recevoir, et une gestion plus souple des mutations et des requêtes.

En appliquant les bonnes pratiques, en sécurisant vos API et en optimisant les performances, vous pouvez créer des services backend scalables et performants, adaptés aux besoins de vos utilisateurs.

# Implémentation Avancée de GraphQL avec ASP.NET Core et Entity Framework Core

## Architecture et Meilleures Pratiques

### 1. Configuration Avancée des Types

```csharp
public class BookType : ObjectGraphType<Book>
{
    public BookType()
    {
        Field(x => x.Id).Description("Identifiant unique du livre");
        Field(x => x.Title).Description("Titre du livre")
            .AddValidation(title => !string.IsNullOrWhiteSpace(title), "Le titre ne peut pas être vide");

        Field(x => x.Author).Description("Auteur du livre");

        // Résolution de champs complexes
        Field<ListGraphType<ReviewType>>("reviews")
            .ResolveAsync(async context =>
            {
                var book = context.Source;
                var dbContext = context.RequestServices.GetRequiredService<AppDbContext>();
                return await dbContext.Reviews
                    .Where(r => r.BookId == book.Id)
                    .ToListAsync();
            });
    }
}
```

### 2. Gestion des Erreurs et Validation

```csharp
public class Mutation : ObjectGraphType
{
    public Mutation(AppDbContext dbContext, IValidator<Book> validator)
    {
        Field<BookType>(
            "addBook",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<BookInputType>> { Name = "book" }
            ),
            resolve: async context =>
            {
                try
                {
                    var bookInput = context.GetArgument<Book>("book");

                    // Validation de l'entrée
                    var validationResult = await validator.ValidateAsync(bookInput);
                    if (!validationResult.IsValid)
                    {
                        context.Errors.Add(new ExecutionError(
                            "Échec de validation",
                            validationResult.Errors.Select(e => new Error(e.ErrorMessage)).ToList()
                        ));
                        return null;
                    }

                    // Gestion de la transaction
                    using var transaction = await dbContext.Database.BeginTransactionAsync();
                    try
                    {
                        dbContext.Books.Add(bookInput);
                        await dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return bookInput;
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        context.Errors.Add(new ExecutionError("Échec de l'opération en base de données", ex));
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    context.Errors.Add(new ExecutionError("Échec de la mutation", ex));
                    return null;
                }
            }
        );
    }
}

// Type d'entrée pour la création de livres
public class BookInputType : InputObjectGraphType<Book>
{
    public BookInputType()
    {
        Field(x => x.Title).Description("Titre du livre");
        Field(x => x.Author).Description("Auteur du livre");
    }
}
```

### 3. Capacités Avancées de Requêtes

```csharp
public class Query : ObjectGraphType
{
    public Query(AppDbContext dbContext)
    {
        Field<ListGraphType<BookType>>(
            "books",
            arguments: new QueryArguments(
                new QueryArgument<StringGraphType> { Name = "author" },
                new QueryArgument<IntGraphType> { Name = "page" },
                new QueryArgument<IntGraphType> { Name = "pageSize" },
                new QueryArgument<EnumGraphType<SortOrder>> { Name = "sortOrder" }
            ),
            resolve: async context =>
            {
                var query = dbContext.Books.AsQueryable();

                // Filtrage optionnel
                var author = context.GetArgument<string>("author");
                if (!string.IsNullOrWhiteSpace(author))
                {
                    query = query.Where(b => b.Author.Contains(author));
                }

                // Pagination
                var page = context.GetArgument<int?>("page") ?? 1;
                var pageSize = context.GetArgument<int?>("pageSize") ?? 10;

                // Tri
                var sortOrder = context.GetArgument<SortOrder?>("sortOrder") ?? SortOrder.Ascending;
                query = sortOrder == SortOrder.Ascending
                    ? query.OrderBy(b => b.Title)
                    : query.OrderByDescending(b => b.Title);

                return await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
        );
    }
}

// Énumération pour l'ordre de tri
public enum SortOrder
{
    Ascending,
    Descending
}
```

### 4. Injection de Dépendances et Configuration des Services

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Contexte de base de données
    services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

    // Validation
    services.AddScoped<IValidator<Book>, BookValidator>();

    // Services GraphQL
    services.AddGraphQL(options =>
    {
        options.EnableMetrics = true;
        options.UnhandledExceptionDelegate = context =>
        {
            Console.WriteLine($"Erreur GraphQL : {context.Exception.Message}");
        };
    })
    .AddSystemTextJson()
    .AddErrorInfoProvider(options =>
    {
        options.ExposeExceptionDetails = Environment.IsDevelopment();
    })
    .AddGraphTypes(ServiceLifetime.Scoped);

    // Services spécifiques à GraphQL
    services.AddScoped<Query>();
    services.AddScoped<Mutation>();
    services.AddScoped<BookType>();
}
```

### 5. Optimisation des Performances

```csharp
public class BookDataLoader : BatchDataLoader<int, Book>
{
    private readonly AppDbContext _dbContext;

    public BookDataLoader(
        AppDbContext dbContext,
        IBatchScheduler batchScheduler)
        : base(batchScheduler)
    {
        _dbContext = dbContext;
    }

    protected override async Task<IReadOnlyDictionary<int, Book>> LoadBatchAsync(
        IReadOnlyList<int> keys,
        CancellationToken cancellationToken)
    {
        return await _dbContext.Books
            .Where(b => keys.Contains(b.Id))
            .ToDictionaryAsync(b => b.Id, cancellationToken);
    }
}
```

## Conclusion

Cette implémentation avancée démontre des techniques sophistiquées de GraphQL avec ASP.NET Core et Entity Framework Core, incluant :

- Définitions de types robustes
- Gestion complète des erreurs
- Validation des entrées
- Capacités de requêtes avancées
- Optimisation des performances
- Meilleures pratiques d'injection de dépendances

En utilisant ces techniques, vous pouvez créer des API GraphQL évolutives, maintenables et performantes.

## Packages Nécessaires

Pour mettre en œuvre cette solution, installez les packages suivants :

```bash
dotnet add package GraphQL
dotnet add package GraphQL.EntityFramework
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package FluentValidation
```

## Recommandations Supplémentaires

1. Utilisez toujours la validation côté serveur
2. Gérez les erreurs de manière exhaustive
3. Mettez en place des mécanismes de pagination
4. Utilisez des DataLoaders pour optimiser les requêtes
5. Configurez des métriques et des journaux pour le débogage
