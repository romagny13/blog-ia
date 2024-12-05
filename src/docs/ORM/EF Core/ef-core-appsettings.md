---
category: ORM > EF Core
title: EF Core & appsettings
date: 2024-12-05
author: Romagny13
---

# EF Core & appsettings

Voici un guide complet adapté pour **.NET 6+** qui vous explique comment gérer les chaînes de connexion entre les environnements de développement et de production, ainsi que comment configurer **Entity Framework Core (EF Core)** pour fonctionner correctement dans ces deux environnements.

---

## 1. **Gestion des fichiers de configuration (appsettings.json et appsettings.{Environment}.json)**

Dans .NET 6+, la configuration est principalement gérée via des fichiers `appsettings.json` et des fichiers spécifiques à l'environnement, comme `appsettings.Development.json` ou `appsettings.Production.json`. Ces fichiers permettent de définir des paramètres de configuration (y compris les chaînes de connexion) qui sont adaptés à chaque environnement.

### Exemple de `appsettings.json` (configuration par défaut)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=YourLocalDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### Exemple de `appsettings.Production.json` (configuration pour la production)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:yourserver.database.windows.net,1433;Initial Catalog=yourdatabase;Persist Security Info=False;User ID=youruser;Password=yourpassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

### 2. **Chargement des configurations en fonction de l'environnement**

Dans .NET 6+, ASP.NET Core chargera automatiquement les configurations appropriées en fonction de la variable d'environnement `ASPNETCORE_ENVIRONMENT`. Par exemple, si l'application fonctionne en mode **Développement**, elle lira le fichier `appsettings.Development.json`, et si elle fonctionne en **Production**, elle lira `appsettings.Production.json`.

### 3. **Configuration du `DbContext` dans `Program.cs`**

Dans .NET 6+, toute la configuration de l'application (y compris les services comme le `DbContext`) se fait dans le fichier `Program.cs`. Ce fichier remplace le fichier `Startup.cs` utilisé dans les versions précédentes de .NET Core.

Voici comment configurer le `DbContext` pour utiliser la chaîne de connexion appropriée :

```csharp
var builder = WebApplication.CreateBuilder(args);

// Ajout du DbContext avec la chaîne de connexion choisie en fonction de l'environnement
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ajoutez d'autres services ici...
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configuration des middlewares
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

### 4. **Définir la variable d'environnement `ASPNETCORE_ENVIRONMENT`**

L'application .NET Core détermine l'environnement en fonction de la valeur de la variable `ASPNETCORE_ENVIRONMENT`. Cela permet de charger les fichiers de configuration appropriés.

#### Environnement local (Développement)

Lorsque vous exécutez votre application localement, l'environnement est par défaut `Development`. Si vous utilisez Visual Studio, l'environnement sera déjà défini à `Development`, mais vous pouvez également le spécifier dans la ligne de commande en utilisant :

```bash
dotnet run --environment "Development"
```

#### Environnement de production (Azure)

Sur Azure, vous pouvez définir l'environnement via les paramètres d'application dans **Azure App Services**. Allez dans le **Azure Portal**, sélectionnez votre application dans **App Services**, puis sous **Configuration**, ajoutez une nouvelle **variable d'application** nommée `ASPNETCORE_ENVIRONMENT` avec la valeur `Production`.

### 5. **Utilisation de variables d'environnement pour des informations sensibles**

Il est important de ne pas inclure d'informations sensibles, comme les mots de passe de base de données, dans vos fichiers `appsettings.json` pour la production. Utilisez plutôt des variables d'environnement ou Azure Key Vault pour stocker ces informations.

#### Exemple d'utilisation de variables d'environnement :
Dans votre fichier `appsettings.Production.json`, vous pouvez faire référence à des variables d'environnement, comme suit :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:yourserver.database.windows.net,1433;Initial Catalog=yourdatabase;Persist Security Info=False;User ID=%DB_USER%;Password=%DB_PASSWORD%;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

Ensuite, dans votre environnement de production (par exemple, Azure), vous définissez les variables d'environnement `DB_USER` et `DB_PASSWORD`.

#### Exemple de définition de variables d'environnement dans Azure :
Dans **Azure App Services**, allez dans **Configuration** > **Variables d'application** et ajoutez les variables d'application suivantes :

- `DB_USER`: `youruser`
- `DB_PASSWORD`: `yourpassword`

### 6. **Gestion des migrations de base de données en production**

Pour appliquer les migrations EF Core en production, vous pouvez choisir entre deux approches :

#### a. Appliquer automatiquement les migrations au démarrage de l'application

Vous pouvez ajouter le code pour appliquer automatiquement les migrations lorsque l'application démarre. Cela est particulièrement utile pour les environnements de production où vous souhaitez que les migrations soient appliquées chaque fois que l'application se lance.

Dans le fichier `Program.cs`, vous pouvez ajouter ceci :

```csharp
var app = builder.Build();

// Appliquer les migrations au démarrage de l'application
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
```

Cette approche garantit que toutes les migrations seront appliquées dès que l'application démarrera en production, ce qui peut être utile pour éviter toute intervention manuelle.

#### b. Appliquer les migrations manuellement via la ligne de commande

Si vous préférez appliquer les migrations manuellement, vous pouvez vous connecter à votre serveur Azure via la ligne de commande et exécuter la commande suivante :

```bash
dotnet ef database update --connection "YourAzureConnectionString"
```

### 7. **Résumé et meilleures pratiques**

1. **Utiliser des fichiers `appsettings` distincts** pour chaque environnement (`appsettings.Development.json`, `appsettings.Production.json`) pour configurer les chaînes de connexion et autres paramètres spécifiques à chaque environnement.
2. **Chargement automatique des configurations** : .NET 6+ détecte automatiquement l'environnement (`Development`, `Production`, etc.) et charge le fichier de configuration approprié.
3. **Utiliser des variables d'environnement** pour stocker des informations sensibles comme les mots de passe de base de données.
4. **Gérer les migrations de manière appropriée** : Appliquez les migrations automatiquement au démarrage en production ou appliquez-les manuellement selon vos préférences.

Avec cette approche, vous pouvez garantir que votre application fonctionne de manière fluide et sécurisée tant en développement qu'en production.