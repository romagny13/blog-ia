---
category: Web > Asp.Net Core > Architecture
title: Onion vs Clean
date: 2024-11-26
author: Romagny13
---

# **Guide Complet : Architectures et Patterns Architecturaux (Onion vs Clean, CQRS, DDD, Mediator, Event-Driven, Event Sourcing)**

## **1. Introduction**

Dans le développement d'applications complexes, différentes architectures et patterns peuvent être utilisés pour organiser et structurer le code afin de répondre aux besoins d'évolutivité, de maintenabilité et de performance. Ce document explore en détail les architectures **Onion** et **Clean**, ainsi que plusieurs patterns architecturaux populaires comme **CQRS**, **DDD**, **Mediator**, **Event-Driven**, et **Event Sourcing**.

Chaque approche a ses avantages et inconvénients, et le choix entre elles dépend du type de projet, de sa complexité, et des exigences spécifiques.

## **2. Comparaison des Architectures : Onion vs Clean**

### **2.1 Onion Architecture**

L'**Onion Architecture** est un modèle où les différentes couches de l'application sont organisées en cercles concentriques. Le but est de séparer la logique métier du reste de l'application, et d'éviter les dépendances externes dans le cœur du système.

#### Schéma de l'Onion Architecture :

```plaintext
              +-----------------------+
              |      Infrastructure    |
              |    (Repositoires, DB)  |
              +-----------------------+
                        ^
                        |
              +-----------------------+
              |    Application Layer   |
              |  (Service, Business)   |
              +-----------------------+
                        ^
                        |
              +-----------------------+
              |    Core / Domain Layer |
              | (Entities, Interfaces) |
              +-----------------------+
```

#### Structure des Dossiers Onion :

```plaintext
Core
 ├── Domain
 │   ├── Entities
 │   ├── Repositories (Interfaces)
 ├── Service
 │   ├── Services et Service Manager
 ├── Service.Abstractions
 │   ├── Interfaces des Services et de Service Manager

Infrastructure
 ├── Persistence (Implémentation des Repositories)


API
 ├── Controllers

Shared
 ├── DataTransferObjects (DTO)
```

#### Explication :

- **Core** : Le cœur du système, qui contient la logique métier essentielle. Il ne dépend d'aucune technologie externe.
- **Service Layer** : Contient la logique métier, les services et les interfaces qui interagissent avec le domaine.
- **Infrastructure** : Contient les implémentations de la logique technique (accès aux données, communication avec des services externes).
- **API Layer** : Point d'entrée exposé via des API REST.

### **2.2 Clean Architecture**

La **Clean Architecture** suit une approche similaire mais avec des distinctions plus marquées entre les commandes (Command) et les requêtes (Query), ce qui permet de mieux gérer les opérations de lecture et d'écriture. Elle impose également un découplage plus strict des dépendances via des **handlers**.

#### Schéma de la Clean Architecture :

```plaintext
              +-----------------------+
              |      Infrastructure    |
              |    (Persistence, DB)   |
              +-----------------------+
                        ^
                        |
              +-----------------------+
              |    Application Layer   |
              |  (Use Cases, Commands, |
              |   Queries, Handlers)   |
              +-----------------------+
                        ^
                        |
              +-----------------------+
              |    Domain Layer        |
              |  (Entities, Repos)     |
              +-----------------------+
```

#### Structure des Dossiers Clean :

```plaintext
Core
 ├── Domain
 │   ├── Entities
 |   ├── Models?
 |
 ├── Application
     ├── Commands
     ├── Queries
     ├── Handlers (Commandes et Requêtes)
     └── Contracts (Interfaces pour Infrastructure et Persistence)
     ├── Dto ?
     ├── ServiceCollectionExtensions

Infrastructure
 ├── Persistence
 │   ├── Repositories (Implémentations concrètes des repositories)
 |   ├── ServiceCollectionExtensions
 |
 ├── Infrastructure (Implémentations des services externes)
    ├── ServiceCollectionExtensions

API
 ├── Controllers
 └── Models (Modeles de requêtes et réponses)
```

#### Explication :

- **Application Layer** : Contient des **Commands**, **Queries**, et leurs **Handlers**, ce qui permet de séparer les préoccupations entre la lecture et l'écriture des données.
- **Domain Layer** : Toujours centré sur la logique métier, les entités et les interfaces des repositories.
- **Infrastructure** : Implémentation des interfaces du domaine et gestion des interactions avec des bases de données ou des services externes.

### **2.3 Comparaison entre Onion et Clean**

| Critère                            | **Onion Architecture**                                                     | **Clean Architecture**                                                               |
| ---------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Séparation des Responsabilités** | Couches concentriques sans distinction stricte entre Commandes et Requêtes | Commandes et Requêtes séparées avec des Handlers distincts                           |
| **Modularité**                     | Très modulable, mais plus complexe à gérer dans des projets simples        | Moins de flexibilité mais plus clair pour les projets complexes                      |
| **Complexité**                     | Plus simple à comprendre pour des applications petites ou moyennes         | Plus adapté aux systèmes complexes avec une logique de lecture et d'écriture séparée |
| **Testabilité**                    | Très testable grâce à la séparation stricte des couches                    | Très testable avec l'accent mis sur la séparation des Commandes/Queries              |

---

## **3. CQRS (Command Query Responsibility Segregation)**

Le **CQRS** est un pattern où les **Commandes** (qui modifient l'état du système) et les **Requêtes** (qui lisent les données) sont gérées séparément. Cela permet de mieux optimiser les opérations de lecture et d'écriture dans des systèmes complexes.

### **Exemple CQRS avec MediatR (C# ASP.NET Core)**

#### Commande pour créer un utilisateur :

```csharp
public class CreateUserCommand : IRequest<User>
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, User>
{
    private readonly IUserRepository _userRepository;

    public CreateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User { Name = request.Name, Email = request.Email };
        await _userRepository.AddAsync(user);
        return user;
    }
}
```

#### Requête pour récupérer un utilisateur :

```csharp
public class GetUserQuery : IRequest<User>
{
    public int UserId { get; set; }
}

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, User>
{
    private readonly IUserRepository _userRepository;

    public GetUserQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        return await _userRepository.GetByIdAsync(request.UserId);
    }
}
```

### **Pourquoi CQRS avec Clean ?**

- **Clean Architecture** se prête naturellement à l'usage de **CQRS** en séparant clairement les commandes et les requêtes. Cela permet de mieux gérer la complexité, de diviser les responsabilités, et d'optimiser les performances en permettant des approches différentes pour la lecture et l'écriture des données.

---

## **4. DDD (Domain-Driven Design)**

**DDD** se concentre sur la création de modèles métiers qui représentent le domaine de l'application. Il encourage une **forte collaboration entre les experts métiers et les développeurs** pour élaborer des modèles qui capturent la réalité du domaine.

### **Exemple de DDD : Entité User**

```csharp
public class User
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }

    public void ChangeName(string newName)
    {
        // La logique métier pour modifier le nom
        Name = newName;
    }
}
```

### **Principaux Concepts de DDD**

- **Entités** : Objets ayant une identité propre, comme l'entité `User` ci-dessus.
- **Agrégats** : Regroupent des entités et leur logique métier sous une seule racine.
- **Services de Domaine** : Contiennent des règles métier complexes qui ne correspondent pas à une seule entité.

### **Pourquoi DDD avec Clean ?**

- **DDD** se concentre sur le modèle métier, ce qui fait de la **Clean Architecture** un bon choix pour appliquer **DDD**. La séparation claire des commandes et des requêtes dans Clean permet de mieux gérer la logique métier et la persistance des données.

---

## **5. Mediator (MediatR)**

Le **Mediator** est un pattern qui permet de **découpler** les différentes parties d'une application. **MediatR** est une bibliothèque .NET qui facilite la mise en œuvre de ce pattern.

### **Exemple de Mediator avec MediatR**

```csharp
public class MyRequest : IRequest<MyResponse> { }

public class MyRequestHandler : IRequestHandler<MyRequest, MyResponse>
{
    public Task<MyResponse> Handle(MyRequest request, CancellationToken cancellationToken)
    {
        // Traitement de la requête
        return Task.FromResult(new MyResponse());
    }
}
```

### **Pourquoi utiliser Mediator ?**

- Il permet de réduire les dépendances directes entre les différentes couches de l'application. C'est particulièrement utile dans des architectures comme **Clean** et **CQRS** où les commandes et les requêtes sont gérées de manière distincte.

---

## **6. Event-Driven Architecture (EDA)**

Dans une **Event-Driven Architecture**, l'application réagit aux **événements** plutôt que de suivre des flux de contrôle stricts. Cela permet de créer des systèmes plus réactifs et scalables.

### **Exemple de gestion d'événements en C#**

```csharp
public class UserCreatedEvent
{
    public int UserId { get; set; }
    public string UserName { get; set; }
}

public class EventHandler : INotificationHandler<UserCreatedEvent>
{
    public Task Handle(UserCreatedEvent notification, CancellationToken cancellationToken)
    {
        // Logic to handle event
        return Task.CompletedTask;
    }
}
```

---

## **7. Event Sourcing**

**Event Sourcing** est un pattern où l'état de l'application est déterminé par l'historique des événements plutôt que par l'état actuel des données.

### **Exemple de Event Sourcing avec C#**

```csharp
public class UserCreatedEvent
{
    public int UserId { get; set; }
    public string UserName { get; set; }
}
```

### **Pourquoi utiliser Event Sourcing ?**

- Idéal pour des systèmes où l'historique complet des changements est crucial (ex. applications financières, systèmes de commandes). Il permet également de restaurer l'état exact du système à tout moment, à partir des événements.

---

## **Exemple de méthode d'extension dans Clean Architecture**

Dans Clean Architecture, les méthodes d'extension sont couramment utilisées pour faciliter l'ajout de services à l'infrastructure, particulièrement au niveau de l'**Application Layer**. Cela permet de configurer les dépendances dans **Startup.cs** ou **Program.cs** et de maintenir la séparation des préoccupations entre les différentes couches.

## **8. Exemple d'une méthode d'extension pour ajouter un service dans Clean Architecture**

**Créer une méthode d'extension dans `Infrastructure/ServiceCollectionExtensions` :**

```csharp
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        return services;
    }
}
```

4. **Utiliser la méthode d'extension dans `Program.cs` ou `Startup.cs` :**

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationServices(); // Ajoute les services de l'application
    }
}
```

## **Conclusion**

- **CQRS** est particulièrement adapté pour des applications où les opérations de lecture et d'écriture sont très différentes ou doivent être optimisées séparément.
- **Clean Architecture** et **Onion Architecture** sont toutes deux d'excellentes approches pour découpler les différentes préoccupations dans un système. **Clean Architecture** est particulièrement adaptée aux systèmes complexes, tandis que **Onion** est souvent préférée pour des systèmes plus simples.
- **DDD** est une approche puissante pour représenter des modèles métiers complexes, et il s'intègre bien avec **Clean Architecture**.
- **Mediator**, **Event-Driven** et **Event Sourcing** sont des patterns puissants pour gérer les événements et la communication entre différentes parties d'une application.

Le choix entre ces différentes architectures et patterns dépend des besoins du projet et des objectifs de l'équipe de développement.
