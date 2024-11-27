---
category: Web > Asp.Net Core > Architecture
title: DDD vs CQRS vs Event Sourcing
date: 2024-11-26
author: Romagny13
---

# DDD vs CQRS vs Event Sourcing

Voici un aperçu des différences entre **DDD (Domain-Driven Design)**, **CQRS (Command Query Responsibility Segregation)** et **Event Sourcing**. Ces concepts sont souvent utilisés ensemble, mais ils ont des objectifs distincts et peuvent être appliqués indépendamment.

---

## **1. Domain-Driven Design (DDD)**

### **Concept :**

Le **Domain-Driven Design** est une approche de conception de logiciel centrée sur le domaine métier. Elle met l'accent sur la compréhension approfondie des concepts métier et leur traduction dans le code.

### **Principes clés :**

- **Langage ubiquitaire** : Créer un langage commun entre les développeurs et les experts métier pour réduire les ambiguïtés.
- **Modèle de domaine** : Traduire les concepts métier en objets et relations logiques.
- **Entités** : Objets ayant une identité unique (ex. : un utilisateur, une commande).
- **Valeur d'objet (Value Object)** : Objets sans identité propre, définis uniquement par leurs propriétés (ex. : une adresse).
- **Agrégats** : Groupes cohérents d'entités et de règles métier. Chaque agrégat a une **racine d'agrégat** qui contrôle l'accès et la cohérence.
- **Services de domaine** : Logiciel encapsulant des règles métier complexes, non liées à une entité spécifique.
- **Référentiel (Repository)** : Abstraction pour accéder aux agrégats persistants.

### **Objectif :**

- Faciliter la traduction des besoins métier en un code maintenable et compréhensible.
- Maintenir une correspondance étroite entre le code et le domaine métier.

---

## **2. Command Query Responsibility Segregation (CQRS)**

### **Concept :**

Le **CQRS** est un modèle architectural qui sépare les opérations de lecture (Query) et d’écriture (Command) sur le modèle de données. Plutôt que d'utiliser un modèle unique pour les deux, on en utilise deux distincts.

### **Principes clés :**

- **Séparation des responsabilités** :
  - **Command** : Mutation des données (ajouter, mettre à jour, supprimer).
  - **Query** : Récupération des données (lecture uniquement).
- Les modèles d’écriture et de lecture peuvent être différents :
  - Le modèle de **Command** peut être optimisé pour appliquer des règles métier.
  - Le modèle de **Query** peut être optimisé pour la lecture et la performance (ex. : vues matérialisées, projections).
- **Asynchronisme** possible entre les opérations d’écriture et de lecture.

### **Objectif :**

- Améliorer la scalabilité et les performances.
- Permettre une meilleure séparation des préoccupations (écriture ≠ lecture).
- Faciliter l’optimisation des modèles pour des besoins spécifiques.

---

## **3. Event Sourcing**

### **Concept :**

Le **Event Sourcing** est une technique de persistance où les changements d'état d'une application sont enregistrés comme une série d'événements immuables, plutôt que de stocker directement l'état final.

### **Principes clés :**

- **Événements immuables** : Chaque modification de l’état est enregistrée sous forme d’un événement (ex. : `OrderCreated`, `ProductAddedToOrder`, `OrderConfirmed`).
- **Reconstitution de l’état** : L’état actuel d’un agrégat est reconstruit en rejouant les événements dans l’ordre.
- Les événements sont les **sources de vérité**, et non le modèle de données ou les objets persistants.
- Les projections (ou vues) peuvent être dérivées des événements pour des lectures optimisées.

### **Objectif :**

- Fournir une piste d’audit complète et immuable.
- Permettre une grande flexibilité pour recréer l'état actuel ou passer à une version antérieure.
- Simplifier la gestion des scénarios complexes de concurrence.

---

## **Comparaison rapide**

| **Aspect**                | **DDD**                                  | **CQRS**                                                     | **Event Sourcing**                                         |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| **Focus**                 | Modélisation du domaine métier           | Séparation des lectures/écritures                            | Persistance des changements sous forme d’événements        |
| **Structure**             | Basée sur des agrégats et entités        | Modèles distincts pour lecture/écriture                      | Journal d’événements immuables                             |
| **Modèle de données**     | Unique pour le domaine                   | Deux modèles (lecture/écriture)                              | Basé sur une séquence d’événements                         |
| **Usage**                 | Compréhension métier                     | Optimisation des performances et scalabilité                 | Audit, historisation, flexibilité de reconstruction        |
| **Complexité**            | Moyenne                                  | Moyenne à élevée                                             | Élevée                                                     |
| **Exemple d’utilisation** | Application métier avec règles complexes | Systèmes avec des charges de lecture/écriture déséquilibrées | Applications nécessitant un historique complet des actions |

---

## **Combinaison des concepts**

- **DDD + CQRS** :

  - Les **agrégats** et leurs règles métier (DDD) sont souvent utilisés dans le modèle d’écriture de CQRS.
  - Le modèle de lecture de CQRS peut être simplifié (ex. : projections).
  - CQRS facilite la modélisation des agrégats en permettant des lectures optimisées.

- **CQRS + Event Sourcing** :

  - Le modèle d’écriture (Command) peut produire des événements immuables enregistrés via Event Sourcing.
  - Les projections pour la lecture (Query) sont générées à partir des événements stockés.

- **DDD + CQRS + Event Sourcing** :
  - Les **agrégats** de DDD génèrent des événements pour Event Sourcing.
  - Les événements servent à alimenter des projections pour le modèle de lecture CQRS.

---

## **Choix d'utilisation**

- **Utiliser DDD :**

  - Lorsque le domaine métier est complexe et nécessite une compréhension approfondie.
  - Pour les projets collaboratifs où les développeurs et les experts métier doivent travailler étroitement.

- **Utiliser CQRS :**

  - Lorsque les lectures et les écritures ont des exigences différentes.
  - Pour les systèmes nécessitant une scalabilité importante ou des lectures rapides.

- **Utiliser Event Sourcing :**
  - Lorsque l'historique complet des modifications est critique (piste d'audit, réglementations).
  - Pour des systèmes où la reconstruction de l’état est nécessaire.

Ces concepts ne s'excluent pas mutuellement et peuvent être combinés selon les besoins. Cependant, leur adoption doit être pesée par rapport à la complexité qu'ils introduisent.

## 4. Exemple Event Sourcing

Voici un exemple complet d'une application ASP.NET Core utilisant **Event Sourcing** pour gérer une entité **Commande** (Order). Cet exemple illustre comment capturer des événements, rejouer ces événements pour reconstruire l'état d'une commande, et exposer des endpoints via un contrôleur REST.

---

### **1. Définir les événements**

Les événements représentent chaque changement d'état.

```csharp
public interface IEvent
{
    Guid AggregateId { get; }
    DateTime OccurredOn { get; }
}

public class OrderCreated : IEvent
{
    public Guid AggregateId { get; private set; }
    public DateTime OccurredOn { get; private set; }
    public string CustomerName { get; private set; }
    public decimal TotalAmount { get; private set; }

    public OrderCreated(Guid aggregateId, string customerName, decimal totalAmount)
    {
        AggregateId = aggregateId;
        CustomerName = customerName;
        TotalAmount = totalAmount;
        OccurredOn = DateTime.UtcNow;
    }
}

public class OrderShipped : IEvent
{
    public Guid AggregateId { get; private set; }
    public DateTime OccurredOn { get; private set; }

    public OrderShipped(Guid aggregateId)
    {
        AggregateId = aggregateId;
        OccurredOn = DateTime.UtcNow;
    }
}
```

---

### **2. Implémenter l'entité avec la logique pour rejouer les événements**

L'entité **Order** applique les événements pour reconstruire son état.

```csharp
public class Order
{
    public Guid Id { get; private set; }
    public string CustomerName { get; private set; }
    public decimal TotalAmount { get; private set; }
    public string Status { get; private set; }

    public void Apply(OrderCreated @event)
    {
        Id = @event.AggregateId;
        CustomerName = @event.CustomerName;
        TotalAmount = @event.TotalAmount;
        Status = "Pending";
    }

    public void Apply(OrderShipped @event)
    {
        Status = "Shipped";
    }

    public void Replay(IEnumerable<IEvent> events)
    {
        foreach (var @event in events)
        {
            Apply((dynamic)@event);
        }
    }
}
```

---

### **3. Implémenter le magasin d'événements**

Le **Event Store** enregistre et récupère les événements pour un agrégat.

```csharp
public class EventStore
{
    private readonly List<IEvent> _events = new List<IEvent>();

    public void SaveEvent(IEvent @event)
    {
        _events.Add(@event);
    }

    public IEnumerable<IEvent> GetEvents(Guid aggregateId)
    {
        return _events.Where(e => e.AggregateId == aggregateId);
    }
}
```

---

### **4. Implémenter les services pour les commandes**

Ces services encapsulent la logique pour gérer les agrégats via des événements.

```csharp
public class OrderService
{
    private readonly EventStore _eventStore;

    public OrderService(EventStore eventStore)
    {
        _eventStore = eventStore;
    }

    public void CreateOrder(Guid id, string customerName, decimal totalAmount)
    {
        var orderCreated = new OrderCreated(id, customerName, totalAmount);
        _eventStore.SaveEvent(orderCreated);
    }

    public void ShipOrder(Guid id)
    {
        var orderShipped = new OrderShipped(id);
        _eventStore.SaveEvent(orderShipped);
    }

    public Order GetOrder(Guid id)
    {
        var events = _eventStore.GetEvents(id);
        if (!events.Any()) return null;

        var order = new Order();
        order.Replay(events);
        return order;
    }
}
```

---

### **5. Ajouter le contrôleur**

Le contrôleur expose des endpoints REST.

```csharp
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public IActionResult CreateOrder([FromBody] CreateOrderDto dto)
    {
        var orderId = Guid.NewGuid();
        _orderService.CreateOrder(orderId, dto.CustomerName, dto.TotalAmount);
        return CreatedAtAction(nameof(GetOrder), new { id = orderId }, null);
    }

    [HttpPost("{id}/ship")]
    public IActionResult ShipOrder(Guid id)
    {
        _orderService.ShipOrder(id);
        return NoContent();
    }

    [HttpGet("{id}")]
    public IActionResult GetOrder(Guid id)
    {
        var order = _orderService.GetOrder(id);
        if (order == null) return NotFound();

        return Ok(order);
    }
}

public class CreateOrderDto
{
    public string CustomerName { get; set; }
    public decimal TotalAmount { get; set; }
}
```

---

### **6. Configurer `Program.cs`**

Ajoutez les services nécessaires au démarrage.

```csharp
var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// Ajouter le Event Store et le service
services.AddSingleton<EventStore>();
services.AddTransient<OrderService>();

services.AddControllers();

var app = builder.Build();

app.UseRouting();
app.UseEndpoints(endpoints => endpoints.MapControllers());

app.Run();
```

---

### **Exemple de requêtes HTTP**

1. **Créer une commande :**

   ```bash
   POST http://localhost:5000/api/orders
   Content-Type: application/json

   {
       "customerName": "John Doe",
       "totalAmount": 150.00
   }
   ```

2. **Expédier la commande :**

   ```bash
   POST http://localhost:5000/api/orders/{id}/ship
   ```

3. **Afficher l'état de la commande :**
   ```bash
   GET http://localhost:5000/api/orders/{id}
   ```

---

### **Résumé**

Avec cet exemple :

- **Event Sourcing** permet de reconstruire l'état d'une commande en rejouant ses événements.
- L'**Event Store** agit comme une source unique de vérité, capturant toutes les modifications sous forme d'événements.
- Les projections (reconstructions d'état) permettent d'accéder facilement à l'état courant.

Vous pouvez enrichir cet exemple avec des fonctionnalités comme des **projections persistantes**, des **domain events**, ou encore le **pattern repository** pour une plus grande flexibilité.

## 5. Exemple DDD

Voici un exemple complet d'application ASP.NET Core basée sur le **Domain-Driven Design (DDD)** pour gérer un domaine simple : **Gestion de commandes** (Orders). Cet exemple respecte les principes fondamentaux de DDD : **agrégats**, **entités**, **valeurs d'objet**, **services de domaine**, et **repository pattern**.

---

### **1. Structure des dossiers**

La structure suivante est suggérée pour organiser le projet selon les principes DDD :

```
src/
├── Application/
│   ├── Commands/
│   ├── Queries/
│   ├── Services/
├── Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Aggregates/
│   ├── Events/
│   ├── Services/
│   ├── Exceptions/
├── Infrastructure/
│   ├── Persistence/
│   ├── Repositories/
│   ├── EventHandlers/
├── API/
│   ├── Controllers/
│   ├── DTOs/
```

---

### **2. Le domaine**

#### **Entité `Order`**

```csharp
namespace Domain.Entities;

public class Order
{
    public Guid Id { get; private set; }
    public string CustomerName { get; private set; }
    public DateTime OrderDate { get; private set; }
    public List<OrderItem> Items { get; private set; } = new();
    public decimal TotalAmount => Items.Sum(i => i.TotalPrice);

    private Order() { } // Required for EF Core

    public Order(Guid id, string customerName)
    {
        if (string.IsNullOrWhiteSpace(customerName))
            throw new ArgumentException("Customer name cannot be empty.");

        Id = id;
        CustomerName = customerName;
        OrderDate = DateTime.UtcNow;
    }

    public void AddItem(Guid productId, string productName, decimal unitPrice, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.");

        Items.Add(new OrderItem(productId, productName, unitPrice, quantity));
    }
}
```

#### **Valeur d'objet `OrderItem`**

```csharp
namespace Domain.ValueObjects;

public class OrderItem
{
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; }
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public decimal TotalPrice => UnitPrice * Quantity;

    private OrderItem() { }

    public OrderItem(Guid productId, string productName, decimal unitPrice, int quantity)
    {
        ProductId = productId;
        ProductName = productName;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }
}
```

---

### **3. Infrastructure**

#### **Interface Repository**

```csharp
namespace Domain.Repositories;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id);
    Task AddAsync(Order order);
    Task SaveChangesAsync();
}
```

#### **Implementation Repository avec EF Core**

```csharp
namespace Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
```

#### **DbContext**

```csharp
namespace Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.CustomerName).IsRequired();
            entity.OwnsMany(o => o.Items, items =>
            {
                items.WithOwner().HasForeignKey("OrderId");
                items.Property(i => i.ProductName).IsRequired();
            });
        });
    }
}
```

---

### **4. Application Layer**

#### **Command : Create Order**

```csharp
namespace Application.Commands;

public class CreateOrderCommand
{
    public string CustomerName { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}
```

#### **Command Handler**

```csharp
namespace Application.Commands;

public class CreateOrderCommandHandler
{
    private readonly IOrderRepository _orderRepository;

    public CreateOrderCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Guid> Handle(CreateOrderCommand command)
    {
        var order = new Order(Guid.NewGuid(), command.CustomerName);

        foreach (var item in command.Items)
        {
            order.AddItem(item.ProductId, item.ProductName, item.UnitPrice, item.Quantity);
        }

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveChangesAsync();

        return order.Id;
    }
}
```

#### **Query : Get Order By Id**

```csharp
namespace Application.Queries;

public class GetOrderByIdQuery
{
    public Guid OrderId { get; set; }
}

public class GetOrderByIdQueryHandler
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderByIdQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDto?> Handle(GetOrderByIdQuery query)
    {
        var order = await _orderRepository.GetByIdAsync(query.OrderId);
        if (order == null) return null;

        return new OrderDto
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Items = order.Items.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList()
        };
    }
}

public class OrderDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemDto> Items { get; set; }
}
```

---

### **5. API Layer**

#### **Controller**

```csharp
namespace API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderCommandHandler _createHandler;
    private readonly GetOrderByIdQueryHandler _queryHandler;

    public OrdersController(CreateOrderCommandHandler createHandler, GetOrderByIdQueryHandler queryHandler)
    {
        _createHandler = createHandler;
        _queryHandler = queryHandler;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderCommand command)
    {
        var orderId = await _createHandler.Handle(command);
        return CreatedAtAction(nameof(GetOrderById), new { id = orderId }, null);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var order = await _queryHandler.Handle(new GetOrderByIdQuery { OrderId = id });
        if (order == null) return NotFound();

        return Ok(order);
    }
}
```

---

### **6. Program.cs**

```csharp
var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("OrdersDb"));

services.AddTransient<IOrderRepository, OrderRepository>();
services.AddTransient<CreateOrderCommandHandler>();
services.AddTransient<GetOrderByIdQueryHandler>();

services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();
```

---

### **Résumé**

Ce projet montre une application ASP.NET Core conçue selon les principes de DDD :

- **Domaine** : Contient la logique métier.
- **Infrastructure** : Fournit l'accès aux données (EF Core ici).
- **Application** : Implémente les commandes, les requêtes et l'orchestration.
- **API** : Expose les endpoints REST.

Vous pouvez enrichir cet exemple en ajoutant des événements de domaine, une gestion d'agrégats complexes, ou des notifications interservices.
