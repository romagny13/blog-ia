---
category: Web > Asp.Net Core
title: Validation Filter
date: 2024-11-27
author: Romagny13
protected: true
---

# Guide de Validation Personnalisée dans ASP.NET Core API

## Configuration du Filtre de Validation

### 1. Création du Filtre de Validation

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

// Implémentation du filtre de validation
public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        // Vérifie si le modèle est invalide
        if (!context.ModelState.IsValid)
        {
            // Retourne une réponse 422 avec les détails des erreurs
            context.Result = new UnprocessableEntityObjectResult(context.ModelState);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
```

## Scénario 1 : Validation Ciblée (Action/Contrôleur Spécifique)

### Configuration dans `Program.cs`

```csharp
// Enregistre le filtre comme service
builder.Services.AddScoped<ValidationFilter>();

// Options importantes : désactive le filtre de validation par défaut
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    // Supprime le comportement automatique de validation de .NET
    options.SuppressModelStateInvalidFilter = true;
});

// Configuration standard des contrôleurs
builder.Services.AddControllers();
```

### Exemple d'Utilisation Ciblée

```csharp
public class UsersController : ControllerBase
{
    // Validation appliquée uniquement à cette action
    [HttpPost]
    [ServiceFilter(typeof(ValidationFilter))]
    public IActionResult Create(UserCreateDto dto)
    {
        // Action ne sera exécutée que si le modèle est valide
        return Ok();
    }

    // Cette action n'aura pas de validation automatique
    [HttpPut]
    public IActionResult Update(UserUpdateDto dto)
    {
        return Ok();
    }
}
```

### Appliquer le filtre au niveau du controller

```csharp
[TypeFilter(typeof(ValidationFilter))]
public class UsersController : ControllerBase
{

}
```

### Alternative: créer un attribut

```csharp
// Attribut pour marquer les méthodes/contrôleurs nécessitant une validation
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class ValidationFilterAttribute : TypeFilterAttribute
{
    public ValidationFilterAttribute() : base(typeof(ValidationFilter))
    {
    }
}
```

```csharp
[HttpPost]
[ValidationFilter]
public IActionResult Create(UserCreateDto dto)
{
    // Action ne sera exécutée que si le modèle est valide
    return Ok();
}
```

## Scénario 2 : Validation Automatique pour Tous les Contrôleurs

### Configuration dans `Program.cs`

```csharp
// Enregistre le filtre comme service
builder.Services.AddScoped<ValidationFilter>();

// Désactive le filtre de validation par défaut de .NET
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// Configuration des contrôleurs avec filtre global
builder.Services.AddControllers(options =>
{
    // Ajoute le filtre de validation à tous les contrôleurs
    options.Filters.Add<ValidationFilter>();
});
```

### Exemple de DTO avec Validation

```csharp
public class UserCreateDto
{
    [Required(ErrorMessage = "Le nom est obligatoire")]
    [StringLength(100, ErrorMessage = "Le nom ne doit pas dépasser 100 caractères")]
    public string Name { get; set; }

    [Required(ErrorMessage = "L'email est obligatoire")]
    [EmailAddress(ErrorMessage = "Format d'email invalide")]
    public string Email { get; set; }
}
```

## Explications Détaillées

### `SuppressModelStateInvalidFilter = true`

- Désactive le comportement de validation automatique intégré de .NET
- Permet une personnalisation complète de la gestion des erreurs de validation

### Méthodes d'Application du Filtre

1. `[ValidationFilter]` sur des actions/contrôleurs spécifiques
2. `options.Filters.Add<ValidationFilter>()` pour une application globale

### Comportement de Validation

- Intercepte les requêtes avant l'exécution de l'action
- Vérifie la validité du modèle selon les annotations
- Retourne une réponse 422 Unprocessable Entity en cas d'erreur

## Exemple de Réponse d'Erreur

```json
{
  "Name": ["Le nom est obligatoire"],
  "Email": ["Format d'email invalide"]
}
```

## Bonnes Pratiques

- Utilisez des annotations de validation claires
- Personnalisez les messages d'erreur
- Choisissez entre validation ciblée ou globale selon vos besoins
- Gardez la logique de validation simple et maintenable

## Conseils Avancés

- Pour des validations complexes, envisagez FluentValidation
- Utilisez des outils de débogage pour inspecter `ModelState`
- Documentez clairement votre stratégie de validation

---

Ce guide offre une approche flexible et puissante de la validation dans les API ASP.NET Core.
