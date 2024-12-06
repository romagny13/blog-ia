---
category: Web > Asp.Net Core
title: JWT
date: 2024-11-27
author: Romagny13
---

# Gestion des **Access Tokens** et **Refresh Tokens** avec ASP.NET Core API

Ce guide détaille une approche sécurisée, évolutive et bien structurée pour gérer les **access tokens** et **refresh tokens** dans une API ASP.NET Core, tout en intégrant des optimisations et bonnes pratiques adaptées à un MVP et à un déploiement en production.

---

## 1. **Comprendre les Rôles des Tokens**

- **Access Token** :
  - Utilisé pour authentifier les requêtes API.
  - Doit avoir une durée de vie courte (15-60 minutes).
  - Contient des informations nécessaires (claims) pour valider les droits d'accès.
- **Refresh Token** :
  - Permet d’obtenir un nouveau access token sans authentification supplémentaire.
  - Durée de vie plus longue (plusieurs jours à semaines).
  - Doit être stocké et géré côté serveur pour éviter toute compromission.

---

## 2. **Adopter JWT pour les Access Tokens**

Les **JSON Web Tokens (JWT)** sont stateless, flexibles et largement supportés.

#### Structure du JWT :

1. **Header** : Définit l'algorithme de signature (par ex., HS256 ou RS256).
2. **Payload** : Contient les données utilisateur (claims).
3. **Signature** : Valide l'intégrité du token.

#### Avantages :

- Pas besoin de requêtes serveur pour valider un JWT.
- Peut inclure des données pertinentes comme les rôles, permissions, etc.

---

## 3. Packages

### Installation des dépendances

Pour commencer, il est nécessaire d’ajouter le package `Microsoft.AspNetCore.Authentication.JwtBearer` à votre projet ASP.NET Core. Ce package fournit les outils pour intégrer l'authentification basée sur JWT.

- **Depuis la console Package Manager (PMC)** :
  ```bash
  Install-Package Microsoft.AspNetCore.Authentication.JwtBearer
  ```
- **Dans le fichier `.csproj`**, en fonction de votre version du framework :
  ```xml
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="6.0.36" />
  ```

---

## 4. Issuer et Audience

### Concepts

- **Issuer** : L'**émetteur** est l'entité responsable de la génération du token. Cela permet de vérifier que le token provient d'une source fiable. Généralement, c'est l'URL de l'API ou du service générant le token.
- **Audience** : Le **public visé** est l'application ou le service qui consomme le token. Cela empêche qu'un token destiné à un service soit utilisé par un autre.

### Exemple Pratique

Si votre API tourne localement :

- **Issuer** : `https://localhost:5001` (l'émetteur du token est l'API elle-même).
- **Audience** : `http://localhost:5173` (le destinataire est une application frontend).

Dans une architecture complexe, **Issuer** pourrait être un service d'identité externe (comme Auth0), et **Audience** représenterait une API consommant le token.

---

## 5. Configuration

### Paramètres dans `appsettings.json`

Les paramètres liés à JWT sont souvent définis dans les fichiers `appsettings.json`. Voici deux exemples : un pour l’environnement de **développement** et un pour **production**.

#### appsettings.Development.json

```json
"Jwt": {
  "Issuer": "https://localhost:5001",
  "Audience": "http://localhost:5173",
  "AccessTokenExpirationMinutes": "15",
  "RefreshTokenExpirationDays": "7",
  "JWT_SECRET_KEY": "votre-cle-secrete-super-securisee-et-unique-pour-les-tests"
}
```

- **JWT_SECRET_KEY** : Une clé secrète utilisée pour signer les tokens. Elle doit être longue et sécurisée.
- **AccessTokenExpirationMinutes** : Durée de vie en minutes du jeton d'accès.
- **RefreshTokenExpirationDays** : Durée de vie des jetons de rafraîchissement.

#### appsettings.Production.json

```json
"KeyVault": {
  "Url": "https://my-keyvault.vault.azure.net/"
},
"Jwt": {
  "Issuer": "https://my-api.azurewebsites.net",
  "Audience": "https://my-react-app.azurewebsites.net",
  "AccessTokenExpirationMinutes": "15",
  "RefreshTokenExpirationDays": "7"
}
```

- En **production**, les secrets sensibles (comme `JWT_SECRET_KEY`) sont généralement stockés dans un service comme **Azure Key Vault** pour des raisons de sécurité.

---

### Chargement des paramètres dans `Program.cs`

Le fichier `Program.cs` est le point d’entrée où vous configurez les services. Voici comment gérer les configurations JWT et Key Vault.

#### Explications

- **Détection de l'environnement** : Identifie si l'application est en mode `Development` ou `Production`.
- **Chargement depuis Key Vault** : En production, les clés secrètes sont récupérées depuis **Azure Key Vault**.

#### Code

```csharp
var environment = builder.Environment.EnvironmentName; // "Development" ou "Production"

if (environment == "Production")
{
    var keyVaultUrl = builder.Configuration["KeyVault:Url"];
    if (!string.IsNullOrEmpty(keyVaultUrl))
    {
        builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUrl), new DefaultAzureCredential());
    }
}
```

---

### Middleware pour JWT

L'étape suivante est d’ajouter l’authentification JWT dans le pipeline.

#### Explications

- **Validation des tokens** : Configure les règles pour vérifier que le token est valide (émetteur, audience, signature, durée de vie, etc.).
- **Clé secrète** : Utilisée pour décoder la signature du token.

#### Code

```csharp
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.JWT_SECRET_KEY))
    };
});
```

---

## 6. Token Service

### Explications

Un **service de token** centralise la logique liée aux tokens (génération, validation, etc.). Cela permet une gestion plus claire et réutilisable.

#### Fonctions Clés

1. **GenerateAccessToken** : Crée un token JWT avec des claims spécifiques.
2. **GenerateRefreshToken** : Génère un token de rafraîchissement unique.
3. **GetPrincipalFromExpiredToken** : Extrait les informations d’un token expiré (utile pour le renouvellement).

#### Code

Interface **`ITokenService`**

```csharp
public interface ITokenService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
```

Implémentation de **`TokenService`**

```csharp
public class TokenService : ITokenService
{
    // Constructeur pour injecter les paramètres JWT
    public TokenService(JwtSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        // Utilisation de la clé secrète pour signer le token
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.JWT_SECRET_KEY));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Création du token
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_jwtSettings.AccessTokenExpirationMinutes)),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        // Génère un token aléatoire pour le rafraîchissement
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        // Permet de récupérer les informations même si le token est expiré
        var key = Encoding.ASCII.GetBytes(_jwtSettings.JWT_SECRET_KEY);
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
```

---

## 7. Gestion des Refresh Tokens

### Explications

Les tokens de rafraîchissement permettent de renouveler un token JWT expiré sans demander à l'utilisateur de se reconnecter. Ils sont stockés en base de données pour validation et révocation si nécessaire.

### Entité RefreshToken

```csharp
public class RefreshToken
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string Token { get; set; }
    public DateTime Expires { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Revoked { get; set; }
}
```

### Repository

Un **repository** encapsule la logique d'accès à la base de données pour gérer les tokens.

#### Code

```csharp
public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ApplicationDbContext _context;

    public RefreshTokenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken> GetByTokenAsync(string token)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);
    }

    public async Task<RefreshToken> GetByUserIdAsync(string userId)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.UserId == userId && !rt.IsRevoked);
    }

    public async Task AddAsync(RefreshToken refreshToken)
    {
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> RevokeAsync(string token)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken != null)
        {
            refreshToken.IsRevoked = true;
            refreshToken.Revoked = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }
        return false;
    }
}
```

---

### Génération des Tokens

Lorsqu'un utilisateur se connecte, un **token d'accès** et un **token de rafraîchissement** sont générés et retournés. Ces tokens permettent d'assurer une gestion sécurisée de l'authentification et du renouvellement de session.

### Types de génération de tokens :

- **Login** : Création des tokens après une connexion classique (avec un nom d'utilisateur et un mot de passe).
- **ExternalLogin** : Création des tokens après une connexion via un fournisseur externe (par exemple, Google, Facebook, etc.).
- **RefreshToken** : Utilisation d'un **refresh token** pour obtenir un nouveau **token d'accès** lorsque celui-ci a expiré.

Ces actions de génération de tokens sont généralement effectuées dans le **`AuthService`** ou le **`AuthController`** de l'application.

```csharp
private async Task<object> GenerateToken(User user)
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName)
    };

    var roles = await _userManager.GetRolesAsync(user);
    foreach (var role in roles)
    {
        claims.Add(new Claim(ClaimTypes.Role, role));
    }

    var accessToken = _tokenService.GenerateAccessToken(claims);
    var refreshToken = _tokenService.GenerateRefreshToken();

    // Enregistre le Refresh Token en base
    var refreshTokenEntity = new RefreshToken
    {
        Token = refreshToken,
        UserId = user.Id,
        Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"])),
        Created = DateTime.UtcNow,
        IsRevoked = false
    };

    await _refreshTokenRepository.AddAsync(refreshTokenEntity);

    return new { AccessToken = accessToken, RefreshToken = refreshToken };
}
```

### 8. **Sécuriser les Communications**

1. **Utilisez HTTPS** : Évitez toute interception de tokens.
2. **Minimisez les Claims** : Incluez uniquement les informations nécessaires.
3. **Révoquez les Tokens Compromis** :
   - Ajoutez une option de déconnexion.
   - Supprimez les refresh tokens en cas de changement de mot de passe ou de soupçon de compromission.

---

### 9. **Configurer des Endpoints Sécurisés**

1. **/login** : Authentifie l'utilisateur et délivre les tokens.
2. **/refresh-token** : Rafraîchit les tokens.
3. **/logout** : Révoque tous les refresh tokens associés.

---

### 10. **Surveiller et Logger les Activités**

- Loggez les utilisations des tokens, les échecs de validation et les anomalies.
- Implémentez un mécanisme d’alerte pour les tentatives de rafraîchissement excessives.

---

### 11. **Résumé des Meilleures Pratiques**

1. **JWT pour les Access Tokens** avec une signature sécurisée.
2. **Refresh Tokens** stockés côté serveur, avec gestion des expirations et révocations.
3. **Rotation des Refresh Tokens** pour prévenir les abus.
4. **Sécurisation avec HTTPS** et middleware de validation robuste.
5. **Endpoints sécurisés** et surveillance active.

---

En suivant ce guide, vous assurez une gestion sécurisée et efficace des tokens tout en respectant les principes d’un MVP. Vous pouvez progressivement ajouter des fonctionnalités avancées, telles que la journalisation centralisée ou une gestion fine des autorisations.
