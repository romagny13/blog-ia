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
- **`<chemin_vers_application_ou_fichier>`** : Obligatoire. Le chemin complet vers l'application ou le fichier que vous souhaitez ouvrir. Si le chemin contient des espaces, placez-le entre guillemets. Il est aussi possible de spécifier simplement le nom de l'application si elle est dans le `PATH` du système (par exemple, `"chrome.exe"` ou `"notepad.exe"`), dans ce cas Windows cherchera l'exécutable dans les répertoires définis.
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
- Si vous ne spécifiez pas de chemin complet et que l'application est dans le `PATH`, vous pouvez simplement indiquer son nom. Par exemple, pour ouvrir Chrome, vous pouvez écrire `start "" "chrome.exe"` au lieu du chemin complet `"C:\Program Files\Google\Chrome\Application\chrome.exe"`. Windows recherchera alors `chrome.exe` dans les répertoires du `PATH`.
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

### Comment exécuter un script PowerShell facilement en double-cliquant

Il est possible de lancer un script PowerShell `.ps1` en double-cliquant soit sur le script lui-même, soit sur un raccourci qui exécuterait ce script. Voici deux solutions pour cela :

#### 1. **Double-cliquer sur le script `.ps1` directement**

Sous certaines configurations, il est possible de lancer directement un script `.ps1` en double-cliquant, mais cela dépend des paramètres de votre système et de la politique d'exécution des scripts PowerShell.

##### Étapes à suivre :

1. **Configurer la politique d'exécution des scripts** : Par défaut, Windows empêche l'exécution de scripts PowerShell pour des raisons de sécurité. Vous devez modifier la politique d'exécution pour permettre l'exécution des scripts locaux signés ou non signés.

   Ouvrez PowerShell en mode administrateur et exécutez la commande suivante pour autoriser l'exécution des scripts locaux :

   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

   Cette commande permet d'exécuter des scripts non signés tant qu'ils viennent de votre ordinateur.

2. **Associer le fichier `.ps1` à PowerShell** :
   Si le script ne se lance pas automatiquement en double-cliquant, vous devrez peut-être associer les fichiers `.ps1` à PowerShell. Voici comment faire :

   - Ouvrez l'Explorateur de fichiers et faites un clic droit sur le fichier `.ps1`.
   - Choisissez **Ouvrir avec** puis **Choisir une autre application**.
   - Sélectionnez **PowerShell** et cochez **Toujours utiliser cette application pour ouvrir les fichiers .ps1**.

   Cela permet à PowerShell d'être automatiquement utilisé pour ouvrir les fichiers `.ps1`.

#### 2. **Créer un raccourci pour exécuter le script `.ps1`**

Si vous souhaitez avoir plus de contrôle, vous pouvez créer un raccourci qui exécute le script `.ps1` via PowerShell.

##### Étapes pour créer un raccourci :

1. **Créer un raccourci** :

   - Faites un clic droit sur le bureau ou dans un dossier et choisissez **Nouveau** > **Raccourci**.
   - Dans la boîte de dialogue "Emplacement de l'élément", entrez la commande suivante :
     ```plaintext
     powershell.exe -ExecutionPolicy Bypass -File "C:\chemin\vers\ton\script.ps1"
     ```
     Remplacez `C:\chemin\vers\ton\script.ps1` par le chemin complet vers votre fichier `.ps1`.

2. **Nommer le raccourci** : Donnez un nom à votre raccourci, puis cliquez sur **Terminer**.

##### Explication des options :

- `-ExecutionPolicy Bypass` : Permet d'exécuter le script même si la politique d'exécution est restrictive (vous pouvez remplacer par `RemoteSigned` si nécessaire).
- `-File` : Spécifie le chemin du fichier `.ps1` à exécuter.

#### 3. **Option supplémentaire : Créer un fichier `.bat` pour lancer le script**

Si vous préférez utiliser un fichier `.bat` pour exécuter le script PowerShell, vous pouvez créer un fichier batch qui lance votre script PowerShell.

##### Exemple de fichier `.bat` :

Créez un fichier `.bat` avec le contenu suivant :

```batch
@echo off
powershell.exe -ExecutionPolicy Bypass -File "C:\chemin\vers\ton\script.ps1"
```

Cela permet d'exécuter le script PowerShell avec un double-clic sur le fichier `.bat`.

#### Résumé des solutions :

- **Double-cliquer directement sur le `.ps1`** (après avoir modifié la politique d'exécution et configuré l'association de fichiers).
- **Créer un raccourci** vers `powershell.exe` avec les arguments nécessaires pour exécuter le script.
- **Utiliser un fichier `.bat`** qui exécute le script PowerShell.

Vous pouvez maintenant utiliser ces deux méthodes (batch et PowerShell) pour automatiser vos tâches et gagner en efficacité !

## Script Powershell vs Fichier Batch

### **Avantages de PowerShell :**

1. **Puissance et flexibilité** : Langage de script complet, gestion des objets et interaction avec .NET.
2. **Compatibilité multiplateforme** : Fonctionne sur Windows, macOS et Linux avec PowerShell Core.
3. **Automatisation avancée** : Permet d’écrire des scripts complexes avec boucles, conditions, et gestion des erreurs.
4. **Sécurité renforcée** : Politique d'exécution des scripts et possibilité de signer les scripts.
5. **Extensibilité** : Modules et intégration avec des services externes (Azure, AWS, etc.).

### **Inconvénients de PowerShell :**

1. **Complexité** : Plus difficile à apprendre et à utiliser pour les débutants.
2. **Exécution plus lente** : Peut être moins performant pour des tâches simples.
3. **Problèmes de compatibilité** : Certaines fonctions ne sont disponibles que sous Windows ou dans des versions spécifiques.
4. **Politique d'exécution** : Nécessite des configurations supplémentaires pour exécuter des scripts.

### **Avantages d’un fichier batch :**

1. **Simplicité** : Facile à créer et à utiliser pour des tâches simples.
2. **Rapidité** : Moins lourd pour des tâches de base.

### **Inconvénients d’un fichier batch :**

1. **Limitations** : Moins flexible et puissant pour des automatisations complexes.
2. **Moins sécurisé** : Pas de gestion des objets ou des scripts signés.

**Résumé** : PowerShell est préférable pour des tâches complexes et avancées, tandis que le fichier batch est plus adapté aux actions simples et rapides.
