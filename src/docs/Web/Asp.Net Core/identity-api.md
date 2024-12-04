---
category: Web > Asp.Net Core
title: Identity
date: 2024-11-27
author: Romagny13
---

# Guide Complet pour l'Authentification dans une API ASP.NET Core avec les Meilleures Pratiques

Ce guide vous accompagne pas à pas pour implémenter une authentification sécurisée dans une API ASP.NET Core en utilisant les meilleures pratiques. Vous apprendrez à gérer l'enregistrement par email/mot de passe ou via Google, la confirmation d'email, la connexion avec génération de JWT et refresh tokens, la gestion des erreurs et verrouillages de compte, la fonctionnalité "Forgot Password", la réinitialisation de mot de passe, et l'authentification à deux facteurs (2FA). Nous utiliserons EF Core avec `IdentityContext`, des DTOs avec AutoMapper, et configurerons le tout pour .NET 6+.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Structure du Projet](#structure-du-projet)
3. [Installation des Packages NuGet](#installation-des-packages-nuget)
4. [Configuration des Entités](#configuration-des-entités)
5. [Configuration du DbContext](#configuration-du-dbcontext)
6. [Création des DTOs](#création-des-dtos)
7. [Configuration d'AutoMapper](#configuration-dautmapper)
8. [Implémentation des Services](#implémentation-des-services)
    - [Service d'Authentification (AuthService)](#service-dauthentification-authservice)
    - [Service de Gestion des Tokens (TokenService)](#service-de-gestion-des-tokens-tokenservice)
    - [Service d'Email (EmailService)](#service-demail-emailservice)
9. [Configuration de l'Authentification et de l'Autorisation](#configuration-de-lauthentification-et-de-lauthorisation)
10. [Implémentation du Contrôleur d'Authentification](#implémentation-du-contrôleur-dauthentification)
11. [Gestion des Erreurs et Verrouillage de Compte](#gestion-des-erreurs-et-verrouillage-de-compte)
12. [Fonctionnalité Forgot Password et Reset Password](#fonctionnalit%C3%A9-forgot-password-et-reset-password)
13. [Authentification via Google](#authentification-via-google)
14. [Authentification à Deux Facteurs (2FA)](#authentification-%C3%A0-deux-facteurs-2fa)
15. [Sécurité et Meilleures Pratiques](#s%C3%A9curit%C3%A9-et-meilleures-pratiques)
16. [Conclusion](#conclusion)

---

## Prérequis

- **.NET 6 SDK** installé sur votre machine.
- **Visual Studio 2022** ou un éditeur de code similaire.
- **SQL Server** ou une instance de base de données compatible avec EF Core.
- **Compte SendGrid** pour l'envoi d'emails.
- **Compte Google Developer** pour la configuration de l'authentification via Google.

## Structure du Projet

Organisons notre projet de la manière suivante pour maintenir une architecture claire et scalable:

```
MyApi
├── Controllers
│   └── AuthController.cs
├── Data
│   └── ApplicationDbContext.cs
├── DTOs
│   ├── AuthResponseDto.cs
│   ├── ForgotPasswordDto.cs
│   ├── LoginDto.cs
│   ├── RegisterDto.cs
│   └── ResetPasswordDto.cs
├── Entities
│   ├── ApplicationUser.cs
│   └── RefreshToken.cs
├── Helpers
│   ├── AppSettings.cs
│   └── AutoMapperProfile.cs
├── Services
│   ├── AuthService.cs
│   ├── EmailService.cs
│   └── TokenService.cs
├── appsettings.json
└── Program.cs
```

---

## Installation des Packages NuGet

Installez les packages suivants nécessaires à l'authentification et aux fonctionnalités associées:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package Microsoft.AspNetCore.Authentication.Google
dotnet add package SendGrid
```

---

## Configuration des Entités

### ApplicationUser.cs

```csharp
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace MyApi.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<RefreshToken> RefreshTokens { get; set; }
        public bool IsTwoFactorEnabled { get; set; }
        public string TwoFactorSecret { get; set; }
    }
}
```

### RefreshToken.cs

```csharp
using System;

namespace MyApi.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
```

---

## Configuration du DbContext

### ApplicationDbContext.cs

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyApi.Entities;

namespace MyApi.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            builder.Entity<RefreshToken>()
                .HasOne(rt => rt.ApplicationUser)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.ApplicationUserId);
        }
    }
}
```

---

## Création des DTOs

### RegisterDto.cs

```csharp
namespace MyApi.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
```

### LoginDto.cs

```csharp
namespace MyApi.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string TwoFactorCode { get; set; }
    }
}
```

### AuthResponseDto.cs

```csharp
namespace MyApi.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public string Email { get; set; }
        public bool RequiresTwoFactor { get; set; }
    }
}
```

### ForgotPasswordDto.cs

```csharp
namespace MyApi.DTOs
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }
}
```

### ResetPasswordDto.cs

```csharp
namespace MyApi.DTOs
{
    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
```

---

## Configuration d'AutoMapper

### AutoMapperProfile.cs

```csharp
using AutoMapper;
using MyApi.DTOs;
using MyApi.Entities;

namespace MyApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        }
    }
}
```

---

## Implémentation des Services

### IAuthService.cs

```csharp
using System.Threading.Tasks;
using MyApi.DTOs;

namespace MyApi.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto, string origin);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto, string ipAddress);
        Task<AuthResponseDto> RefreshTokenAsync(string token, string ipAddress);
        Task<bool> RevokeTokenAsync(string token, string ipAddress);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto, string origin);
        Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        Task<bool> EnableTwoFactorAsync(string userId);
        Task<bool> DisableTwoFactorAsync(string userId);
    }
}
```

### AuthService.cs

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyApi.DTOs;
using MyApi.Entities;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MyApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService, IEmailService emailService, IConfiguration configuration)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto, string origin)
        {
            var user = new ApplicationUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                // Gérer les erreurs
                throw new Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
            }

            // Générer le token de confirmation d'email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = $"{origin}/confirm-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";

            // Envoyer l'email de confirmation
            await _emailService.SendEmailAsync(user.Email, "Confirmez votre email", $"<p>Merci de confirmer votre email en cliquant sur ce lien : <a href='{confirmationLink}'>Confirmer Email</a></p>", true);

            return new AuthResponseDto { Email = user.Email };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, string ipAddress)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                // Gérer les erreurs de connexion
                throw new Exception("Email ou mot de passe invalide.");
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                throw new Exception("L'email n'est pas confirmé.");
            }

            if (await _userManager.GetTwoFactorEnabledAsync(user))
            {
                // Nécessite 2FA
                return new AuthResponseDto { RequiresTwoFactor = true, Email = user.Email };
            }

            var jwtToken = _tokenService.GenerateJwtToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string token, string ipAddress)
        {
            var user = await _userManager.Users.Include(u => u.RefreshTokens).SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

            if (user == null)
                throw new Exception("Token de rafraîchissement invalide.");

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new Exception("Token de rafraîchissement expiré ou révoqué.");

            // Générer un nouveau refresh token
            var newRefreshToken = _tokenService.GenerateRefreshToken(ipAddress);
            user.RefreshTokens.Add(newRefreshToken);

            // Révoquer l'ancien refresh token
            refreshToken.Revoked = DateTime.UtcNow;

            await _userManager.UpdateAsync(user);

            var jwtToken = _tokenService.GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = jwtToken,
                RefreshToken = newRefreshToken.Token,
                Email = user.Email
            };
        }

        public async Task<bool> RevokeTokenAsync(string token, string ipAddress)
        {
            var user = await _userManager.Users.Include(u => u.RefreshTokens).SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

            if (user == null)
                return false;

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                return false;

            // Révoquer le token
            refreshToken.Revoked = DateTime.UtcNow;

            await _userManager.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return false;

            var result = await _userManager.ConfirmEmailAsync(user, token);

            return result.Succeeded;
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto, string origin)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);

            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"{origin}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

            await _emailService.SendEmailAsync(user.Email, "Réinitialisez votre mot de passe", $"<p>Réinitialisez votre mot de passe en cliquant sur ce lien : <a href='{resetLink}'>Réinitialiser le mot de passe</a></p>", true);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);

            if (user == null)
                return false;

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);

            return result.Succeeded;
        }

        public async Task<bool> EnableTwoFactorAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return false;

            user.IsTwoFactorEnabled = true;
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded;
        }

        public async Task<bool> DisableTwoFactorAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return false;

            user.IsTwoFactorEnabled = false;
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded;
        }
    }
}
```

### ITokenService.cs

```csharp
namespace MyApi.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(ApplicationUser user);
        RefreshToken GenerateRefreshToken(string ipAddress);
    }
}
```

### TokenService.cs

```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyApi.Entities;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MyApi.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly double _jwtExpiryMinutes;
        private readonly double _refreshTokenExpiryDays;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
            _jwtExpiryMinutes = double.Parse(_configuration["Jwt:ExpiryMinutes"]);
            _refreshTokenExpiryDays = double.Parse(_configuration["Jwt:RefreshTokenExpiryDays"]);
        }

        public string GenerateJwtToken(ApplicationUser user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtExpiryMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken(string ipAddress)
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            var token = Convert.ToBase64String(randomBytes);

            return new RefreshToken
            {
                Token = token,
                Expires = DateTime.UtcNow.AddDays(_refreshTokenExpiryDays),
                Created = DateTime.UtcNow,
                ApplicationUserId = null // Assign the user ID when adding to user
            };
        }
    }
}
```

### IEmailService.cs

```csharp
using System.Threading.Tasks;

namespace MyApi.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
    }
}
```

### EmailService.cs

```csharp
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace MyApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            var apiKey = _configuration["SendGrid:ApiKey"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(_configuration["SendGrid:FromEmail"], _configuration["SendGrid:FromName"]);
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, isHtml ? null : body, isHtml ? body : null);
            await client.SendEmailAsync(msg);
        }
    }
}
```

---

## Configuration de l'Authentification et de l'Autorisation

### appsettings.json

Assurez-vous de configurer les paramètres nécessaires dans votre fichier `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=YourDatabase;Trusted_Connection=True;"
  },
  "Jwt": {
    "Secret": "YOUR_SECRET_KEY_HERE",
    "ExpiryMinutes": "60",
    "RefreshTokenExpiryDays": "7",
    "Issuer": "YourApp",
    "Audience": "YourApp"
  },
  "SendGrid": {
    "ApiKey": "YOUR_SENDGRID_API_KEY",
    "FromEmail": "no-reply@yourapp.com",
    "FromName": "Your App"
  },
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    }
  },
  "AllowedHosts": "*"
}
```

### Program.cs

Configurez les services dans `Program.cs`:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyApi.Data;
using MyApi.Entities;
using MyApi.Helpers;
using MyApi.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuration des services
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    options.User.RequireUniqueEmail = true;

    options.SignIn.RequireConfirmedEmail = true;

    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });

builder.Services.AddAuthorization();

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

---

## Implémentation du Contrôleur d'Authentification

### AuthController.cs

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApi.DTOs;
using MyApi.Services;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var origin = Request.Headers["origin"];
            var response = await _authService.RegisterAsync(registerDto, origin);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var response = await _authService.LoginAsync(loginDto, ipAddress);
            return Ok(response);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string token)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var response = await _authService.RefreshTokenAsync(token, ipAddress);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken([FromBody] string token)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var result = await _authService.RevokeTokenAsync(token, ipAddress);
            if (!result)
                return NotFound(new { message = "Token non trouvé." });

            return Ok(new { message = "Token révoqué." });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var result = await _authService.ConfirmEmailAsync(userId, token);
            if (!result)
                return BadRequest(new { message = "Erreur de confirmation d'email." });

            return Ok(new { message = "Email confirmé avec succès." });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var origin = Request.Headers["origin"];
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto, origin);
            return Ok(new { message = "Si l'email existe, un lien de réinitialisation a été envoyé." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var result = await _authService.ResetPasswordAsync(resetPasswordDto);
            if (!result)
                return BadRequest(new { message = "Erreur lors de la réinitialisation du mot de passe." });

            return Ok(new { message = "Mot de passe réinitialisé avec succès." });
        }
    }
}
```

---

## Gestion des Erreurs et Verrouillage de Compte

ASP.NET Core Identity gère automatiquement le verrouillage de compte après un certain nombre de tentatives de connexion infructueuses. Cela est configuré dans le `UserManager` lors de la configuration des options dans `Program.cs`:

```csharp
options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
options.Lockout.MaxFailedAccessAttempts = 5;
options.Lockout.AllowedForNewUsers = true;
```

Lorsque un utilisateur entre un mauvais mot de passe, le compteur de tentatives échouées est incrémenté. Après `MaxFailedAccessAttempts`, le compte est verrouillé pendant `DefaultLockoutTimeSpan`.

### Exemple de Gestion des Erreurs dans AuthService

Dans la méthode `LoginAsync`, vous pouvez vérifier si le compte est verrouillé:

```csharp
if (await _userManager.IsLockedOutAsync(user))
{
    throw new Exception("Le compte est verrouillé. Veuillez réessayer plus tard.");
}
```

---

## Fonctionnalité Forgot Password et Reset Password

### Forgot Password

Lorsqu'un utilisateur demande une réinitialisation de mot de passe, nous générons un token sécurisé et envoyons un lien par email.

### Reset Password

L'utilisateur utilise le lien fourni pour réinitialiser son mot de passe en fournissant le nouveau mot de passe et le token.

---

## Authentification via Google

Pour permettre aux utilisateurs de s'authentifier via Google, suivez ces étapes:

### Configuration dans Google Developer Console

1. **Créer un projet** dans la [Google Developer Console](https://console.developers.google.com/).
2. **Activer l'API Google+** (ou l'API pertinente pour l'authentification).
3. **Créer des identifiants OAuth 2.0** (Client ID et Client Secret).
4. **Configurer le consentement OAuth** avec les informations nécessaires.
5. **Ajouter les URI de redirection** nécessaires.

### Configuration dans l'Application

Les paramètres OAuth sont déjà ajoutés dans `appsettings.json` sous la section `Authentication:Google`.

### Implémentation dans AuthService

Vous devez implémenter la logique pour gérer l'authentification via Google. Cela implique de recevoir le token Google côté client, de le valider côté serveur, puis de créer ou récupérer l'utilisateur correspondant dans votre base de données.

Voici une méthode simplifiée pour gérer l'authentification via Google:

```csharp
public async Task<AuthResponseDto> LoginWithGoogleAsync(string googleToken, string ipAddress)
{
    // Valider le token Google et obtenir les informations de l'utilisateur
    var payload = await VerifyGoogleTokenAsync(googleToken);
    if (payload == null)
        throw new Exception("Token Google invalide.");

    var user = await _userManager.FindByEmailAsync(payload.Email);

    if (user == null)
    {
        user = new ApplicationUser
        {
            Email = payload.Email,
            UserName = payload.Email,
            EmailConfirmed = true
        };
        var result = await _userManager.CreateAsync(user);
        if (!result.Succeeded)
            throw new Exception("Erreur lors de la création de l'utilisateur.");
    }

    var jwtToken = _tokenService.GenerateJwtToken(user);
    var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

    user.RefreshTokens.Add(refreshToken);
    await _userManager.UpdateAsync(user);

    return new AuthResponseDto
    {
        Token = jwtToken,
        RefreshToken = refreshToken.Token,
        Email = user.Email
    };
}

private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string token)
{
    try
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new[] { _configuration["Authentication:Google:ClientId"] }
        };
        var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
        return payload;
    }
    catch
    {
        return null;
    }
}
```

**Remarque:** Vous devrez installer le package `Google.Apis.Auth` pour vérifier le token Google:

```bash
dotnet add package Google.Apis.Auth
```

### Ajout de la Méthode dans AuthController

Ajoutez une nouvelle action dans `AuthController` pour gérer le login via Google:

```csharp
[HttpPost("google-login")]
public async Task<IActionResult> GoogleLogin([FromBody] string googleToken)
{
    var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
    var response = await _authService.LoginWithGoogleAsync(googleToken, ipAddress);
    return Ok(response);
}
```

---

## Authentification à Deux Facteurs (2FA)

### Activation de 2FA

L'authentification à deux facteurs renforce la sécurité en demandant une deuxième forme d'identification. Nous allons implémenter 2FA en utilisant des applications d'authentification comme Google Authenticator.

### Configuration de 2FA dans AuthService

#### Génération du Code QR pour 2FA

Ajoutez une méthode pour générer un code QR que l'utilisateur peut scanner avec une application d'authentification:

```csharp
using QRCoder;
using System.Drawing;
using System.IO;

public string GenerateTwoFactorSetupCode(string userId)
{
    var user = _userManager.FindByIdAsync(userId).Result;
    var unformattedKey = _userManager.GetAuthenticatorKeyAsync(user).Result;

    if (string.IsNullOrEmpty(unformattedKey))
    {
        _userManager.ResetAuthenticatorKeyAsync(user).Wait();
        unformattedKey = _userManager.GetAuthenticatorKeyAsync(user).Result;
    }

    string sharedKey = FormatKey(unformattedKey);
    string authenticatorUri = GenerateQrCodeUri(user.Email, unformattedKey);

    // Génération du QR code
    using var qrGenerator = new QRCodeGenerator();
    using var qrCodeData = qrGenerator.CreateQrCode(authenticatorUri, QRCodeGenerator.ECCLevel.Q);
    using var qrCode = new QRCode(qrCodeData);
    using var qrCodeImage = qrCode.GetGraphic(20);
    
    using var ms = new MemoryStream();
    qrCodeImage.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
    var qrCodeBase64 = Convert.ToBase64String(ms.ToArray());

    return $"data:image/png;base64,{qrCodeBase64}";
}

private string FormatKey(string unformattedKey)
{
    var result = new StringBuilder();
    int currentPosition = 0;
    while (currentPosition + 4 < unformattedKey.Length)
    {
        result.Append(unformattedKey.Substring(currentPosition, 4)).Append(" ");
        currentPosition += 4;
    }
    if (currentPosition < unformattedKey.Length)
    {
        result.Append(unformattedKey.Substring(currentPosition));
    }
    return result.ToString().ToLowerInvariant();
}

private string GenerateQrCodeUri(string email, string unformattedKey)
{
    return $"otpauth://totp/MyApp:{email}?secret={unformattedKey}&issuer=MyApp&digits=6";
}
```

#### Validation du Code 2FA lors de la Connexion

Modifiez la méthode `LoginAsync` pour gérer 2FA:

```csharp
public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, string ipAddress)
{
    var user = await _userManager.FindByEmailAsync(loginDto.Email);

    if (user == null)
    {
        throw new Exception("Email ou mot de passe invalide.");
    }

    if (!await _userManager.CheckPasswordAsync(user, loginDto.Password))
    {
        await _userManager.AccessFailedAsync(user);
        if (await _userManager.IsLockedOutAsync(user))
            throw new Exception("Le compte est verrouillé. Veuillez réessayer plus tard.");
        throw new Exception("Email ou mot de passe invalide.");
    }

    if (!await _userManager.IsEmailConfirmedAsync(user))
    {
        throw new Exception("L'email n'est pas confirmé.");
    }

    if (await _userManager.GetTwoFactorEnabledAsync(user))
    {
        if (string.IsNullOrEmpty(loginDto.TwoFactorCode))
            return new AuthResponseDto { RequiresTwoFactor = true, Email = user.Email };

        var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, _userManager.Options.Tokens.AuthenticatorTokenProvider, loginDto.TwoFactorCode);
        if (!isValid)
            throw new Exception("Code 2FA invalide.");

        // Réinitialiser le compteur de verrouillage de compte en cas de succès
        await _userManager.ResetAccessFailedCountAsync(user);
    }

    var jwtToken = _tokenService.GenerateJwtToken(user);
    var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

    user.RefreshTokens.Add(refreshToken);
    await _userManager.UpdateAsync(user);

    return new AuthResponseDto
    {
        Token = jwtToken,
        RefreshToken = refreshToken.Token,
        Email = user.Email
    };
}
```

#### Activation et Désactivation de 2FA

Ajoutez des méthodes pour activer et désactiver 2FA:

```csharp
public async Task<string> EnableTwoFactorAsync(string userId)
{
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
        throw new Exception("Utilisateur non trouvé.");
    
    var qrCode = GenerateTwoFactorSetupCode(userId);
    return qrCode;
}

public async Task<bool> ConfirmTwoFactorAsync(string userId, string code)
{
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
        throw new Exception("Utilisateur non trouvé.");

    var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, _userManager.Options.Tokens.AuthenticatorTokenProvider, code);
    if (!isValid)
        return false;

    await _userManager.SetTwoFactorEnabledAsync(user, true);
    return true;
}

public async Task<bool> DisableTwoFactorAsync(string userId)
{
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
        throw new Exception("Utilisateur non trouvé.");

    await _userManager.SetTwoFactorEnabledAsync(user, false);
    return true;
}
```

### Mise à Jour du Contrôleur

Ajoutez les endpoints pour gérer 2FA dans `AuthController`:

```csharp
[Authorize]
[HttpPost("enable-2fa")]
public async Task<IActionResult> EnableTwoFactor()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var qrCode = await _authService.EnableTwoFactorAsync(userId);
    return Ok(new { qrCode });
}

[Authorize]
[HttpPost("confirm-2fa")]
public async Task<IActionResult> ConfirmTwoFactor([FromBody] string code)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var result = await _authService.ConfirmTwoFactorAsync(userId, code);
    if (!result)
        return BadRequest(new { message = "Code 2FA invalide." });
    return Ok(new { message = "2FA activé avec succès." });
}

[Authorize]
[HttpPost("disable-2fa")]
public async Task<IActionResult> DisableTwoFactor()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var result = await _authService.DisableTwoFactorAsync(userId);
    if (!result)
        return BadRequest(new { message = "Erreur lors de la désactivation de 2FA." });
    return Ok(new { message = "2FA désactivé avec succès." });
}
```

### Installation de QRCoder

Pour générer le QR code, installez le package `QRCoder`:

```bash
dotnet add package QRCoder
```

---

## Sécurité et Meilleures Pratiques

1. **Stockage Sécurisé des Secrets:** Utilisez un gestionnaire de secrets comme Azure Key Vault ou les secrets utilisateur de .NET pour stocker les clés secrètes et les tokens.
2. **Validation des Entrées:** Toujours valider et nettoyer les données d'entrée pour éviter les attaques par injection.
3. **HTTPS Obligatoire:** Assurez-vous que votre API utilise HTTPS pour sécuriser les communications.
4. **Limitation des Tentatives de Connexion:** Comme implémenté, limitez les tentatives de connexion pour prévenir les attaques par force brute.
5. **Expiration des Tokens:** Configurez des durées d'expiration appropriées pour les JWT et les refresh tokens.
6. **Rotation des Refresh Tokens:** Lorsqu'un refresh token est utilisé, générez-en un nouveau et révoquez l'ancien.
7. **Journalisation:** Implémentez la journalisation pour surveiller les activités suspectes.
8. **CORS Configuration:** Configurez correctement les politiques CORS pour restreindre l'accès aux origines de confiance.
9. **Mise à Jour Régulière:** Maintenez vos dépendances et votre framework à jour pour bénéficier des dernières corrections de sécurité.
10. **Stockage des Tokens Côté Client:** Utilisez des cookies sécurisés (HttpOnly, Secure) ou le stockage local avec précaution.

---

## Conclusion

Ce guide vous a fourni une implémentation complète de l'authentification dans une API ASP.NET Core en suivant les meilleures pratiques. Vous avez appris à gérer l'inscription et la connexion des utilisateurs via email/mot de passe ou Google, à implémenter la confirmation d'email, à sécuriser les connexions avec JWT et refresh tokens, et à renforcer la sécurité avec l'authentification à deux facteurs (2FA). Assurez-vous de continuer à suivre les bonnes pratiques de sécurité et de maintenir votre application à jour pour protéger efficacement vos utilisateurs.

Pour toute question ou assistance supplémentaire, n'hésitez pas à consulter la documentation officielle d'[ASP.NET Core Identity](https://docs.microsoft.com/fr-fr/aspnet/core/security/authentication/identity) ou à poser des questions sur les forums dédiés.

# Guide Amélioré pour la Gestion des Rôles avec Abonnement Premium via Stripe dans une API ASP.NET Core

Ce document présente une version améliorée de votre implémentation actuelle d'authentification dans une API ASP.NET Core. Il inclut la gestion des rôles, en particulier un rôle "Premium" nécessitant un abonnement via Stripe. Il prend également en compte une frontend en React avec Vite.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration des Rôles dans ASP.NET Core Identity](#configuration-des-rôles-dans-aspnet-core-identity)
3. [Mise en Œuvre de l'Autorisation Basée sur les Rôles](#mise-en-œuvre-de-la-autorisation-basée-sur-les-rôles)
4. [Intégration de Stripe pour l'Abonnement Premium](#intégration-de-stripe-pour-labonnement-premium)
5. [Gestion des Mises à Niveau/Downgrade des Rôles Utilisateur](#gestion-des-mises-à-jour-downgrade-des-rôles-utilisateur)
6. [Mise à Jour des Services, Contrôleurs et DTOs](#mise-à-jour-des-services-contrôleurs-et-dtos)
7. [Considérations pour le Frontend (React avec Vite)](#considérations-pour-le-frontend-react-avec-vite)
8. [Exemples de Code](#exemples-de-code)
9. [Conclusion](#conclusion)

## Prérequis

- API ASP.NET Core existante avec authentification utilisant EF Core, IdentityContext, DTOs, et AutoMapper.
- Environnement .NET 6+.
- Frontend en React avec Vite.
- Compte Stripe et clés API.

## Configuration des Rôles dans ASP.NET Core Identity

### 1. Définir les Rôles

Ajoutez les rôles nécessaires, notamment "User" et "Premium".

```csharp
// Data/DbInitializer.cs
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var context = new ApplicationDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roles = { "User", "Premium" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Vous pouvez ajouter des utilisateurs par défaut ici si nécessaire
    }
}
```

### 2. Appeler l'Initialiseur dans `Program.cs`

```csharp
// Program.cs
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await DbInitializer.InitializeAsync(services);
}

app.Run();
```

## Mise en Œuvre de l'Autorisation Basée sur les Rôles

### 1. Attribuer des Rôles lors de l'Inscription

Modifiez le service d'inscription pour attribuer le rôle "User" par défaut.

```csharp
// Services/AuthService.cs
public async Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto)
{
    var user = _mapper.Map<ApplicationUser>(registerDto);
    var result = await _userManager.CreateAsync(user, registerDto.Password);
    if (!result.Succeeded)
    {
        // Gérer les erreurs
    }

    await _userManager.AddToRoleAsync(user, "User");

    // Envoyer l'email de confirmation, etc.

    return _mapper.Map<RegisterResponseDto>(user);
}
```

### 2. Protéger les Endpoints avec des Policies

Utilisez l'attribut `[Authorize(Roles = "RoleName")]` sur les contrôleurs ou actions nécessitant un rôle spécifique.

```csharp
// Controllers/PremiumController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize(Roles = "Premium")]
[ApiController]
[Route("api/[controller]")]
public class PremiumController : ControllerBase
{
    [HttpGet("data")]
    public IActionResult GetPremiumData()
    {
        // Logique pour les utilisateurs Premium
        return Ok(new { data = "Données Premium" });
    }
}
```

## Intégration de Stripe pour l'Abonnement Premium

### 1. Installer le SDK Stripe

Utilisez NuGet pour installer le package Stripe.

```bash
dotnet add package Stripe.net
```

### 2. Configurer Stripe dans `appsettings.json`

```json
// appsettings.json
{
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_..."
  }
}
```

### 3. Configurer Stripe dans `Program.cs`

```csharp
// Program.cs
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
StripeConfiguration.ApiKey = builder.Configuration.GetSection("Stripe:SecretKey").Get<string>();
```

### 4. Créer un Service pour Gérer les Paiements

```csharp
// Services/PaymentService.cs
using Stripe;
using Microsoft.Extensions.Options;

public class PaymentService : IPaymentService
{
    private readonly StripeSettings _stripeSettings;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public PaymentService(IOptions<StripeSettings> stripeSettings, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _stripeSettings = stripeSettings.Value;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<Session> CreateCheckoutSession(string userId)
    {
        var domain = "https://yourdomain.com/";

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string>
            {
              "card",
            },
            LineItems = new List<SessionLineItemOptions>
            {
              new SessionLineItemOptions
              {
                Price = "price_1Hh1XYZ...", // Remplacez par votre ID de prix Stripe
                Quantity = 1,
              },
            },
            Mode = "subscription",
            SuccessUrl = domain + "success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = domain + "cancel",
            ClientReferenceId = userId,
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);
        return session;
    }

    public async Task HandleStripeWebhookAsync(HttpRequest request)
    {
        var json = await new StreamReader(request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility.ParseEvent(json);

        if (stripeEvent.Type == Events.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            var userId = session.ClientReferenceId;
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                await _userManager.AddToRoleAsync(user, "Premium");
            }
        }

        // Gérer d'autres événements si nécessaire
    }
}
```

### 5. Créer des Endpoints pour les Paiements

```csharp
// Controllers/PaymentController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var session = await _paymentService.CreateCheckoutSession(userId);
        return Ok(new { sessionId = session.Id, sessionUrl = session.Url });
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeWebhook()
    {
        await _paymentService.HandleStripeWebhookAsync(Request);
        return Ok();
    }
}
```

## Gestion des Mises à Niveau/Downgrade des Rôles Utilisateur

### 1. Créer un Endpoint pour Annuler l'Abonnement

```csharp
// Controllers/PaymentController.cs
[HttpPost("cancel-subscription")]
public async Task<IActionResult> CancelSubscription()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var user = await _userManager.FindByIdAsync(userId);
    if (user != null)
    {
        await _userManager.RemoveFromRoleAsync(user, "Premium");
        // Optionnel: Annuler l'abonnement Stripe
    }
    return Ok(new { message = "Abonnement annulé." });
}
```

### 2. Gérer les Expirations d'Abonnement

Utilisez les webhooks Stripe pour détecter les expirations ou échecs de paiement et mettre à jour les rôles en conséquence.

## Mise à Jour des Services, Contrôleurs et DTOs

### 1. Mettre à Jour les DTOs

Ajoutez des DTOs pour gérer les informations d'abonnement si nécessaire.

```csharp
// DTOs/SubscriptionDto.cs
public class SubscriptionDto
{
    public string SessionId { get; set; }
    public string CheckoutUrl { get; set; }
}
```

### 2. Mettre à Jour les Contrôleurs

Assurez-vous que les endpoints d'abonnement sont protégés et accessibles uniquement aux utilisateurs authentifiés.

### 3. Mettre à Jour les Services

Incluez la logique de gestion des rôles dans les services d'authentification et de paiement.

## Considérations pour le Frontend (React avec Vite)

### 1. Intégrer Stripe Checkout

Utilisez Stripe.js pour rediriger les utilisateurs vers la page de paiement.

```javascript
// src/services/stripeService.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...'); // Votre clé publique Stripe

export const redirectToCheckout = async () => {
  const stripe = await stripePromise;
  const response = await fetch('/api/payment/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const { sessionUrl } = await response.json();
  window.location.href = sessionUrl;
};
```

### 2. Gérer les Webhooks

Configurez un endpoint dans votre backend pour recevoir les webhooks Stripe et mettez à jour l'interface utilisateur en conséquence.

### 3. Protéger les Routes Premium

Utilisez les rôles JWT pour conditionner l'accès aux parties Premium de votre application React.

```javascript
// src/components/PremiumRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PremiumRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.roles.includes('Premium') ? children : <Navigate to="/upgrade" />;
};

export default PremiumRoute;
```

## Exemples de Code

### Exemple de `Program.cs`

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Ajouter les services nécessaires
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAutoMapper(typeof(Program));

// Configuration Stripe
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Ajouter les contrôleurs
builder.Services.AddControllers();

// Configuration des Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PremiumOnly", policy => policy.RequireRole("Premium"));
});

var app = builder.Build();

// Initialiser la base de données et les rôles
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await DbInitializer.InitializeAsync(services);
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### Exemple de `PaymentService.cs`

```csharp
// Services/PaymentService.cs
using Stripe;
using Microsoft.Extensions.Options;

public class PaymentService : IPaymentService
{
    private readonly StripeSettings _stripeSettings;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public PaymentService(IOptions<StripeSettings> stripeSettings, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _stripeSettings = stripeSettings.Value;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<Session> CreateCheckoutSession(string userId)
    {
        var domain = "https://yourdomain.com/";

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string>
            {
              "card",
            },
            LineItems = new List<SessionLineItemOptions>
            {
              new SessionLineItemOptions
              {
                Price = "price_1Hh1XYZ...", // Remplacez par votre ID de prix Stripe
                Quantity = 1,
              },
            },
            Mode = "subscription",
            SuccessUrl = domain + "success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = domain + "cancel",
            ClientReferenceId = userId,
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);
        return session;
    }

    public async Task HandleStripeWebhookAsync(HttpRequest request)
    {
        var json = await new StreamReader(request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility.ParseEvent(json);

        if (stripeEvent.Type == Events.CheckoutSessionCompleted)
        {
            var session = stripeEvent.Data.Object as Session;
            var userId = session.ClientReferenceId;
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                await _userManager.AddToRoleAsync(user, "Premium");
            }
        }

        // Gérer d'autres événements si nécessaire
    }
}
```

### Exemple de `PremiumController.cs`

```csharp
// Controllers/PremiumController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize(Roles = "Premium")]
[ApiController]
[Route("api/[controller]")]
public class PremiumController : ControllerBase
{
    [HttpGet("data")]
    public IActionResult GetPremiumData()
    {
        return Ok(new { data = "Données Premium" });
    }
}
```

## Conclusion

Cette version améliorée de votre API ASP.NET Core intègre une gestion avancée des rôles avec un rôle "Premium" nécessitant un abonnement via Stripe. En combinant les services d'authentification existants avec les capacités de Stripe, vous pouvez offrir des fonctionnalités exclusives aux utilisateurs Premium tout en maintenant une architecture sécurisée et évolutive. Assurez-vous de bien tester chaque composant et de sécuriser les communications entre le frontend React et l'API.