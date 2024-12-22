---
category: Web > Html/CSS/JS
title: OAuth Google
date: 2024-12-05
author: Romagny13
---

# Guide de Connexion via Google en HTML/JS pur

Ce guide explique comment configurer l'authentification Google OAuth 2.0 et implémenter une connexion avec une popup ou une redirection en utilisant uniquement HTML et JavaScript.

---

## Étapes de configuration dans Google Cloud Console

1. **Accéder à la console Google Cloud**
   Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/).

2. **Créer un projet**

   - Créez un nouveau projet et sélectionnez-le.

3. **Activer l'API Google+ API**

   - Allez dans la section **API et services**.
   - Cliquez sur **Activer les API et services**.
   - Recherchez et activez **Google+ API**.

4. **Configurer l'écran de consentement**

   - Remplissez les informations requises pour l'écran de consentement.

5. **Créer des identifiants OAuth 2.0**

   - Allez dans **Identifiants** > **Créer des identifiants** > **ID client OAuth**.
   - Choisissez **Application Web**.
   - Ajoutez des **URI de redirection autorisés**, par exemple (pour Live Server):
     - `http://127.0.0.1:5500/popup.html`
     - Ou `http://127.0.0.1:5500/callback.html`
   - Cliquez sur **Créer**.

6. **Copier le client ID**
   - Récupérez le Client ID généré.

---

## Code HTML/JS : Connexion avec une popup

### Page principale : `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Auth - Popup</title>
  </head>
  <body>
    <h1>Connexion Google (Popup)</h1>
    <button id="loginBtn">Se connecter avec Google</button>
    <div id="userInfo" style="display: none">
      <p>Connecté en tant que : <span id="userName"></span></p>
      <button onclick="logout()">Déconnexion</button>
    </div>

    <script>
      const CLIENT_ID = "VOTRE_CLIENT_ID"; // Remplacez par votre Client ID
      const REDIRECT_URI = "http://127.0.0.1:5500/popup.html"; // URI de redirection
      const SCOPE = "email profile";

      document.getElementById("loginBtn").addEventListener("click", () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&scope=${SCOPE}`;
        const popup = window.open(
          authUrl,
          "GoogleLogin",
          "width=600,height=600"
        );

        window.addEventListener("message", (event) => {
          if (event.origin !== window.location.origin) {
            console.error("Origine non autorisée :", event.origin);
            return;
          }

          const params = new URLSearchParams(event.data);
          const accessToken = params.get("access_token");

          if (accessToken) {
            fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
              .then((resp) => resp.json())
              .then((user) => {
                document.getElementById("userName").textContent = user.name;
                document.getElementById("loginBtn").style.display = "none";
                document.getElementById("userInfo").style.display = "block";
              })
              .catch((error) =>
                console.error(
                  "Erreur lors de la récupération des infos utilisateur :",
                  error
                )
              );
          }
        });
      });

      function logout() {
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("userInfo").style.display = "none";
      }
    </script>
  </body>
</html>
```

### Page popup : `popup.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Google Auth Popup Redirect</title>
    <script>
      window.onload = function () {
        const hash = window.location.hash.substring(1);
        window.opener.postMessage(hash, window.location.origin);
        window.close();
      };
    </script>
  </head>
  <body>
    <p>Connexion en cours...</p>
  </body>
</html>
```

---

## Code HTML/JS : Connexion avec redirection

### Page principale : `redirect.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Connexion Google - Redirection</title>
  </head>
  <body>
    <h1>Connexion Google (Redirection)</h1>
    <button id="loginBtn">Se connecter avec Google</button>

    <script>
      const CLIENT_ID = "VOTRE_CLIENT_ID"; // Remplacez par votre Client ID
      const REDIRECT_URI = "http://127.0.0.1:5500/callback.html"; // URI de redirection
      const SCOPE = "email profile";

      document.getElementById("loginBtn").addEventListener("click", () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&scope=${SCOPE}`;
        window.location.href = authUrl; // Redirige l'utilisateur vers Google
      });
    </script>
  </body>
</html>
```

### Page callback : `callback.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Callback - Google Auth</title>
  </head>
  <body>
    <h1>Traitement de la connexion...</h1>
    <p id="status">Connexion en cours...</p>

    <script>
      const hash = window.location.hash.substring(1); // Extrait tout après le '#'
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");

      if (accessToken) {
        fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((response) => response.json())
          .then((user) => {
            document.body.innerHTML = `
            <h1>Connecté en tant que : ${user.name}</h1>
            <p>Email : ${user.email}</p>
            <img src="${user.picture}" alt="Photo de profil" style="border-radius: 50%; width: 100px; height: 100px;" />
            <button onclick="logout()">Déconnexion</button>
          `;
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la récupération des informations utilisateur :",
              error
            );
            document.getElementById("status").textContent =
              "Erreur lors de la connexion.";
          });
      } else {
        document.getElementById("status").textContent = "Aucun token trouvé.";
      }

      function logout() {
        window.location.href = "redirect.html"; // Retour à la page principale
      }
    </script>
  </body>
</html>
```

## Connexion Google avec ID Token via Popup

L'ID token est un jeton JWT (JSON Web Token) utilisé dans le cadre de l'authentification OAuth 2.0 pour fournir des informations sur l'utilisateur qui s'est authentifié. Contrairement à un access token, qui est utilisé pour accéder aux ressources d'une API, un ID token contient des informations d'identité (comme le nom, l'email et l'image de profil) dans sa partie payload. Il permet de vérifier que l'utilisateur est bien celui qu'il prétend être sans avoir à effectuer des appels supplémentaires aux API externes, ce qui simplifie et sécurise le processus d'authentification.

```javascript
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Auth - Popup</title>
  </head>
  <body>
    <h1>Connexion Google (Popup)</h1>
    <button id="loginBtn">Se connecter avec Google</button>
    <div id="userInfo" style="display: none">
      <p>Connecté en tant que : <span id="userName"></span></p>
      <button onclick="logout()">Déconnexion</button>
    </div>

    <script>
      const CLIENT_ID = "VOTRE_CLIENT_ID"; // Remplacez par votre Client ID
      const REDIRECT_URI = "http://127.0.0.1:5500/popup.html";
      const SCOPE = "email profile openid"; // Ajout du scope "openid" pour obtenir un ID Token

      document.getElementById("loginBtn").addEventListener("click", () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&scope=${SCOPE}&nonce=randomNonceValue`;
        const popup = window.open(
          authUrl,
          "GoogleLogin",
          "width=600,height=600"
        );

        // Écoute les messages de la popup
        window.addEventListener("message", (event) => {
          if (event.origin !== window.location.origin) {
            console.error("Origine non autorisée :", event.origin);
            return;
          }

          // Traitement des données envoyées par la popup
          const params = new URLSearchParams(event.data);
          const idToken = params.get("id_token");

          if (idToken) {
            console.log(idToken);
            // Décodage de l'ID Token pour obtenir les informations utilisateur
            const payload = JSON.parse(atob(idToken.split(".")[1])); // Décodage de la partie payload (base64)
            document.getElementById("userName").textContent = payload.name;
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("userInfo").style.display = "block";
          }
        });
      });

      function logout() {
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("userInfo").style.display = "none";
      }
    </script>
  </body>
</html>
```
Exemple de décodage de l'Id token

```js
// Fonction pour décoder un JWT (séparer la partie payload et la décoder)
function decodeJWT(token) {
  const base64Url = token.split('.')[1];  // Partie payload du JWT
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Correction des caractères
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// ID Token (exemple, remplacez-le par le vôtre)
const idToken = "VOTRE_ID_TOKEN"; 

// Décoder l'ID token pour obtenir les informations
const decoded = decodeJWT(idToken);

// L'identifiant utilisateur se trouve dans le champ 'sub'
console.log("Identifiant utilisateur : ", decoded.sub);  // 'sub' contient l'ID unique de l'utilisateur
```


