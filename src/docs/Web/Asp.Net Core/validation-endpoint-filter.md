---
category: Web > Asp.Net Core
title: Validation Endpoint Filter
date: 2024-11-27
author: Romagny13
protected: true
---

# Guide de Validation avec `IEndpointFilter` dans les **Minimal APIs** ASP.NET Core (.NET 7+)

ASP.NET Core 7 introduit la possibilité d'utiliser des **Endpoint Filters** dans les **Minimal APIs** pour gérer des fonctionnalités telles que la validation des données avant l'exécution du code du point de terminaison. Dans ce guide, nous allons explorer deux approches pour la validation des modèles dans un **Minimal API** : l'utilisation de `Validator.TryValidateObject` (validation classique) et l'utilisation de **FluentValidation** (une bibliothèque populaire pour la validation de données).

### Prérequis

Ce guide nécessite d'utiliser **.NET 7** ou supérieur, car les **Endpoint Filters** sont une fonctionnalité introduite dans cette version.

### 1. Validation avec `Validator.TryValidateObject`

Cette méthode permet de valider un objet à l'aide des annotations de validation comme `[Required]`, `[Range]`, etc. Nous allons créer un **Endpoint Filter** pour effectuer cette validation dans un point de terminaison d'une **Minimal API**.

#### Création du Filtre de Validation

Voici comment implémenter un filtre de validation qui utilise `Validator.TryValidateObject` pour valider un modèle :

```csharp
using System.ComponentModel.DataAnnotations;
using Data.Entities;

namespace APINet7.EndpointFilters
{
    public class ValidationEndpointFilter : IEndpointFilter
    {
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext efiContext, EndpointFilterDelegate next)
        {
            // Récupère le modèle passé dans la requête (ici, le modèle "Owner")
            var owner = efiContext.GetArgument<Owner>(0);

            // Liste pour contenir les résultats de validation
            var results = new List<ValidationResult>();

            // Valide l'objet à l'aide de Validator.TryValidateObject
            var isValid = Validator.TryValidateObject(owner, new ValidationContext(owner), results, true);

            // Si l'objet n'est pas valide, retourne une erreur de validation
            if (!isValid)
                return Results.ValidationProblem(DataValidationHelper.ToDictionary(results));

            // Si l'objet est valide, continue l'exécution du pipeline
            return await next(efiContext);
        }
    }
}
```

#### Explication du code

- **`GetArgument<Owner>(0)`** : Cette méthode récupère le premier argument du point de terminaison (ici, un objet de type `Owner`).
- **`Validator.TryValidateObject`** : Effectue la validation en utilisant les annotations de validation définies dans le modèle `Owner`.
- **`Results.ValidationProblem`** : Si l'objet est invalide, nous retournons une réponse contenant les erreurs de validation sous forme de `ValidationProblem`.

#### Utilisation du Filtre dans le Point de Terminaison

Voici un exemple d'utilisation de ce filtre dans un point de terminaison `POST` pour créer un objet `Owner` :

```csharp
app.MapPost("/api/Owner/", async (Owner owner, ApplicationDbContext context) =>
{
    context.Owners.Add(owner);
    await context.SaveChangesAsync();
    return Results.Created($"/api/Owners/{owner.Id}", owner);
})
.AddEndpointFilter<ValidationEndpointFilter>() // Application du filtre de validation
.WithName("CreateOwner")
.Produces<Owner>(StatusCodes.Status201Created)
.Produces<Owner>(StatusCodes.Status400BadRequest);
```

### 2. Validation avec **FluentValidation**

**FluentValidation** est une bibliothèque populaire pour la validation d'objets qui permet de définir des règles de validation de manière fluide et plus flexible. Nous allons maintenant voir comment utiliser FluentValidation dans un **Endpoint Filter**.

#### Étape 1 : Installation de FluentValidation

Pour commencer à utiliser **FluentValidation**, vous devez installer le package NuGet suivant dans votre projet :

```bash
dotnet add package FluentValidation
```

#### Étape 2 : Configuration de FluentValidation

Ensuite, vous devez enregistrer **FluentValidation** dans les services de l'application pour qu'il puisse être utilisé dans le filtre. Dans la méthode `ConfigureServices` de votre `Program.cs` (ou `Startup.cs` si vous utilisez cette structure), ajoutez l'enregistrement de FluentValidation :

```csharp
using FluentValidation;
using APINet7.EndpointFilters;

var builder = WebApplication.CreateBuilder(args);

// Enregistrer les services FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>(); // Enregistre automatiquement tous les validateurs dans l'assembly

var app = builder.Build();
```

La méthode `AddValidatorsFromAssemblyContaining<T>` scanne l'assembly et enregistre tous les validateurs que vous avez définis.

#### Étape 3 : Création du Filtre de Validation avec FluentValidation

Voici un filtre utilisant **FluentValidation** pour valider un modèle. Ce filtre récupère automatiquement le validateur associé au type d'objet et l'applique.

```csharp
using FluentValidation;

namespace APINet7.EndpointFilters
{
    public class FluentValidationEndpointFilter<T> : IEndpointFilter
    {
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext efiContext, EndpointFilterDelegate next)
        {
            // Récupère le validateur du type T via les services
            var validator = efiContext.HttpContext.RequestServices.GetService<IValidator<T>>();
            if (validator != null)
            {
                // Récupère l'instance de l'objet à valider
                var entity = efiContext.Arguments.OfType<T>().FirstOrDefault(a => a?.GetType() == typeof(T));
                if (entity == null)
                    return Results.Problem("Could not find type to validate");

                // Valide l'objet avec FluentValidation
                var validation = await validator.ValidateAsync(entity);
                if (!validation.IsValid)
                    return Results.ValidationProblem(validation.ToDictionary());
            }

            // Si l'objet est valide, continue l'exécution
            return await next(efiContext);
        }
    }
}
```

#### Étape 4 : Création du Validateur FluentValidation

Vous devez créer un validateur pour chaque type d'objet que vous souhaitez valider. Par exemple, pour le modèle `Owner` :

```csharp
using FluentValidation;

namespace Data.Entities
{
    public class OwnerValidator : AbstractValidator<Owner>
    {
        public OwnerValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Age).GreaterThan(18).WithMessage("Age must be greater than 18.");
        }
    }
}
```

#### Étape 5 : Utilisation du Filtre dans le Point de Terminaison

Pour utiliser ce filtre avec le modèle `Owner`, appliquez-le au point de terminaison comme suit :

```csharp
app.MapPost("/api/Owner/", async (Owner owner, ApplicationDbContext context) =>
{
    context.Owners.Add(owner);
    await context.SaveChangesAsync();
    return Results.Created($"/api/Owners/{owner.Id}", owner);
})
.AddEndpointFilter<FluentValidationEndpointFilter<Owner>>() // Application du filtre de validation FluentValidation
.WithName("CreateOwner")
.Produces<Owner>(StatusCodes.Status201Created)
.Produces<Owner>(StatusCodes.Status400BadRequest);
```

### Résumé

Les **Endpoint Filters** sont disponibles à partir de **.NET 7** et permettent de gérer des fonctionnalités transversales comme la validation dans les **Minimal APIs**. Nous avons vu deux approches pour la validation :

1. **Validation avec `Validator.TryValidateObject`** : Utilisation des annotations de validation classiques dans le modèle.
2. **Validation avec **FluentValidation\*\* : Utilisation d'un validateur séparé pour une gestion plus flexible des règles de validation.

#### Installation et Configuration de FluentValidation

1. **Installation** : Installez FluentValidation via NuGet : `dotnet add package FluentValidation`.
2. **Enregistrement dans les Services** : Utilisez `AddValidatorsFromAssemblyContaining<T>()` pour enregistrer automatiquement tous les validateurs dans l'assembly.
3. **Utilisation dans le Filtre** : Créez un **Endpoint Filter** qui utilise `IValidator<T>` pour valider les objets.

Les filtres de validation sont appliqués à vos points de terminaison à l'aide de `.AddEndpointFilter<NomDuFiltre>()`, permettant ainsi de valider les données avant que l'exécution du point de terminaison ne se poursuive.
