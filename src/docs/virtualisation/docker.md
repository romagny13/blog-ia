---
category: Virtualisation
title: Docker
date: 2024-11-26
author: Romagny13
---

# **Guide d'installation et utilisation de Docker sur Windows**

## **Pré-requis**

Avant de commencer à utiliser Docker sur Windows, assurez-vous de vérifier et activer certaines options nécessaires.

### **1. Vérification de la virtualisation sur Windows**

La virtualisation doit être activée dans le BIOS/UEFI de votre machine. Docker utilise des fonctionnalités de virtualisation pour exécuter des containers. Pour vérifier si la virtualisation est activée, procédez comme suit :

- **Via le gestionnaire des tâches :**
  1. Ouvrez le gestionnaire des tâches (Ctrl + Shift + Esc).
  2. Allez dans l'onglet **Performance**.
  3. Sous **Processeur**, vérifiez si **Virtualisation** est activée.

Si la virtualisation n'est pas activée, vous devrez redémarrer votre ordinateur et entrer dans le BIOS/UEFI. Cherchez une option liée à la virtualisation (par exemple, Intel VT-x ou AMD-V) et assurez-vous qu'elle est activée.

### **2. Installation de Docker Desktop**

1. Téléchargez Docker Desktop depuis le site officiel de Docker : [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
2. Exécutez l'installateur et suivez les étapes d'installation.
3. Une fois l'installation terminée, Docker Desktop se lancera automatiquement. Il peut vous demander de redémarrer votre machine pour finaliser l'installation.

### **3. Vérification de l'installation**

Une fois Docker installé, ouvrez une fenêtre de terminal (PowerShell ou terminal intégré dans Visual Studio Code) et tapez la commande suivante pour vérifier que Docker fonctionne correctement :

```bash
docker --version
```

Vous devriez voir la version de Docker installée.

## **Comprendre Docker : Conteneur et Image**

### **Qu'est-ce qu'un container Docker ?**

Un **container Docker** est une unité légère et autonome qui exécute une application. Un container inclut tout le nécessaire pour exécuter une application : le code, les bibliothèques système, les configurations, etc. Il fonctionne de manière isolée, ce qui signifie que plusieurs containers peuvent être exécutés sur le même système sans interférer les uns avec les autres.

### **Qu'est-ce qu'une image Docker ?**

Une **image Docker** est un fichier en lecture seule qui contient toutes les informations nécessaires pour créer un container. Elle comprend le système d'exploitation de base, les applications installées, ainsi que les fichiers nécessaires à l'exécution d'une application.

---

## **Les Commandes Docker**

Voici une présentation des commandes Docker essentielles, accompagnées de leurs descriptions et exemples d’utilisation.

| **Commande**                 | **Description**                                                                                                                                                          | **Exemple**                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **`docker pull`**            | Télécharge une image depuis un registre Docker, comme Docker Hub. Si l'image n'est pas présente localement, Docker la télécharge automatiquement.                        | `docker pull mcr.microsoft.com/dotnet/aspnet:7.0`                                                                  |
| **`docker build`**           | Crée une image Docker à partir d'un Dockerfile. Si des images de base sont manquantes, elles seront automatiquement téléchargées.                                        | `docker build .`<br> `docker build -t monimage:1.0 .`<br> `docker build -t registry.example.com/monimage:latest .` |
| **`docker run`**             | Crée et démarre un container basé sur une image Docker. Vous pouvez configurer des options telles que le mappage de ports, des volumes ou des variables d'environnement. | `docker run -p 3000:3000 monimage`<br> `docker run -d -p 8080:80 --name moncontainer monimage`                     |
| **`docker stop`**            | Arrête un container en cours d'exécution. Vous pouvez utiliser l'ID ou le nom du container.                                                                              | `docker stop moncontainer`<br> `docker stop id_ou_nom`                                                             |
| **`docker start`**           | Démarre un container qui a été arrêté mais qui reste présent sur votre système.                                                                                          | `docker start moncontainer`<br> `docker start id_ou_nom`                                                           |
| **`docker restart`**         | Redémarre un container, en l'arrêtant puis en le relançant.                                                                                                              | `docker restart moncontainer`                                                                                      |
| **`docker rm`**              | Supprime un container arrêté.                                                                                                                                            | `docker rm moncontainer`<br> `docker rm id_ou_nom`                                                                 |
| **`docker rmi`**             | Supprime une image Docker. Assurez-vous que l'image n'est pas utilisée par un container en cours d'exécution avant de la supprimer.                                      | `docker rmi monimage`<br> `docker rmi id_ou_nom_image`                                                             |
| **`docker ps`**              | Affiche les containers en cours d'exécution.                                                                                                                             | `docker ps`                                                                                                        |
| **`docker ps -a`**           | Affiche tous les containers, qu'ils soient en cours d'exécution ou arrêtés.                                                                                              | `docker ps -a`                                                                                                     |
| **`docker images`**          | Liste toutes les images Docker présentes sur votre machine.                                                                                                              | `docker images`                                                                                                    |
| **`docker exec`**            | Exécute une commande dans un container en cours d'exécution.                                                                                                             | `docker exec -it moncontainer bash`<br> `docker exec moncontainer ls /app`                                         |
| **`docker logs`**            | Affiche les logs d'un container.                                                                                                                                         | `docker logs moncontainer`<br> `docker logs -f moncontainer` (suivre les logs en temps réel)                       |
| **`docker volume ls`**       | Liste les volumes Docker existants.                                                                                                                                      | `docker volume ls`                                                                                                 |
| **`docker volume prune`**    | Supprime tous les volumes inutilisés.                                                                                                                                    | `docker volume prune`                                                                                              |
| **`docker network ls`**      | Liste les réseaux Docker existants.                                                                                                                                      | `docker network ls`                                                                                                |
| **`docker network inspect`** | Affiche les détails d'un réseau Docker, y compris les containers qui y sont connectés.                                                                                   | `docker network inspect monréseau`                                                                                 |

---

### **Explication détaillée des commandes**

#### **1. `docker pull`**

Télécharge une image Docker depuis un registre comme Docker Hub. Si l'image n'est pas présente localement, Docker la téléchargera automatiquement avant de pouvoir l'utiliser.

**Exemple :**

```bash
docker pull mcr.microsoft.com/dotnet/aspnet:7.0
```

Cela téléchargera l'image `aspnet` version 7.0 depuis le registre de Microsoft.

#### **2. `docker build`**

La commande `docker build` permet de créer une image Docker à partir d'un `Dockerfile`. Un point (`.`) à la fin indique que Docker doit utiliser le répertoire actuel comme contexte de construction.

**Exemple :**

```bash
docker build .
```

**Exemple avec tag :**

```bash
docker build -t monimage:1.0 .
```

**Exemple pour un registre privé :**

```bash
docker build -t registry.example.com/monimage:latest .
```

#### **3. `docker run`**

La commande `docker run` crée et lance un container basé sur une image Docker. Vous pouvez spécifier des options comme les ports à exposer (`-p`), l'exécution en arrière-plan (`-d`), ou l'assignation d'un nom à votre container.

**Exemple :**

```bash
docker run -p 3000:3000 monimage
```

Cela mappe le port 3000 du container au port 3000 de votre machine locale.

#### **4. `docker stop` et `docker start`**

- **`docker stop`** : Arrête un container en cours d'exécution.
- **`docker start`** : Démarre un container arrêté.

**Exemples :**

```bash
docker stop moncontainer
docker start moncontainer
```

#### **5. `docker rm`**

La commande `docker rm` permet de supprimer un container arrêté. Vous ne pouvez pas supprimer un container qui est en cours d'exécution.

**Exemple :**

```bash
docker rm moncontainer
```

#### **6. `docker rmi`**

La commande `docker rmi` supprime une image Docker. Assurez-vous que l'image n'est pas utilisée par un container en cours d'exécution.

**Exemple :**

```bash
docker rmi monimage
```

#### **7. `docker exec`**

La commande `docker exec` permet d'exécuter une commande dans un container en cours d'exécution. Par exemple, pour ouvrir une session shell dans un container.

**Exemple :**

```bash
docker exec -it moncontainer bash
```

---

## **Exemple d'application ASP.NET Core + SQL Server avec HTTPS**

Voici un exemple de `Dockerfile` pour une application ASP.NET Core avec SQL Server :

```dockerfile
# Étape 1 : Construire l'application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet build --configuration Release --output /app/out

# Étape 2 : Créer l'image d'exécution
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "VotreApi.dll"]
```

Le

fichier `docker-compose.yml` pour gérer cette application avec SQL Server pourrait ressembler à ceci :

```yaml
version: "3.4"

services:
  api:
    build: .
    ports:
      - "5000:80"
      - "5001:443"
  db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - SA_PASSWORD=Your_password123
      - ACCEPT_EULA=Y
    ports:
      - "1433:1433"
```

---

## **Conclusion**

Docker simplifie la gestion des environnements de développement et de production en vous permettant d'exécuter des applications dans des containers isolés. Grâce à la configuration adéquate des commandes Docker et du fichier `docker-compose.yml`, vous pouvez déployer vos applications rapidement et efficacement sur diverses plateformes.

### Guide détaillé sur Docker, son installation et utilisation avec un exemple de projet ASP.NET Core API + SQL Server

Docker est une technologie de conteneurisation qui permet de créer, déployer et exécuter des applications dans des environnements isolés appelés _containers_. Ce guide complet vous aidera à installer Docker sur Windows, à comprendre les concepts de base, à utiliser les commandes Docker essentielles et à déployer une API ASP.NET Core avec une base de données SQL Server, le tout avec une configuration HTTPS.

## 5. **Visual Studio et Docker**

### a. **Création d'un Dockerfile dans Visual Studio**

Visual Studio facilite la création et l'intégration de Docker dans les projets .NET. Pour un projet ASP.NET Core, suivez ces étapes :

1. **Créer un projet ASP.NET Core** dans Visual Studio.
2. Clic droit sur le projet > **Ajouter** > **Support Docker**.
3. Visual Studio génère automatiquement un `Dockerfile` et ajoute des configurations pour Docker et Docker Compose.

### b. **Configuration HTTPS avec Visual Studio**

Pour activer HTTPS dans Visual Studio avec Docker :

1. Dans le `Dockerfile`, assurez-vous que le certificat SSL est inclus :

   ```dockerfile
   ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/certificate.pfx
   ENV ASPNETCORE_Kestrel__Certificates__Default__Password=your_password
   ```

2. Visual Studio va gérer les certificats pour vous en local. Vous pouvez configurer un certificat auto-signé via le terminal avec :
   ```bash
   dotnet dev-certs https --trust
   ```

---

## 6. **Exemple de projet : ASP.NET Core API + SQL Server avec HTTPS**

Voici un exemple complet d'un projet ASP.NET Core API avec Docker, SQL Server, et HTTPS :

1. **Créez un projet API ASP.NET Core** dans Visual Studio.
2. **Ajoutez Docker à votre projet** via l'option d'Visual Studio.
3. **Créez un `Dockerfile` et `docker-compose.yml`** comme mentionné précédemment.
4. **Démarrez l'application**

Voici un guide détaillé sur l'utilisation des **volumes** et des **réseaux Docker**, ainsi que sur la gestion des images et des registries Docker.

---

## **Volumes Docker**

Les volumes sont utilisés pour conserver des données en dehors des containers. Cela permet de ne pas perdre des données lorsque vous supprimez un container, car un container est temporaire par nature et peut être supprimé. Un volume est indépendant du cycle de vie du container, ce qui permet une gestion durable des données.

### **Types de volumes**

1. **Volumes mappés :** Vous pouvez lier un répertoire de votre machine locale à un répertoire dans un container. Ce mappage fait en sorte que les données du répertoire local "prennent le dessus" sur celles du container.

#### Exemple de volume mappé

Imaginons que vous souhaitez mapper un dossier local (`/test`) avec un dossier dans le container (`/test-container`).

- Créez un dossier local :

```bash
cd ~
mkdir test
```

- Lancez un container Ubuntu et mappez le dossier local avec le container :

```bash
docker run -it --rm -v /test:/test-container ubuntu:18.04
```

Dans ce cas, `/test` est le dossier local, et `/test-container` est celui dans le container. Tout fichier ajouté dans `/test` sera visible dans `/test-container` du container.

2. **Volumes managés :** Ces volumes sont gérés par Docker. Vous créez un volume et Docker l'associe à un répertoire dans le container.

#### Exemple de volume managé

- Créez un volume managé :

```bash
docker volume create mon_volume
```

- Montez ce volume dans un container (ici avec Ubuntu) :

```bash
docker run --rm -it -v mon_volume:/bin ubuntu:18.04
```

Lorsque vous créez un volume managé, si le volume est vide, le dossier dans le container (`/bin` dans cet exemple) sera utilisé. Si des fichiers sont présents dans `/bin` du container, ils seront copiés dans le volume.

#### Gestion des volumes

- Lister tous les volumes managés :

```bash
docker volume ls
```

- Obtenez des informations sur un volume spécifique :

```bash
docker volume inspect mon_volume
```

- Supprimer un volume managé :

```bash
docker volume rm mon_volume
```

---

## **Réseaux Docker**

Les réseaux Docker permettent de connecter plusieurs containers entre eux et de les faire communiquer. Par défaut, Docker crée un réseau de type `bridge`, mais vous pouvez créer des réseaux personnalisés pour gérer la communication entre vos containers.

### **Exemples d'utilisation des réseaux**

#### 1. **Lier un container à un port local**

Utilisez l'option `-p` pour mapper les ports de votre machine locale à ceux du container. Cela vous permet d'interagir avec le container via un port local.

```bash
docker run --rm -p 9000:80 nginx
```

Dans cet exemple, le container exécutant Nginx expose le port 80, qui est mappé au port 9000 de votre machine locale. Vous pouvez alors accéder à Nginx via `localhost:9000`.

#### 2. **Connecter plusieurs containers via un réseau Docker**

Créer un réseau personnalisé et connecter des containers à ce réseau peut être très utile pour des applications distribuées.

- Créer un réseau Docker de type `bridge` :

```bash
docker network create --driver=bridge mon_reseau
```

- Lancer un container en le connectant directement au réseau :

```bash
docker run -it --rm --network=mon_reseau --name=container1 nginx
```

- Ajouter un container à un réseau après qu'il ait été lancé :

```bash
docker network connect mon_reseau container2
```

- Déconnecter un container d'un réseau :

```bash
docker network disconnect mon_reseau container2
```

- Supprimer un réseau Docker :

```bash
docker network rm mon_reseau
```

#### Lister les réseaux existants

```bash
docker network ls
```

#### Inspecter un réseau

```bash
docker network inspect bridge
```

---

## **Registry Providers Docker**

Les images Docker sont stockées sur des **registries**. Le Docker Hub est le plus populaire, mais il existe plusieurs autres options, y compris des solutions cloud privées.

### **Quelques fournisseurs de registres populaires :**

- [Docker Hub](https://hub.docker.com/)
- [Quay.io](https://quay.io/)
- [Google Cloud Container Registry](https://cloud.google.com/container-registry/)
- [AWS Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/)
- [Images Microsoft sur Docker Hub](https://hub.docker.com/u/microsoft/)

### **Gestion des images Docker avec Docker Hub**

#### Ajouter une image à Docker Hub

Avant de pouvoir pousser une image vers Docker Hub, vous devez la taguer correctement. Voici comment procéder :

1. **Taguer l'image :**

```bash
docker tag monimage moncompte/monimage:latest
```

2. **Pousser l'image vers Docker Hub :**

```bash
docker push moncompte/monimage:latest
```

Assurez-vous que vous êtes connecté à Docker Hub avant de pousser l'image :

```bash
docker login
```

---

## **Résumé des commandes Docker**

| **Commande**                    | **Description**                                    |
| ------------------------------- | -------------------------------------------------- |
| **`docker volume create`**      | Crée un volume Docker managé.                      |
| **`docker volume ls`**          | Liste tous les volumes Docker.                     |
| **`docker volume inspect`**     | Affiche les détails d'un volume spécifique.        |
| **`docker volume rm`**          | Supprime un volume Docker managé.                  |
| **`docker network create`**     | Crée un réseau Docker personnalisé.                |
| **`docker network ls`**         | Liste les réseaux Docker disponibles.              |
| **`docker network connect`**    | Connecte un container à un réseau Docker.          |
| **`docker network disconnect`** | Déconnecte un container d'un réseau Docker.        |
| **`docker network rm`**         | Supprime un réseau Docker.                         |
| **`docker run -p`**             | Mappe un port local vers un port du container.     |
| **`docker run -v`**             | Mappe un volume local ou managé dans un container. |

---

## **Conclusion**

Les **volumes** et **réseaux Docker** sont des outils puissants pour gérer l'état persistant des données et permettre la communication entre plusieurs containers. Les volumes garantissent que vos données sont conservées même si un container est supprimé, et les réseaux permettent de connecter vos containers de manière flexible. Vous pouvez également facilement gérer et stocker vos images Docker sur des registres comme Docker Hub ou des solutions cloud.
