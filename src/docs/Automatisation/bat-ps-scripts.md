---
category: Automatisation
title: Fichiers .bat & Powershell
date: 2025-01-01
author: Romagny13
---

# Guide : Utiliser un fichier .bat pour lancer des applications et des fichiers

Un fichier `.bat` (fichier batch) est un script sous Windows qui automatise des tâches en exécutant des commandes de manière séquentielle. Vous pouvez l'utiliser pour lancer plusieurs applications et fichiers d'un seul coup. Ce guide explique comment utiliser la commande `start` dans un fichier batch et comment faire de même avec PowerShell.

## Comprendre la commande `start`

La commande `start` est utilisée pour ouvrir une nouvelle fenêtre d'invite de commandes ou pour exécuter un programme, un fichier ou une URL spécifié. Sa syntaxe est :

```batch
start ["<titre>"] [<chemin_vers_application_ou_fichier>] [<paramètres>]
```

### Explication des paramètres

- **`"<titre>"`** : Optionnel. Spécifie le titre de la fenêtre de l'invite de commandes. Utilisez des guillemets vides (`""`) si aucun titre n'est nécessaire, en particulier si le chemin ou l'application contient des espaces.
- **`<chemin_vers_application_ou_fichier>`** : Obligatoire. Le chemin complet vers l'application ou le fichier que vous souhaitez ouvrir. Si le chemin contient des espaces, placez-le entre guillemets.
- **`<paramètres>`** : Optionnel. Ce sont des arguments supplémentaires passés à l'application ou au fichier à ouvrir.

## Lancer des applications et des fichiers avec un fichier `.bat`

Pour lancer des applications et des fichiers, utilisez la structure suivante dans un fichier `.bat` :

```batch
@echo off
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.google.com"
start "" "C:\Windows\System32\notepad.exe" "C:\Users\User\Documents\example.txt"
start "" "D:\MyDocuments\Videos\videoplayback.m4a"
```

### Explication des commandes

1. `start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.google.com"` : Ouvre Google Chrome et accède à Google.
2. `start "" "C:\Windows\System32\notepad.exe" "C:\Users\User\Documents\example.txt"` : Ouvre le Bloc-notes et charge un fichier texte spécifique.
3. `start "" "D:\MyDocuments\Videos\videoplayback.m4a"` : Lit un fichier audio avec le lecteur multimédia par défaut.

### Lancer Chrome avec plusieurs onglets

Pour ouvrir plusieurs onglets dans Chrome, ajoutez chaque URL comme paramètre séparé :

```batch
@echo off
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.google.com" "https://www.github.com" "https://www.stackoverflow.com"
```

#### Explication

- Chaque URL est ajoutée comme argument après le chemin de l'exécutable Chrome.
- Chrome ouvrira chaque URL dans un onglet séparé.

### Remarques importantes

- Utilisez toujours des guillemets (`""`) autour des chemins contenant des espaces.
- Si vous ne spécifiez pas de chemin d'application, Windows utilisera le programme par défaut associé au type de fichier.
- Le premier argument (`""`) est nécessaire pour éviter que le chemin soit interprété comme le titre.

## Créer et exécuter un fichier `.bat`

1. Ouvrez le Bloc-notes (ou un autre éditeur de texte).
2. Collez les commandes souhaitées dans l'éditeur.
3. Enregistrez le fichier avec l'extension `.bat`, par exemple `lancer_apps.bat`.
4. Double-cliquez sur le fichier pour l'exécuter.

## Exemple avancé

Lancer plusieurs applications avec des paramètres spécifiques :

```batch
@echo off
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://www.youtube.com" --incognito
start "" "C:\Program Files (x86)\VLC\vlc.exe" "D:\Movies\example.mp4"
start "" "notepad.exe" "C:\Users\User\Desktop\notes.txt"
```

### Explication

1. Chrome ouvre YouTube en mode navigation privée avec le paramètre `--incognito`.
2. VLC ouvre un fichier vidéo spécifique.
3. Le Bloc-notes ouvre un fichier texte.

## Résolution des problèmes

- Vérifiez que le chemin du fichier est correct et entouré de guillemets s'il contient des espaces.
- Assurez-vous que l'application ou le fichier existe à l'emplacement spécifié.
- Vérifiez si le chemin de l'application est ajouté à la variable d'environnement `PATH` du système.

---

## Faire la même chose avec PowerShell

PowerShell est un outil puissant pour automatiser les tâches sous Windows. Voici comment effectuer les mêmes actions avec PowerShell :

### Lancer des applications et des fichiers

```powershell
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "https://www.google.com"
Start-Process -FilePath "notepad.exe" -ArgumentList "C:\Users\User\Documents\example.txt"
Invoke-Item -Path "D:\MyDocuments\Videos\videoplayback.m4a"
```

### Lancer Chrome avec plusieurs onglets

Pour ouvrir plusieurs onglets dans Chrome avec PowerShell :

```powershell
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "https://www.google.com", "https://www.github.com", "https://www.stackoverflow.com"
```

#### Explication

- `-ArgumentList` accepte un tableau d'arguments, chaque URL est ajoutée comme élément du tableau.
- Chrome ouvrira chaque URL dans un onglet séparé.

### Exemple avancé

```powershell
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "https://www.youtube.com --incognito"
Start-Process -FilePath "C:\Program Files (x86)\VLC\vlc.exe" -ArgumentList "D:\Movies\example.mp4"
Start-Process -FilePath "notepad.exe" -ArgumentList "C:\Users\User\Desktop\notes.txt"
```

### Étapes pour exécuter un script PowerShell

1. Ouvrez un éditeur de texte (comme VS Code ou le Bloc-notes).
2. Collez les commandes souhaitées.
3. Enregistrez le fichier avec une extension `.ps1`, par exemple `lancer_apps.ps1`.
4. Exécutez le fichier dans PowerShell en tapant :
   ```powershell
   .\lancer_apps.ps1
   ```

**Remarque** : Vous devrez peut-être modifier la politique d'exécution avec la commande suivante :

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

Vous pouvez maintenant utiliser ces deux méthodes (batch et PowerShell) pour automatiser vos tâches et gagner en efficacité !
