---
category: Web > Asp.Net Core > Architecture
title: Pattern CQRS
date: 2024-11-26
author: Romagny13
---

# CQRS dans ASP.NET Core : Avec et sans MediatR, Behaviors et Notifications

### Mise en œuvre de CQRS sans MediatR

L'architecture CQRS (Command Query Responsibility Segregation) sépare les responsabilités de lecture et d'écriture en utilisant deux modèles distincts: les **Commandes** pour les actions qui modifient l'état, et les **Requêtes** pour obtenir des données. Cette séparation permet de mieux gérer les opérations complexes et les mises à jour dans un système.

Dans cet exemple, nous allons créer un système de gestion d'articles. Nous allons définir une **Query** pour obtenir une liste d'articles et une **Command** pour ajouter un article à la base de données.

### 1. Interfaces de base

Nous allons d'abord définir les interfaces de base pour les **Commandes**, **Requêtes** et **Handlers**.

#### Interfaces de Requête et Commande

```csharp
// Représente une requête sans résultat
public interface IRequest { }

// Représente une requête avec un résultat
public interface IRequest<TResult> { }
```

#### Interfaces de Handler

```csharp
// Handler pour une requête sans résultat
public interface IRequestHandler<TRequest> where TRequest : IRequest
{
    Task Handle(TRequest request, CancellationToken cancellationToken);
}

// Handler pour une requête avec un résultat
public interface IRequestHandler<TRequest, TResult> where TRequest : IRequest<TResult>
{
    Task<TResult> Handle(TRequest request, CancellationToken cancellationToken);
}
```

#### Interface Mediator

```csharp
public interface IMediator
{
    Task<TResult> Send<TResult>(IRequest<TResult> request, CancellationToken cancellationToken = default);
}
```

#### Implémentation de Mediator

Le Mediator est responsable de l'invocation du handler correspondant pour chaque requête ou commande. Il utilise le **ServiceProvider** pour résoudre dynamiquement les handlers.

```csharp
public sealed class Mediator : IMediator
{
    private readonly IServiceProvider _provider;

    public Mediator(IServiceProvider provider)
    {
        _provider = provider;
    }

    public async Task Send(IRequest request, CancellationToken cancellationToken = default)
    {
        Type requestType = request.GetType();
        Type[] requestHandlerTypeArgs = { requestType };
        Type requestHandlerType = typeof(IRequestHandler<,>).MakeGenericType(requestHandlerTypeArgs);
        dynamic requestHandler = _provider.GetService(requestHandlerType);
        if (requestHandler == null)
            throw new InvalidOperationException("Unable to resolve " + requestHandlerType.GetType().FullName);

        await requestHandler.Handle((dynamic)request, cancellationToken);
    }

    public async Task<TResult> Send<TResult>(IRequest<TResult> request, CancellationToken cancellationToken = default)
    {
        Type requestType = request.GetType();
        Type[] requestHandlerTypeArgs = { requestType, typeof(TResult) };
        Type requestHandlerType = typeof(IRequestHandler<,>).MakeGenericType(requestHandlerTypeArgs);

        dynamic requestHandler = _provider.GetService(requestHandlerType);
        if (requestHandler == null)
            throw new InvalidOperationException("Unable to resolve " + requestHandlerType.GetType().FullName);

        TResult result = await requestHandler.Handle((dynamic)request, cancellationToken);
        return result;
    }
}
```

### 2. Commande (Add Item)

Créons maintenant une commande pour ajouter un article.

#### **AddItemCommand**

```csharp
public record AddItemCommand(string Name) : IRequest<Guid>;
```

Cette commande prend en paramètre le nom de l'article et retourne un `Guid` représentant l'identifiant de l'article créé.

#### **AddItemCommandHandler**

Le handler qui traite la commande d'ajout.

```csharp
public class AddItemCommandHandler : IRequestHandler<AddItemCommand, Guid>
{
    private readonly ApplicationDbContext _dbContext;

    public AddItemCommandHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(AddItemCommand request, CancellationToken cancellationToken)
    {
        var item = new Item { Name = request.Name };
        _dbContext.Items.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return item.Id;
    }
}
```

### 3. Requête (Get All Items)

Créons une requête pour obtenir tous les articles.

#### **GetAllItemsQuery**

```csharp
public record GetAllItemsQuery : IRequest<List<ItemDto>>;
```

Cette requête retourne une liste de `ItemDto`.

#### **GetAllItemsQueryHandler**

Le handler qui traite la requête de récupération des articles.

```csharp
public class GetAllItemsQueryHandler : IRequestHandler<GetAllItemsQuery, List<ItemDto>>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetAllItemsQueryHandler(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<ItemDto>> Handle(GetAllItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await _dbContext.Items.ToListAsync(cancellationToken);
        return _mapper.Map<List<ItemDto>>(items);
    }
}
```

### 4. Configuration dans `Program.cs` (.NET 6+)

Voici la méthode d'extension permettant de découvrir dynamiquement les handlers dans l'assembly actuel.

```csharp
public static class ServiceCollectionExtensions
{
    public static void RegisterRequestHandlersFromAssembly(this IServiceCollection services, Assembly assembly)
    {
        foreach (var type in assembly.GetExportedTypes())
        {
            if (!type.IsInterface)
            {
                var requestHandlerInterface = type.GetInterfaces()
                    .FirstOrDefault(x => x.IsGenericType && (x.GetGenericTypeDefinition() == typeof(IRequestHandler<,>) || x.GetGenericTypeDefinition() == typeof(IRequestHandler<>)));

                if (requestHandlerInterface != null && services.FirstOrDefault(x => x.ServiceType == requestHandlerInterface) == null)
                {
                    services.AddTransient(requestHandlerInterface, type);
                }
            }
        }
    }
}
```

Maintenant que nous avons défini nos commandes et requêtes, nous allons configurer l'application dans `Program.cs` pour enregistrer les services et les handlers.

```csharp
var builder = WebApplication.CreateBuilder(args);

// Enregistrement des services
builder.Services.AddScoped<IMediator, Mediator>();

// Enregistrement des RequestHandlers depuis l'assembly
builder.Services.RegisterRequestHandlersFromAssembly(Assembly.GetExecutingAssembly());

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
```

### 6. Exemple de Contrôleur

Nous pouvons maintenant utiliser **Mediator** dans un contrôleur pour envoyer des commandes et des requêtes.

#### **ItemsController**

```csharp
[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ItemsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET api/items
    [HttpGet]
    public async Task<ActionResult<List<ItemDto>>> GetAllItems()
    {
        var query = new GetAllItemsQuery();
        var items = await _mediator.Send(query);
        return Ok(items);
    }

    // POST api/items
    [HttpPost]
    public async Task<ActionResult<Guid>> AddItem([FromBody] string name)
    {
        var command = new AddItemCommand(name);
        var itemId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetAllItems), new { id = itemId }, itemId);
    }
}
```

### Conclusion

Dans cet exemple, nous avons implémenté une architecture **CQRS** sans utiliser **MediatR**. Nous avons créé des requêtes et des commandes, ainsi que des handlers pour traiter ces opérations. Le **Mediator** que nous avons implémenté est responsable de l'envoi de ces requêtes et commandes aux handlers correspondants.

De plus, la méthode d'extension `RegisterRequestHandlersFromAssembly` permet d'enregistrer dynamiquement les handlers dans l'application, et la configuration dans **Program.cs** permet de tout intégrer correctement.

Cette approche sans **MediatR** offre un contrôle total sur la façon dont les requêtes et commandes sont traitées tout en maintenant une séparation claire des responsabilités.

### Avec MediatR

### Packages Requis

Avant de commencer, assurez-vous d'installer les packages nécessaires dans votre projet :

1. **MediatR** : pour le traitement des requêtes et commandes.

   ```bash
   dotnet add package MediatR
   ```

2. **AutoMapper** : pour la cartographie entre les entités et les DTOs.

   ```bash
   dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
   ```

3. **FluentValidation** : pour la validation des requêtes.

   ```bash
   dotnet add package FluentValidation
   ```

4. **MediatR.Extensions.FluentValidation** : pour intégrer FluentValidation avec MediatR.
   ```bash
   dotnet add package MediatR.Extensions.FluentValidation
   ```

### 1. Structure de base avec MediatR

Nous allons commencer par intégrer **MediatR** dans un projet **.NET 6+** avec un **DbContext** injecté, suivi du **Repository Pattern**, de **AutoMapper**, de **Validation**, de **Behaviors** et de **Notifications**.

### 2. Commandes et Requêtes avec MediatR

#### **GetAllItemsQuery**

La requête pour obtenir tous les articles.

```csharp
public record GetAllItemsQuery : IRequest<List<ItemDto>>;
```

#### **GetByIdQuery**

Une requête pour obtenir un article par son identifiant.

```csharp
public record GetByIdQuery(Guid Id) : IRequest<ItemDto>;
```

#### **AddItemCommand**

La commande pour ajouter un nouvel article.

```csharp
public record AddItemCommand(string Name) : IRequest<Guid>;
```

### 3. Handlers

#### **GetAllItemsQueryHandler**

Le handler qui traite la requête pour récupérer tous les articles.

```csharp
public class GetAllItemsQueryHandler : IRequestHandler<GetAllItemsQuery, List<ItemDto>>
{
    private readonly IItemRepository _repository;
    private readonly IMapper _mapper;

    public GetAllItemsQueryHandler(IItemRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<ItemDto>> Handle(GetAllItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await _repository.GetAllItemsAsync();
        return _mapper.Map<List<ItemDto>>(items);
    }
}
```

#### **GetByIdQueryHandler**

Le handler pour récupérer un article par son ID.

```csharp
public class GetByIdQueryHandler : IRequestHandler<GetByIdQuery, ItemDto>
{
    private readonly IItemRepository _repository;
    private readonly IMapper _mapper;

    public GetByIdQueryHandler(IItemRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ItemDto> Handle(GetByIdQuery request, CancellationToken cancellationToken)
    {
        var item = await _repository.GetItemByIdAsync(request.Id);
        return _mapper.Map<ItemDto>(item);
    }
}
```

#### **AddItemCommandHandler**

Le handler pour ajouter un nouvel article.

```csharp
public class AddItemCommandHandler : IRequestHandler<AddItemCommand, Guid>
{
    private readonly IItemRepository _repository;

    public AddItemCommandHandler(IItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(AddItemCommand request, CancellationToken cancellationToken)
    {
        var item = new Item { Name = request.Name };
        await _repository.AddItemAsync(item);
        return item.Id;
    }
}
```

### 4. Repository Pattern

Nous utilisons le **Repository Pattern** pour gérer les opérations sur la base de données.

#### **IItemRepository**

L'interface du repository pour les articles.

```csharp
public interface IItemRepository
{
    Task<List<Item>> GetAllItemsAsync();
    Task<Item> GetItemByIdAsync(Guid id);
    Task AddItemAsync(Item item);
}
```

#### **ItemRepository**

La mise en œuvre du repository.

```csharp
public class ItemRepository : IItemRepository
{
    private readonly ApplicationDbContext _context;

    public ItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Item>> GetAllItemsAsync()
    {
        return await _context.Items.ToListAsync();
    }

    public async Task<Item> GetItemByIdAsync(Guid id)
    {
        return await _context.Items.FindAsync(id);
    }

    public async Task AddItemAsync(Item item)
    {
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
    }
}
```

### 5. AutoMapper Configuration

Nous allons configurer **AutoMapper** pour mapper entre nos entités et nos DTOs.

#### **ItemDto**

Le DTO représentant un article.

```csharp
public class ItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
```

#### **MappingProfile**

Le profil de mappage AutoMapper.

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Item, ItemDto>();
    }
}
```

### 6. Validation avec FluentValidation

Nous allons maintenant ajouter de la validation avec **FluentValidation**.

#### **AddItemCommandValidator**

Le validateur pour la commande d'ajout d'article.

```csharp
public class AddItemCommandValidator : AbstractValidator<AddItemCommand>
{
    public AddItemCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
    }
}
```

### 7. Behavior avec MediatR

Nous pouvons utiliser des **Behaviors** pour ajouter des fonctionnalités transversales comme la validation, la journalisation ou la gestion des erreurs. Voici un exemple de **ValidationBehavior**.

#### **ValidationBehavior**

Un comportement qui exécute la validation avant de traiter une requête ou une commande.

```csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IValidator<TRequest> _validator;

    public ValidationBehavior(IValidator<TRequest> validator)
    {
        _validator = validator;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        return await next();
    }
}
```

### 8. Notifications

Les **Notifications** dans MediatR permettent de diffuser des événements après l'exécution d'une commande ou d'une requête. Pour utiliser une notification avec MediatR et la publier via `Publish`, vous devez adapter la notification et son gestionnaire pour être publiées après l'exécution d'une commande ou d'une requête dans le contrôleur. Voici comment procéder :

### 1. Création et gestion des notifications avec MediatR

#### **ItemAddedNotification**

La notification sera toujours la même, elle sera envoyée après l'ajout d'un article.

```csharp
public class ItemAddedNotification : INotification
{
    public Guid ItemId { get; }

    public ItemAddedNotification(Guid itemId)
    {
        ItemId = itemId;
    }
}
```

#### **ItemAddedNotificationHandler**

Le gestionnaire de la notification qui va traiter l'événement lorsque la notification sera publiée.

```csharp
public class ItemAddedNotificationHandler : INotificationHandler<ItemAddedNotification>
{
    public Task Handle(ItemAddedNotification notification, CancellationToken cancellationToken)
    {
        // Exemple : loggez l'ajout de l'article ou effectuez une action, comme envoyer un email
        Console.WriteLine($"Item with ID {notification.ItemId} has been added.");
        return Task.CompletedTask;
    }
}
```

### 2. Modifier le `AddItemCommandHandler` pour publier la notification

Dans votre **AddItemCommandHandler**, après avoir ajouté un article, vous pouvez publier la notification en utilisant `IMediator.Publish`. Cette approche permet de publier des notifications sans avoir à envoyer explicitement la notification dans un handler particulier, ce qui permet de centraliser la logique de notification.

#### **AddItemCommandHandler** mis à jour

```csharp
public class AddItemCommandHandler : IRequestHandler<AddItemCommand, Guid>
{
    private readonly IItemRepository _repository;
    private readonly IMediator _mediator;

    public AddItemCommandHandler(IItemRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<Guid> Handle(AddItemCommand request, CancellationToken cancellationToken)
    {
        var item = new Item { Name = request.Name };
        await _repository.AddItemAsync(item);

        // Publier la notification après l'ajout de l'article
        await _mediator.Publish(new ItemAddedNotification(item.Id), cancellationToken);

        return item.Id;
    }
}
```

Ici, nous avons ajouté la ligne suivante pour publier la notification après l'ajout de l'article :

```csharp
await _mediator.Publish(new ItemAddedNotification(item.Id), cancellationToken);
```

Cela publie la notification, et tout handler enregistré pour cette notification sera exécuté.

### 3. Modification du contrôleur pour utiliser `Publish`

Dans le contrôleur, nous utiliserons la méthode `Publish` de **IMediator** pour envoyer des notifications après la création d'un nouvel article. Cependant, il est essentiel que l'appel à `Publish` soit effectué après l'ajout réussi de l'article pour s'assurer que la notification se déclenche.

#### **ItemsController avec Notification**

Voici comment le contrôleur pourrait ressembler après avoir intégré la notification via `Publish` :

```csharp
[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ItemsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET api/items
    [HttpGet]
    public async Task<ActionResult<List<ItemDto>>> GetAllItems()
    {
        var query = new GetAllItemsQuery();
        var items = await _mediator.Send(query);
        return Ok(items);
    }

    // GET api/items/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ItemDto>> GetItemById(Guid id)
    {
        var query = new GetByIdQuery(id);
        var item = await _mediator.Send(query);
        return item != null ? Ok(item) : NotFound();
    }

    // POST api/items
    [HttpPost]
    public async Task<ActionResult<Guid>> AddItem([FromBody] AddItemCommand command)
    {
        var itemId = await _mediator.Send(command);

        // Après l'ajout de l'article, la notification sera automatiquement publiée dans le handler
        await _mediator.Publish(new ItemAddedNotification(itemId));

        return CreatedAtAction(nameof(GetItemById), new { id = itemId }, itemId);
    }
}
```

### Résumé

Voici ce que nous avons accompli :

1. Création d'une **notification** (`ItemAddedNotification`) pour informer les autres composants de l'ajout d'un article.
2. Utilisation de **IMediator.Publish** pour publier la notification après l'ajout d'un article dans **AddItemCommandHandler**.
3. Modification du **contrôleur** pour publier la notification via `Publish` après l'ajout de l'article.
4. Enregistrement de l'handler de notification dans **Program.cs** pour garantir qu'il est exécuté lorsqu'une notification est publiée.

Cela permet d'utiliser **MediatR Publish** pour gérer des événements (notifications) de manière décorrélée, ce qui peut être très utile pour des tâches comme la journalisation, l'envoi d'emails ou d'autres actions secondaires après une action principale.

### 9. Configuration de **Program.cs** (.NET 6+)

Enfin, nous allons configurer **Program.cs** pour enregistrer tous les services, y compris **MediatR**, **AutoMapper**, **FluentValidation**, les **Behaviors**, et les **Notifications**.

```csharp
var builder = WebApplication.CreateBuilder(args);

// Enregistrement des services MediatR et des Handlers
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());

// Enregistrement de AutoMapper
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

// Enregistrement de FluentValidation
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

// Enregistrement des comportements (Pipeline behaviors)
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// Enregistrement des repositories
builder.Services.AddScoped<IItemRepository, ItemRepository>();

// Ajout de la DBContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ajout des notifications
builder.Services.AddScoped<INotificationHandler<ItemAddedNotification>, ItemAddedNotificationHandler>();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
```

### 10. Exemple de Contrôleur avec MediatR

#### **ItemsController**

```csharp
[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ItemsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET api/items
    [HttpGet]
    public async Task<ActionResult<List<ItemDto>>> GetAllItems()
    {
        var query = new GetAllItemsQuery();


        var items = await _mediator.Send(query);
        return Ok(items);
    }

    // GET api/items/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ItemDto>> GetItemById(Guid id)
    {
        var query = new GetByIdQuery(id);
        var item = await _mediator.Send(query);
        return item != null ? Ok(item) : NotFound();
    }

    // POST api/items
    [HttpPost]
    public async Task<ActionResult<Guid>> AddItem([FromBody] AddItemCommand command)
    {
        var itemId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetItemById), new { id = itemId }, itemId);
    }
}
```

### Conclusion

Avec ces exemples, vous avez une configuration de base pour utiliser **MediatR** avec un **DbContext**, un **Repository Pattern**, **AutoMapper**, **FluentValidation**, des **Behaviors**, et des **Notifications** dans un projet **.NET 6+**. Ce modèle est flexible et vous pouvez l'étendre en fonction des besoins de votre application.

### 11. Structure

#### Structure de base pour un projet simple

Voici des exemples de structures de fichiers pour un projet utilisant **CQRS avec MediatR**, comprenant des commandes, des requêtes, des notifications, et d'autres concepts comme le mapping avec AutoMapper et la validation avec FluentValidation. Ces structures peuvent être adaptées en fonction de la taille et des besoins de votre projet.

```
src/
├── Controllers/
│   └── ItemsController.cs
├── Application/
│   ├── Commands/
│   │   └── AddItem/
│   │       ├── AddItemCommand.cs
│   │       ├── AddItemCommandHandler.cs
│   │       ├── AddItemCommandValidator.cs
│   ├── Queries/
│   │   ├── GetAllItems/
│   │   │   ├── GetAllItemsQuery.cs
│   │   │   ├── GetAllItemsQueryHandler.cs
│   │   │   ├── GetAllItemsQueryValidator.cs
│   │   ├── GetById/
│   │       ├── GetByIdQuery.cs
│   │       ├── GetByIdQueryHandler.cs
│   │       ├── GetByIdQueryValidator.cs
│   ├── Notifications/
│   │   ├── ItemAddedNotification.cs
│   │   ├── ItemAddedNotificationHandler.cs
│   ├── Behaviors/
│   │   └── ValidationBehavior.cs
│   └── Common/
│       ├── Mappings/
│       │   ├── ItemMappingProfile.cs
│       └── Interfaces/
│           ├── IRepository.cs
│           ├── IItemRepository.cs
│           └── IMediator.cs
├── Domain/
│   ├── Entities/
│   │   └── Item.cs
│   └── Events/
│       └── ItemAddedEvent.cs
├── Infrastructure/
│   ├── Persistence/
│   │   ├── ApplicationDbContext.cs
│   │   ├── ApplicationDbContextFactory.cs
│   │   └── Repositories/
│   │       └── ItemRepository.cs
│   └── Services/
│       └── NotificationService.cs
├── Program.cs
├── StartupExtensions/
│   ├── DependencyInjection.cs
│   ├── ServiceCollectionExtensions.cs
└── appsettings.json
```

---

### Description des dossiers et fichiers

#### 1. **Controllers/**

- Contient les **API controllers** pour les endpoints exposés.
- **Exemple** : `ItemsController.cs` gère les appels pour récupérer, ajouter ou modifier des articles.

#### 2. **Application/**

- Gère toute la logique applicative, en utilisant CQRS.
- **Sous-dossiers :**
  - **Commands/** : Contient les commandes comme `AddItemCommand`, leurs handlers et validateurs.
  - **Queries/** : Contient les requêtes comme `GetAllItemsQuery`, leurs handlers et validateurs.
  - **Notifications/** : Contient les notifications comme `ItemAddedNotification` et leurs handlers.
  - **Behaviors/** : Contient les comportements globaux comme `ValidationBehavior` pour MediatR.
  - **Common/** :
    - **Mappings/** : Contient les profils AutoMapper pour mapper des entités vers des DTOs.
    - **Interfaces/** : Contient des interfaces comme `IRepository` ou `IItemRepository`.

#### 3. **Domain/**

- Contient les entités de domaine et les événements liés au domaine.
- **Sous-dossiers :**
  - **Entities/** : Contient les classes représentant des entités, comme `Item`.
  - **Events/** : Contient les événements spécifiques au domaine.

#### 4. **Infrastructure/**

- Implémente les détails techniques (persistence, services externes).
- **Sous-dossiers :**
  - **Persistence/** : Inclut le DbContext et les repositories.
  - **Services/** : Implémente des services utilitaires comme les notifications ou l'intégration externe.

#### 5. **StartupExtensions/**

- Contient les extensions pour enregistrer les services, handlers et autres configurations dans le conteneur IoC.

---

#### Structure pour un projet modulaire (plus grand projet)

Si votre projet est complexe, vous pouvez structurer les dossiers en modules.

```
src/
├── Modules/
│   ├── Items/
│   │   ├── Commands/
│   │   │   └── AddItem/
│   │   │       ├── AddItemCommand.cs
│   │   │       ├── AddItemCommandHandler.cs
│   │   │       ├── AddItemCommandValidator.cs
│   │   ├── Queries/
│   │   │   ├── GetAllItems/
│   │   │   │   ├── GetAllItemsQuery.cs
│   │   │   │   ├── GetAllItemsQueryHandler.cs
│   │   │   │   ├── GetAllItemsQueryValidator.cs
│   │   │   ├── GetById/
│   │   │       ├── GetByIdQuery.cs
│   │   │       ├── GetByIdQueryHandler.cs
│   │   │       ├── GetByIdQueryValidator.cs
│   │   ├── Notifications/
│   │   │   ├── ItemAddedNotification.cs
│   │   │   ├── ItemAddedNotificationHandler.cs
│   │   ├── Behaviors/
│   │   │   └── ValidationBehavior.cs
│   │   ├── Common/
│   │   │   ├── Mappings/
│   │   │   │   └── ItemMappingProfile.cs
│   │   │   ├── Interfaces/
│   │   │   │   ├── IItemRepository.cs
│   │   │   │   ├── IRepository.cs
│   │   │   │   ├── IItemService.cs
│   │   │   │   └── IUnitOfWork.cs
│   │   │   └── Validators/
│   │   │       ├── AddItemCommandValidator.cs
│   │   │       └── GetByIdQueryValidator.cs
│   │   ├── Domain/
│   │   │   └── Item.cs
│   │   └── Infrastructure/
│   │       ├── Repositories/
│   │       │   └── ItemRepository.cs
│   │       └── Services/
│   │           └── NotificationService.cs
├── Shared/
│   ├── Behaviors/
│   │   ├── LoggingBehavior.cs
│   │   ├── PerformanceBehavior.cs
│   │   └── ValidationBehavior.cs
│   ├── Exceptions/
│   │   └── ValidationException.cs
│   ├── Interfaces/
│   │   └── IDateTime.cs
│   └── Mappings/
│       └── MappingProfileBase.cs
└── appsettings.json
```

---

### Points forts de ces structures

1. **Lisibilité** : Les commandes, requêtes, notifications et comportements sont clairement séparés.
2. **Scalabilité** : Une structure modulaire facilite l'ajout de nouvelles fonctionnalités.
3. **Réutilisabilité** : Les composants comme les comportements ou les validations peuvent être partagés entre modules.

N'hésitez pas à personnaliser ces structures pour répondre aux besoins de votre projet.

