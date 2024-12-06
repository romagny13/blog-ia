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

Un **JWT** est un standard utilisé pour transmettre des informations de manière sécurisée entre deux parties (client et serveur). Les **JSON Web Tokens (JWT)** sont stateless, flexibles et largement supportés.

### 1. **Structure d’un JWT**

Un JWT est composé de trois parties séparées par des points (`.`) :
```
header.payload.signature
```

| **Partie**  | **Description**                                                                                             | **Encodage**    |
|-------------|-------------------------------------------------------------------------------------------------------------|-----------------|
| `header`    | Métadonnées : algorithme de signature (`alg`), type (`typ`).                                                | Base64URL       |
| `payload`   | Données ou "claims" : informations sur le sujet ou des données personnalisées.                              | Base64URL       |
| `signature` | Garantit l'intégrité du token. Basée sur le `header` et le `payload` signés avec une clé secrète ou privée. | Non décodable   |

Exemple de JWT :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

### 2. **Claims dans le Payload**

Le **payload** contient des données, appelées **claims**. Ces claims peuvent être **standards** (définis par la RFC 7519) ou **personnalisés**.

### Claims standards courants

| **Claim**   | **Description**                                                                             | **Exemple**               |
|-------------|---------------------------------------------------------------------------------------------|---------------------------|
| `iss`       | **Issuer** : Identifie l'émetteur du token.                                                 | `"https://api.example.com"` |
| `sub`       | **Subject** : Identifie le sujet principal (souvent un ID utilisateur).                     | `"1234567890"`            |
| `aud`       | **Audience** : Destinataire prévu du token.                                                 | `"https://my-app.com"`    |
| `exp`       | **Expiration** : Timestamp indiquant quand le token expire.                                 | `1719235200`              |
| `nbf`       | **Not Before** : Timestamp indiquant quand le token devient valide.                         | `1719158800`              |
| `iat`       | **Issued At** : Timestamp d'émission.                                                      | `1719158800`              |
| `jti`       | **JWT ID** : Identifiant unique du token.                                                  | `"abc123"`                |

#### Claims personnalisés (exemples)
- `name`: Nom complet de l’utilisateur (ex. `"John Doe"`).
- `email`: Adresse email (ex. `"user@example.com"`).
- `role`: Rôle utilisateur (ex. `"admin"`).
- `permissions`: Liste des autorisations (ex. `["read", "write"]`).

---

### 3. **Différence entre `sub` et `NameIdentifier`**

| **Aspect**          | **`sub` (Subject)**                         | **`NameIdentifier`**                     |
|----------------------|---------------------------------------------|------------------------------------------|
| Standardisation      | Défini par la spécification JWT.            | Claim personnalisé ou spécifique au système. |
| Usage               | Identifiant unique principal.               | Utilisé dans certains frameworks (ex. ASP.NET). |
| Exemple             | `"sub": "1234567890"`                       | `"nameid": "user123"`                    |

---

### 4. **Pourquoi un JWT est sécurisé**

- **Signature numérique** :
  - Le JWT est signé avec une clé secrète ou privée.
  - Le serveur peut recalculer la signature pour vérifier l'intégrité du token.
- **Base64URL (non cryptage)** :
  - Le `header` et le `payload` sont encodés en Base64URL pour être lisibles, mais non sécurisés.
  - La sécurité repose uniquement sur la signature.

**⚠️ Ne jamais inclure d’informations sensibles non chiffrées dans le payload.**

---

### 5. **Décoder le Payload d’un JWT**

#### Exemple en **JavaScript**
1. Découper le JWT en trois parties.
2. Décoder la partie `payload` (2ᵉ partie) en Base64URL.
3. Parser la chaîne JSON obtenue.

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const payloadEncoded = token.split('.')[1];
const payloadDecoded = JSON.parse(atob(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/')));
console.log(payloadDecoded);
```

**Résultat** :
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

---

#### Exemple en **C#**
1. Découper le JWT en trois parties.
2. Décoder la partie `payload` en Base64URL.
3. Désérialiser la chaîne JSON obtenue.

```csharp
using System;
using System.Text;
using System.Text.Json;

string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Extraire le payload (2ᵉ partie)
string payloadEncoded = token.Split('.')[1];

// Décoder Base64URL
string payloadDecoded = Encoding.UTF8.GetString(
    Convert.FromBase64String(payloadEncoded + new string('=', (4 - payloadEncoded.Length % 4) % 4))
);

// Désérialiser en objet
var payload = JsonSerializer.Deserialize<JsonElement>(payloadDecoded);
Console.WriteLine(payload);
```

**Résultat** (affiché dans la console) :
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

---

### 6. **Bibliothèques**

#### 1. **JavaScript**

#### a. [jsonwebtoken (npm)](https://www.npmjs.com/package/jsonwebtoken)
La bibliothèque la plus utilisée pour gérer les JWT dans Node.js.

**Installation** :
```bash
npm install jsonwebtoken
```

**Exemple** :
```javascript
const jwt = require('jsonwebtoken');
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const decoded = jwt.decode(token); // Décodage sans vérification de signature
console.log(decoded);
```

#### b. [jwt-decode (npm)](https://www.npmjs.com/package/jwt-decode)
Une bibliothèque légère uniquement pour décoder les tokens JWT sans vérification de signature.

**Installation** :
```bash
npm install jwt-decode
```

**Exemple** :
```javascript
import jwtDecode from "jwt-decode";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const payload = jwtDecode(token);
console.log(payload);
```

---

#### 2. **C#**

##### a. [System.IdentityModel.Tokens.Jwt (NuGet)](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt)
Bibliothèque officielle pour manipuler les JWT dans les applications .NET.

**Installation** :
```bash
dotnet add package System.IdentityModel.Tokens.Jwt
```

**Exemple** :
```csharp
using System.IdentityModel.Tokens.Jwt;

string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Décoder sans validation
var handler = new JwtSecurityTokenHandler();
var decodedToken = handler.ReadJwtToken(token);
Console.WriteLine(decodedToken.Payload);
```

##### b. [Jose.JWT (NuGet)](https://www.nuget.org/packages/Jose.JWT)
Une bibliothèque légère pour manipuler les JWT, compatible avec divers algorithmes de signature.

**Installation** :
```bash
dotnet add package Jose.JWT
```

**Exemple** :
```csharp
using Jose;

string token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
string payload = JWT.Decode(token, null, JwsAlgorithm.None); // Décodage sans clé
Console.WriteLine(payload);
```

---

### 6. **Bonnes pratiques**

- **Standardiser vos claims** : Utilisez les claims standard (`sub`, `iss`, etc.) pour maximiser l’interopérabilité.
- **Limiter les données dans le payload** : Réduisez la taille et évitez d’exposer des informations inutiles.
- **Protéger le token** :
  - Stockez-le en toute sécurité (ex. `HttpOnly` cookies pour éviter les attaques XSS).
  - Utilisez TLS pour protéger les échanges.

---

#### Exemple complet de JWT

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022,
    "role": "admin"
  },
  "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

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
// Chargement des settings
//var jwtSettings = builder.Configuration.GetSection("Jwt");
// ou
var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

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
        var key = Encoding.ASCII.GetBytes(_jwtSettings.JWT_SECRET_KEY);
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                // ValidateIssuerSigningKey = true, // Valide que la signature du token correspond à la clé de signature attendue
                ValidateLifetime = false, // Ne pas valider la date d'expiration
                IssuerSigningKey = new SymmetricSecurityKey(key),
                // ClockSkew = TimeSpan.Zero // Désactive l'intervalle de tolérance de 5 minutes par défaut
            };
            var principal = tokenHandler.ValidateToken(token, validationParameters , out SecurityToken securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Token invalide");

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

**`AuthController`**

```cs
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequest)
    {
        try
        {
            var tokens = await _authService.RefreshToken(refreshTokenRequest);
            return Ok(tokens);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erreur interne du serveur.", error = ex.Message });
        }
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

### 12. **Silent Refresh**

Le "Silent Refresh" est une méthode permettant de rafraîchir un jeton d'authentification (Access Token) de manière transparente pour l'utilisateur, sans qu'il ait à se reconnecter. Ce processus utilise un "Refresh Token" qui permet de générer un nouveau "Access Token" sans demander une nouvelle authentification.

#### 1. **Configuration des services d'authentification**

Dans le fichier `Startup.cs` ou `Program.cs`, vous devez configurer l'authentification via **JWT** pour les tokens d'accès et **Cookies** pour les tokens de rafraîchissement.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    var jwtSettings = Configuration.GetSection("JwtSettings").Get<JwtSettings>();

    services.AddAuthentication(options =>
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
    })
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.HttpOnly = true; // Cookie non accessible via JavaScript
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Utiliser HTTPS uniquement
        options.Cookie.SameSite = SameSiteMode.Strict; // Prévenir les attaques CSRF
        options.Cookie.Name = "RefreshTokenCookie"; // Nom du cookie
        options.ExpireTimeSpan = TimeSpan.FromDays(7); // Durée du refresh token
    });
}
```

**Explications :**
- **JwtBearer** : Utilisé pour l'authentification des API via des tokens JWT.
- **CookieAuthentication** : Utilisé pour stocker et gérer le "Refresh Token" dans un cookie sécurisé.

#### 2. **Authentification et génération des tokens**

Ensuite, nous devons créer un point de terminaison pour gérer l'authentification (login) et générer les tokens d'accès et de rafraîchissement.

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto userForAuthentication)
{
    try
    {
        var tokens = await _authService.Login(userForAuthentication);

        Response.Cookies.Append("refreshToken", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,  // Assure que le cookie n'est pas accessible via JavaScript
            Secure = true,    // Le cookie est envoyé uniquement via HTTPS
            SameSite = SameSiteMode.Strict,  // Protéger contre les attaques CSRF
            Expires = DateTime.UtcNow.AddDays(7)  // Durée de vie du refresh token
        });

        return Ok(new { AccessToken = tokens.AccessToken });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Erreur interne du serveur.", error = ex.Message });
    }
}
```

**Explications :**
- **Login** : Cette méthode authentifie l'utilisateur, génère un Access Token et un Refresh Token, puis stocke le Refresh Token dans un cookie sécurisé.

#### 3. **Rafraîchissement des tokens (Silent Refresh)**

Le point clé du "Silent Refresh" consiste à utiliser un Refresh Token pour obtenir un nouveau Access Token sans que l'utilisateur n'ait besoin de se reconnecter manuellement. Lorsqu'un Access Token expire, le client envoie le Refresh Token au serveur pour obtenir un nouveau Access Token.

```csharp
[HttpPost("refresh-token")]
public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequest)
{
    try
    {
        // Récupérer le Refresh Token depuis les cookies
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { message = "Refresh token pas trouvé dans les cookies" });

        // Appeler la méthode pour rafraîchir le token en utilisant l'Access Token et le Refresh Token
        var tokens = await _authService.RefreshToken(refreshTokenRequest.AccessToken, refreshToken);

        // Mettre à jour le cookie avec le nouveau Refresh Token
        Response.Cookies.Append("refreshToken", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,  // Assurer la sécurité du cookie
            Secure = true,    // Envoyer uniquement sur HTTPS
            SameSite = SameSiteMode.Strict,  // Protéger contre les attaques CSRF
            Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"]))  // Durée du Refresh Token
        });

        // Retourner le nouveau Access Token
        return Ok(new { AccessToken = tokens.AccessToken });
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Erreur interne du serveur.", error = ex.Message });
    }
}
```

**Explications :**
- **RefreshToken** : Cette méthode récupère le Refresh Token depuis les cookies, puis appelle la méthode `RefreshToken` du service d'authentification pour générer un nouveau Access Token.
- **Cookies** : Le nouveau Refresh Token est stocké dans un cookie sécurisé, et un nouveau Access Token est renvoyé dans la réponse.

#### 4. **Service d'authentification et génération des tokens**

Le service d'authentification est responsable de la gestion des tokens. Il inclut la logique pour valider, générer, et rafraîchir les tokens.

```csharp
public async Task<TokenResult> RefreshToken(string accessToken, string refreshToken)
{
    // Récupérer les informations de l'utilisateur à partir du Access Token expiré
    var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
    if (principal == null)
        throw new UnauthorizedAccessException("Token invalide ou expiré.");

    var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
        throw new UnauthorizedAccessException("Utilisateur non trouvé.");

    // Vérifier la validité du Refresh Token
    var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
    if (token == null || token.UserId != userId)
        throw new UnauthorizedAccessException("Token invalide.");

    if (token.Expires < DateTime.UtcNow)
    {
        await _refreshTokenRepository.RevokeAsync(token.Token);
        throw new UnauthorizedAccessException("Token invalide.");
    }

    // Générer un nouveau Access Token et Refresh Token
    return await GenerateToken(user);
}

private async Task<TokenResult> GenerateToken(User user)
{
    // Créer les claims pour le nouveau token
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

    // Générer les tokens
    var accessToken = _tokenService.GenerateAccessToken(claims);
    var refreshToken = _tokenService.GenerateRefreshToken();

    // Sauvegarder le Refresh Token dans la base de données
    var refreshTokenEntity = new RefreshToken
    {
        Token = refreshToken,
        UserId = user.Id,
        Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"])),  // Durée de vie du Refresh Token
        Created = DateTime.UtcNow,
        IsRevoked = false
    };

    await _refreshTokenRepository.AddAsync(refreshTokenEntity);

    return new TokenResult
    {
        AccessToken = accessToken,
        RefreshToken = refreshToken
    };
}
```

**Explications :**
- **RefreshToken** : Cette méthode vérifie la validité du Refresh Token, valide l'Access Token expiré, et génère de nouveaux tokens si tout est valide.
- **GenerateToken** : Cette méthode génère un nouvel Access Token et Refresh Token, et sauvegarde le Refresh Token dans la base de données.

#### 5. **Sécurisation et gestion des tokens**

Les tokens d'accès (Access Tokens) ont une durée de vie limitée. Les Refresh Tokens sont utilisés pour obtenir un nouveau Access Token sans redemander une authentification complète. En conséquence, il est essentiel de gérer la durée de vie des Refresh Tokens, de vérifier leur validité régulièrement, et de révoquer les tokens expirés ou compromis.

