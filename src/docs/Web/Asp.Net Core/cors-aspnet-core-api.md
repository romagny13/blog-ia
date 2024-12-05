---
category: Web > Asp.Net Core
title: CORS
date: 2024-12-05
author: Romagny13
---

# CORS (Cross-Origin Resource Sharing)

Dans ce guide, nous allons explorer en détail comment gérer les **CORS (Cross-Origin Resource Sharing)** avec une **API ASP.NET Core**. Le CORS est une politique de sécurité qui permet de contrôler l'accès aux ressources d'un serveur depuis un autre domaine. Par défaut, un navigateur bloque les requêtes HTTP entre différentes origines, mais CORS permet de contourner cette restriction de manière sécurisée.

## 1. Introduction au CORS

Le CORS est une sécurité côté client qui empêche un site web de faire des requêtes AJAX vers un autre domaine sans la permission de ce dernier. Dans le contexte d'une API ASP.NET Core, nous devons configurer le serveur pour qu'il accepte les requêtes provenant de certains domaines ou de toutes les origines.

## 2. Configuration de CORS dans ASP.NET Core

Pour gérer les CORS dans une API ASP.NET Core, nous devons faire deux choses principales :

1. Définir une politique CORS dans `Program.cs` ou `Startup.cs`.
2. Appliquer cette politique via le middleware `UseCors`.

### 2.1 Ajouter et configurer CORS dans le fichier `Program.cs`

Voici comment ajouter la configuration CORS dans le fichier `Program.cs` d'une API ASP.NET Core :

```csharp
var builder = WebApplication.CreateBuilder(args);

// Ajouter la configuration CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()  // Permet toutes les origines
            .AllowAnyMethod()  // Permet toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
            .AllowAnyHeader(); // Permet tous les en-têtes
    });
});

var app = builder.Build();

// Appliquer la politique CORS
app.UseCors("CorsPolicy");

app.MapGet("/", () => "Hello World!");

app.Run();
```

## 3. Scénarios de configuration CORS

Il existe plusieurs scénarios de configuration des CORS en fonction des besoins spécifiques de votre API.

### 3.1 Scénario 1 : Autoriser toutes les origines, méthodes et en-têtes

Cette configuration est la plus permissive et permet toutes les requêtes CORS.

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .AllowAnyOrigin()  // Permet toutes les origines
            .AllowAnyMethod()  // Permet toutes les méthodes HTTP
            .AllowAnyHeader(); // Permet tous les en-têtes
    });
});
```

**Avantages** : Pratique pour le développement rapide ou les applications qui n'ont pas de restrictions de sécurité sur les origines.  
**Inconvénients** : Non sécurisé pour une utilisation en production. Cela permet à n'importe quel domaine de faire des requêtes vers votre API.

### 3.2 Scénario 2 : Autoriser des origines spécifiques

Si vous souhaitez restreindre l'accès à certaines origines, vous pouvez spécifier les domaines autorisés.

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .WithOrigins("https://www.example.com", "https://www.anotherdomain.com") // Permet uniquement ces origines
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});
```

**Avantages** : Plus sécurisé que la configuration "AllowAnyOrigin", car vous contrôlez explicitement les origines qui peuvent accéder à votre API.  
**Inconvénients** : Vous devez gérer les domaines autorisés.

### 3.3 Scénario 3 : Restreindre les méthodes HTTP autorisées

Si vous souhaitez autoriser seulement certaines méthodes HTTP (par exemple, uniquement les `GET` et `POST`), vous pouvez configurer cela dans la politique CORS.

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .AllowAnyOrigin()
            .WithMethods("GET", "POST")  // Seules les méthodes GET et POST sont autorisées
            .AllowAnyHeader();
    });
});
```

**Avantages** : Permet un contrôle plus strict sur les méthodes autorisées.  
**Inconvénients** : Si vous devez ajouter de nouvelles méthodes plus tard (comme `PUT` ou `DELETE`), vous devrez modifier cette configuration.

### 3.4 Scénario 4 : Autoriser des en-têtes personnalisés

Si vous devez accepter des en-têtes personnalisés dans les requêtes CORS, vous pouvez les spécifier dans la configuration CORS.

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .WithHeaders("Content-Type", "Authorization", "X-Custom-Header"); // Autorise certains en-têtes spécifiques
    });
});
```

**Avantages** : Pratique pour accepter des en-têtes spécifiques nécessaires pour les authentifications ou d'autres données personnalisées.  
**Inconvénients** : Vous devrez ajouter chaque en-tête personnalisé que votre application utilise.

## 4. Application de la politique CORS à des routes spécifiques

Si vous ne voulez pas appliquer la politique CORS globalement, vous pouvez l'appliquer uniquement à certaines routes ou contrôleurs. Voici comment procéder dans un contrôleur ou une action spécifique :

### 4.1 Appliquer CORS à une action ou un contrôleur spécifique

```csharp
[ApiController]
[Route("api/[controller]")]
public class MyController : ControllerBase
{
    // Appliquer la politique CORS uniquement à cette action
    [HttpGet]
    [EnableCors("CorsPolicy")]
    public IActionResult Get()
    {
        return Ok("CORS est autorisé pour cette action");
    }

    // Appliquer une autre politique CORS à ce contrôleur
    [HttpPost]
    [DisableCors] // Désactive CORS pour cette action spécifique
    public IActionResult Post()
    {
        return Ok("CORS est désactivé pour cette action");
    }
}
```

### 4.2 Appliquer CORS globalement

Dans `Program.cs`, vous appliquez la politique CORS à toutes les requêtes via `app.UseCors("CorsPolicy")`.

```csharp
app.UseCors("CorsPolicy");
```

## 5. Cas d'utilisation pratiques

### 5.1 API REST pour un site web et une application mobile

Imaginons que vous ayez une API REST qui sert à la fois un site web et une application mobile. Vous pouvez appliquer CORS différemment pour chaque plateforme.

- Pour le site web, vous pouvez autoriser uniquement l'origine `https://www.monsiteweb.com`.
- Pour l'application mobile, vous pouvez autoriser l'origine `https://www.monappmobile.com`.

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .WithOrigins("https://www.monsiteweb.com")
            .WithMethods("GET", "POST")
            .AllowAnyHeader();
    });

    options.AddPolicy("MobileCorsPolicy", builder =>
    {
        builder
            .WithOrigins("https://www.monappmobile.com")
            .WithMethods("GET")
            .AllowAnyHeader();
    });
});
```

Ensuite, vous pouvez appliquer la politique appropriée dans les contrôleurs ou globalement.

### 5.2 API avec authentification

Si votre API nécessite une authentification (par exemple via un token JWT), assurez-vous que la politique CORS autorise les en-têtes nécessaires pour transmettre ce token :

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .WithHeaders("Authorization", "Content-Type");
    });
});
```

## 6. Méthode d'extension

Créer une méthode d'extension pour configurer CORS dans la collection de services (`IServiceCollection`) dans une application ASP.NET Core permet de rendre la configuration CORS plus réutilisable et modulable. Cela vous permet de centraliser la configuration CORS, particulièrement si vous avez plusieurs API ou des configurations CORS complexes. Voici comment vous pouvez procéder.

### 1. Création d'une méthode d'extension pour `IServiceCollection`

Une méthode d'extension est une manière de "compléter" des classes sans modifier directement leur code source. Nous allons créer une méthode d'extension pour ajouter la configuration CORS dans `IServiceCollection`.

#### Étapes :

1. Créez un fichier pour votre méthode d'extension, par exemple, `CorsServiceCollectionExtensions.cs`.
2. Dans ce fichier, créez une méthode d'extension statique pour ajouter la configuration CORS à la collection de services.

Voici un exemple de code pour une méthode d'extension qui ajoute des configurations CORS dans `IServiceCollection` :

```csharp
public static class CorsServiceCollectionExtensions
{
    public static IServiceCollection AddCustomCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", builder =>
            {
                builder
                    .AllowAnyOrigin()  // Permet toutes les origines
                    .AllowAnyMethod()  // Permet toutes les méthodes HTTP
                    .AllowAnyHeader(); // Permet tous les en-têtes
            });

            options.AddPolicy("RestrictedCorsPolicy", builder =>
            {
                builder
                    .WithOrigins("https://www.example.com")  // Permet uniquement cette origine
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        return services;
    }
}
```

### 2. Utilisation de la méthode d'extension dans `Program.cs`

Une fois que vous avez créé votre méthode d'extension, il vous suffit de l'utiliser dans votre fichier `Program.cs` (ou `Startup.cs` si vous utilisez cette approche dans une version antérieure d'ASP.NET Core).

Voici comment vous pouvez l'utiliser dans `Program.cs` :

```csharp
var builder = WebApplication.CreateBuilder(args);

// Utilisation de la méthode d'extension pour ajouter CORS
builder.Services.AddCustomCors();

var app = builder.Build();

// Appliquer la politique CORS
app.UseCors("CorsPolicy");

app.MapGet("/", () => "Hello World!");

app.Run();
```

### 3. Personnalisation des politiques CORS dans la méthode d'extension

Si vous avez besoin de différentes configurations CORS pour différentes situations, vous pouvez personnaliser la méthode d'extension en ajoutant des paramètres. Par exemple, vous pouvez ajouter des options de configuration pour les origines, les méthodes ou les en-têtes que vous souhaitez autoriser :

```csharp
public static class CorsServiceCollectionExtensions
{
    public static IServiceCollection AddCustomCors(this IServiceCollection services, string[] allowedOrigins)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", builder =>
            {
                builder
                    .WithOrigins(allowedOrigins)  // Utilise les origines spécifiées
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });

            options.AddPolicy("RestrictedCorsPolicy", builder =>
            {
                builder
                    .WithOrigins("https://www.example.com")  // Origine spécifique
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        return services;
    }
}
```

Ensuite, vous pouvez appeler cette méthode avec une liste d'origines dans `Program.cs` :

```csharp
var builder = WebApplication.CreateBuilder(args);

string[] allowedOrigins = new[] { "https://www.mysite.com", "https://www.anotherdomain.com" };

// Utilisation de la méthode d'extension avec des origines dynamiques
builder.Services.AddCustomCors(allowedOrigins);

var app = builder.Build();

// Appliquer la politique CORS
app.UseCors("CorsPolicy");

app.MapGet("/", () => "Hello World!");

app.Run();
```

### 4. Avantages de la méthode d'extension

Voici quelques avantages à utiliser une méthode d'extension pour configurer CORS :

- **Réutilisabilité** : Vous pouvez facilement appliquer la même configuration CORS dans plusieurs projets ou dans différentes parties de votre application.
- **Modularité** : La configuration CORS peut être séparée du reste du code, ce qui facilite la maintenance.
- **Facilité de mise à jour** : Lorsque vous devez modifier la configuration CORS, vous n'avez qu'à modifier la méthode d'extension et cela affectera tout le projet.

## 7. Conclusion

Gérer CORS dans une API ASP.NET Core permet de garantir que seules les origines autorisées peuvent accéder aux ressources du serveur. En fonction de vos besoins, vous pouvez définir des politiques très flexibles pour autoriser ou restreindre les origines, méthodes HTTP et en-têtes.

En résumé, voici les étapes clés :

1. Ajouter CORS dans `Program.cs` via `AddCors`.
2. Définir des politiques CORS appropriées (origines, méthodes, en-têtes).
3. Appliquer la politique via `UseCors` globalement ou localement sur certaines actions/routes.

N'oubliez pas que CORS doit être configuré en fonction des exigences de sécurité de votre application pour éviter toute vulnérabilité potentielle.
