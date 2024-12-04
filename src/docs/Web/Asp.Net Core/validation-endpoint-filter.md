---
category: Web > Asp.Net Core
title: Validation Endpoint Filter
date: 2024-11-27
author: Romagny13
protected: true
---

# Guide de Validation avec `IEndpointFilter` dans les **Minimal APIs** ASP.NET Core (.NET 7+)

Dans **ASP.NET Core 7 et versions ultérieures**, les **Minimal APIs** permettent de créer des API REST avec une configuration simplifiée. Une fonctionnalité utile que vous pouvez intégrer dans vos points de terminaison est la **validation des modèles**. Dans ce guide, nous allons explorer deux façons de valider des objets dans les Minimal APIs : en utilisant `Validator.TryValidateObject` dans un **endpoint filter générique** et avec **FluentValidation**.

### Prérequis

- .NET 7 ou version supérieure
- Un projet Minimal API ASP.NET Core
- Les classes de modèle avec des annotations de validation (par exemple, `Required`, `StringLength`, etc.)

## 1. Validation avec `Validator.TryValidateObject` dans un filtre générique

Nous allons commencer par créer un **endpoint filter** générique qui valide n'importe quel modèle à l'aide de `Validator.TryValidateObject`. Ce filtre permet de valider des objets de type générique dans les points de terminaison de l'API, ce qui rend le code réutilisable et réduit la duplication.

### Étapes pour créer un **ValidationEndpointFilter<T>** générique :

#### 1.1. Création du filtre de validation

Nous allons créer un filtre de validation générique qui pourra être utilisé avec n'importe quel modèle, sans avoir à dupliquer la logique de validation pour chaque type spécifique.

Voici le code de la classe `ValidationEndpointFilter<T>` :

```csharp
using System.ComponentModel.DataAnnotations;

namespace APINet7.EndpointFilters
{
    public class ValidationEndpointFilter<T> : IEndpointFilter
    {
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext efiContext, EndpointFilterDelegate next)
        {
            // Récupère l'argument du type T (ici, le modèle générique)
            var model = efiContext.GetArgument<T>(0);

            // Liste pour contenir les résultats de validation
            var results = new List<ValidationResult>();

            // Valide l'objet à l'aide de Validator.TryValidateObject
            var isValid = Validator.TryValidateObject(model, new ValidationContext(model), results, true);

            // Si l'objet n'est pas valide, retourne une erreur de validation
            if (!isValid)
                return Results.ValidationProblem(ToDictionary(results));

            // Si l'objet est valide, continue l'exécution du pipeline
            return await next(efiContext);
        }

        // Méthode utilitaire pour convertir les résultats de validation en un dictionnaire
        private IDictionary<string, string[]> ToDictionary(IEnumerable<ValidationResult> results)
        {
            var dictionary = new Dictionary<string, string[]>();

            foreach (var validationResult in results)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    if (!dictionary.ContainsKey(memberName))
                    {
                        dictionary[memberName] = new string[] { validationResult.ErrorMessage };
                    }
                    else
                    {
                        var messages = dictionary[memberName].ToList();
                        messages.Add(validationResult.ErrorMessage);
                        dictionary[memberName] = messages.ToArray();
                    }
                }
            }

            return dictionary;
        }
    }
}
```

### Explication :

1. **Généricité avec le type `T`** :

   - La classe `ValidationEndpointFilter<T>` est générique et peut être utilisée pour valider n'importe quel type d'objet.
   - Cela permet de réutiliser le même filtre pour différents types (par exemple, `Owner`, `Product`, etc.), sans avoir à créer plusieurs filtres spécifiques.

2. **Validation avec `Validator.TryValidateObject`** :

   - Le filtre utilise la méthode `Validator.TryValidateObject`, qui permet de valider un objet en fonction des annotations de validation définies sur ses propriétés (par exemple, `[Required]`, `[StringLength]`).
   - Si l'objet est valide, le traitement continue avec `next(efiContext)` ; sinon, une réponse d'erreur de validation est renvoyée.

3. **Méthode `ToDictionary`** :
   - Cette méthode permet de convertir la liste des erreurs de validation en un format compatible avec `ValidationProblem`, où chaque clé est un nom de propriété et chaque valeur est une liste de messages d'erreur associés à cette propriété.

#### 1.2. Utilisation du filtre dans un point de terminaison

Une fois le filtre créé, vous pouvez l'utiliser dans un point de terminaison pour valider le modèle avant de l'enregistrer ou de l'utiliser dans votre logique.

Voici un exemple d'utilisation du filtre dans un point de terminaison `POST` :

```csharp
app.MapPost("/api/Owner/", async (Owner owner, ApplicationDbContext context) =>
{
    context.Owners.Add(owner);
    await context.SaveChangesAsync();
    return Results.Created($"/api/Owners/{owner.Id}", owner);
})
.AddEndpointFilter<ValidationEndpointFilter<Owner>>()  // Application du filtre générique pour Owner
.WithName("CreateOwner")
.Produces<Owner>(StatusCodes.Status201Created)
.Produces<Owner>(StatusCodes.Status400BadRequest);
```

Dans cet exemple :

- Le filtre `ValidationEndpointFilter<Owner>` est appliqué au point de terminaison.
- Si l'objet `owner` est valide, la logique continue et l'objet est ajouté à la base de données. Si l'objet n'est pas valide, une réponse d'erreur de validation est renvoyée avec les détails de l'erreur.

---

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
