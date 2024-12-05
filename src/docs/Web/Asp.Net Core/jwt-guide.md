---
category: Web > Asp.Net Core
title: JWT
date: 2024-11-27
author: Romagny13
---

# Gestion des **Access Tokens** et **Refresh Tokens** avec ASP.NET Core API

Ce guide détaille une approche sécurisée, évolutive et bien structurée pour gérer les **access tokens** et **refresh tokens** dans une API ASP.NET Core, tout en intégrant des optimisations et bonnes pratiques adaptées à un MVP et à un déploiement en production.

---

### 1. **Comprendre les Rôles des Tokens**

- **Access Token** :
  - Utilisé pour authentifier les requêtes API.
  - Doit avoir une durée de vie courte (15-60 minutes).
  - Contient des informations nécessaires (claims) pour valider les droits d'accès.
- **Refresh Token** :
  - Permet d’obtenir un nouveau access token sans authentification supplémentaire.
  - Durée de vie plus longue (plusieurs jours à semaines).
  - Doit être stocké et géré côté serveur pour éviter toute compromission.

---

### 2. **Adopter JWT pour les Access Tokens**

Les **JSON Web Tokens (JWT)** sont stateless, flexibles et largement supportés.

#### Structure du JWT :

1. **Header** : Définit l'algorithme de signature (par ex., HS256 ou RS256).
2. **Payload** : Contient les données utilisateur (claims).
3. **Signature** : Valide l'intégrité du token.

#### Avantages :

- Pas besoin de requêtes serveur pour valider un JWT.
- Peut inclure des données pertinentes comme les rôles, permissions, etc.

---

### 3. **Exemple de Génération et Validation des JWT**

#### Génération :

Créez un service pour générer les tokens.

```csharp
public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"])),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

#### Middleware de Validation :

Configurez le middleware JWT.

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
        };
    });
```

---

### 4. **Gérer et Sécuriser les Refresh Tokens**

Les refresh tokens doivent être gérés avec soin pour éviter leur compromission.

#### Génération :

Utilisez un générateur cryptographiquement sûr.

```csharp
public string GenerateRefreshToken()
{
    var randomNumber = new byte[32];
    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}
```

#### Stockage :

- Enregistrez les refresh tokens dans une base de données sécurisée.
- Assurez-vous qu’ils sont liés à un utilisateur et qu’ils expirent après une période définie.
- Exemple de modèle :

```csharp
public class RefreshToken
{
    public int Id { get; set; }
    public string Token { get; set; }
    public string UserId { get; set; }
    public DateTime Expires { get; set; }
    public bool IsRevoked { get; set; }
}
```

---

### 5. **Configurer une Rotation des Refresh Tokens**

Pour limiter l’impact des tokens volés :

- Invalidez le refresh token utilisé et générez-en un nouveau.
- Stockez le nouveau token et marquez l’ancien comme révoqué.

#### Exemple d’Endpoint pour la Rotation :

```csharp
[HttpPost("refresh-token")]
public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
{
    var existingToken = await _context.RefreshTokens
        .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && !rt.IsRevoked && rt.Expires > DateTime.UtcNow);

    if (existingToken == null)
        return Unauthorized("Invalid or expired refresh token.");

    // Révoquez l'ancien token
    existingToken.IsRevoked = true;

    // Générez un nouveau token
    var newAccessToken = _tokenService.GenerateAccessToken(new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, existingToken.UserId)
    });

    var newRefreshToken = _tokenService.GenerateRefreshToken();

    var refreshTokenEntity = new RefreshToken
    {
        Token = newRefreshToken,
        UserId = existingToken.UserId,
        Expires = DateTime.UtcNow.AddDays(7),
        IsRevoked = false
    };

    _context.RefreshTokens.Add(refreshTokenEntity);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        AccessToken = newAccessToken,
        RefreshToken = newRefreshToken
    });
}
```

---

### 6. **Sécuriser les Communications**

1. **Utilisez HTTPS** : Évitez toute interception de tokens.
2. **Minimisez les Claims** : Incluez uniquement les informations nécessaires.
3. **Révoquez les Tokens Compromis** :
   - Ajoutez une option de déconnexion.
   - Supprimez les refresh tokens en cas de changement de mot de passe ou de soupçon de compromission.

---

### 7. **Configurer des Endpoints Sécurisés**

1. **/login** : Authentifie l'utilisateur et délivre les tokens.
2. **/refresh-token** : Rafraîchit les tokens.
3. **/logout** : Révoque tous les refresh tokens associés.

---

### 8. **Surveiller et Logger les Activités**

- Loggez les utilisations des tokens, les échecs de validation et les anomalies.
- Implémentez un mécanisme d’alerte pour les tentatives de rafraîchissement excessives.

---

### 9. **Résumé des Meilleures Pratiques**

1. **JWT pour les Access Tokens** avec une signature sécurisée.
2. **Refresh Tokens** stockés côté serveur, avec gestion des expirations et révocations.
3. **Rotation des Refresh Tokens** pour prévenir les abus.
4. **Sécurisation avec HTTPS** et middleware de validation robuste.
5. **Endpoints sécurisés** et surveillance active.

---

En suivant ce guide, vous assurez une gestion sécurisée et efficace des tokens tout en respectant les principes d’un MVP. Vous pouvez progressivement ajouter des fonctionnalités avancées, telles que la journalisation centralisée ou une gestion fine des autorisations.
