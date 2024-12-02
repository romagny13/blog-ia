---
category: Web > Asp.Net Core
title: OData
date: 2024-12-02
author: Romagny13
---

# Guide sur OData avec ASP.NET Core et Comparaison avec GraphQL

OData (Open Data Protocol) est une norme pour la construction d'API RESTful, particulièrement efficace pour exposer des données et effectuer des requêtes complexes. Avec ASP.NET Core, OData permet de créer facilement des API performantes et standardisées.

---

## **1. Introduction à OData**

OData permet :
- **Filtrage des données** : `$filter=age gt 30`
- **Tri** : `$orderby=name desc`
- **Pagination** : `$top=10&$skip=20`
- **Projection** : `$select=name,age`
- **Expansions** : `$expand=orders`

OData est intégré dans l'écosystème Microsoft et est bien adapté aux systèmes qui nécessitent des opérations complexes sur les données (comme les bases de données relationnelles).

---

## **2. Configuration de OData dans ASP.NET Core**

### **Étape 1 : Installation**
Ajoutez les packages nécessaires via NuGet :
```bash
dotnet add package Microsoft.AspNetCore.OData
```

### **Étape 2 : Configuration dans `Program.cs`**
Modifiez le pipeline d'ASP.NET Core pour activer OData :
```csharp
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Routing.Conventions;
using Microsoft.OData.ModelBuilder;

var builder = WebApplication.CreateBuilder(args);

// Configure OData
builder.Services.AddControllers()
    .AddOData(opt =>
        opt.Select().Filter().Expand().OrderBy().SetMaxTop(100).Count()
        .AddRouteComponents("odata", GetEdmModel()));

var app = builder.Build();
app.UseRouting();
app.UseEndpoints(endpoints => endpoints.MapControllers());
app.Run();

// Define EDM model
IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EntitySet<Customer>("Customers");
    return builder.GetEdmModel();
}
```

### **Étape 3 : Création des contrôleurs**
Créez un contrôleur OData pour exposer vos données :
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

[Route("odata/[controller]")]
public class CustomersController : ODataController
{
    private static readonly List<Customer> Customers = new()
    {
        new Customer { Id = 1, Name = "Alice", Age = 30 },
        new Customer { Id = 2, Name = "Bob", Age = 25 },
    };

    [EnableQuery]
    public IActionResult Get() => Ok(Customers);
}

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}
```

---

## **3. Fonctionnalités principales de OData**
- **Requêtes dynamiques** : Clients peuvent composer des requêtes comme :
  ```http
  GET /odata/Customers?$filter=Age gt 25&$orderby=Name desc&$select=Name
  ```
- **Conventions RESTful** : OData suit les conventions HTTP (GET, POST, PUT, DELETE, PATCH).
- **Prise en charge des relations** : Utilisation de `$expand` pour inclure des entités liées.

---

## **4. Comparaison : OData vs GraphQL**

| **Critère**                | **OData**                                                                                   | **GraphQL**                                                                                     |
|----------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| **Nature**                 | Basé sur REST, construit sur des conventions HTTP.                                          | Langage de requête pour les API, spécifie exactement ce dont on a besoin.                     |
| **Requêtes**               | Utilise des paramètres d'URL (`$filter`, `$expand`, `$orderby`, etc.).                      | Utilise des requêtes complexes dans le corps de la demande.                                   |
| **Performances**           | Bonne pour les opérations CRUD simples et optimisée pour les bases relationnelles.          | Peut être plus performant pour des données imbriquées grâce à sa flexibilité.                |
| **Courbe d'apprentissage** | Facile à configurer et à utiliser pour les API CRUD.                                        | Plus complexe à apprendre et à configurer.                                                   |
| **Flexibilité**            | Limité à ses conventions (`$filter`, `$expand`), moins flexible pour les transformations.   | Très flexible, permet de définir des requêtes sur mesure et de combiner plusieurs types.      |
| **Communauté**             | Principalement utilisé dans l’écosystème Microsoft.                                         | Large communauté dans divers langages et frameworks.                                         |
| **Typage**                 | Typage statique basé sur le modèle EDM.                                                     | Typage défini dans le schéma GraphQL (SDL).                                                  |
| **Scénarios adaptés**      | Idéal pour des APIs basées sur des bases de données relationnelles et des besoins CRUD.     | Idéal pour des APIs avec des données imbriquées ou des scénarios clients complexes.          |

---

## **5. Quand choisir OData ou GraphQL ?**

- **Choisir OData** :
  - Vous travaillez dans un écosystème Microsoft.
  - Vous avez besoin de CRUD rapide avec peu de transformations.
  - Vos données sont principalement relationnelles.

- **Choisir GraphQL** :
  - Vos clients consomment des données fortement imbriquées.
  - Vous avez des besoins de personnalisation élevés côté client.
  - Vous voulez réduire les surcharges d'appels multiples.

---

## **6. Exemple de requêtes : OData vs GraphQL**

### **OData**
```http
GET /odata/Customers?$filter=Age gt 25&$expand=Orders
```

### **GraphQL**
```graphql
query {
  customers(filter: { age: { gt: 25 } }) {
    id
    name
    orders {
      id
      total
    }
  }
}
```

---

## **7. Conclusion**

- OData est une excellente solution si vous travaillez dans un environnement Microsoft ou que vous avez des besoins CRUD standard.
- GraphQL est plus approprié pour des APIs nécessitant une grande flexibilité et une interaction complexe avec les clients.

Si vous avez des questions ou des cas spécifiques, n’hésitez pas à demander !