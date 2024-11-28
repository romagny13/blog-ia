---
category: Virtualisation
title: Kubernetes
date: 2024-11-26
author: Romagny13
---

# Guide Kubernetes Complet pour Débutants

Kubernetes (**K8s**) est une plateforme open-source puissante pour gérer et orchestrer des applications conteneurisées. Ce guide vous aidera à comprendre les bases et à commencer à utiliser Kubernetes efficacement.

---

## **1. Qu'est-ce que Kubernetes ?**

Kubernetes permet de gérer des applications conteneurisées, qu'elles soient déployées sur des machines locales ou dans des environnements cloud.

### **Avantages :**

- **Déploiement rapide** : Automatisation des tâches comme la mise à jour des applications.
- **Évolutivité** : Ajout ou suppression automatique de ressources en fonction de la demande.
- **Résilience** : Relance automatique des conteneurs défaillants.
- **Portabilité** : Fonctionne sur les machines locales, clouds publics, ou privés.

---

## **2. Concepts Fondamentaux**

### **Pods**

- L'unité de base de Kubernetes.
- Contient un ou plusieurs conteneurs qui partagent le même réseau et stockage.

### **Nœuds (Nodes)**

- Machines physiques ou virtuelles où les Pods s'exécutent.
- Types de nœuds :
  - **Maître (Control Plane)** : Gère l’état du cluster.
  - **Esclave (Worker Nodes)** : Héberge les Pods.

### **Cluster**

- Un ensemble de nœuds qui collaborent pour exécuter les applications conteneurisées.

### **Services**

- Expose un Pod ou un groupe de Pods via une adresse IP stable ou un nom DNS.

### **Déploiement (Deployment)**

- Définit l'état souhaité des Pods (nombre de réplicas, mise à jour progressive, etc.).

---

## **3. Architecture de Kubernetes**

### **Composants du Plan de Contrôle (Control Plane)** :

- **kube-apiserver** : Point d'entrée pour gérer le cluster.
- **etcd** : Stockage distribué pour l’état du cluster.
- **kube-scheduler** : Planifie l'exécution des Pods sur les nœuds.
- **kube-controller-manager** : S'assure que l’état souhaité est respecté.

### **Composants des Nœuds** :

- **kubelet** : S'assure que les conteneurs sont en cours d'exécution.
- **kube-proxy** : Gère les communications réseau entre Pods et Services.

---

## **4. Installation de Kubernetes**

### **Installation sur Windows**

1. **Prérequis :**

   - Installer Docker Desktop pour Windows et activer le backend WSL2.
   - Installer [kubectl](https://kubernetes.io/docs/tasks/tools/).

2. **Utiliser Minikube pour un cluster local** :

   - Télécharger et installer Minikube :
     ```powershell
     choco install minikube
     ```
   - Démarrer Minikube :
     ```powershell
     minikube start
     ```
   - Vérifier l’état :
     ```powershell
     kubectl get nodes
     ```

3. **Kind (Kubernetes in Docker)** :
   - Installer Kind via Chocolatey :
     ```powershell
     choco install kind
     ```
   - Créer un cluster Kubernetes local :
     ```powershell
     kind create cluster
     ```

---

## **5. Commandes Essentielles de `kubectl`**

| **Commande**                     | **Description**                          |
| -------------------------------- | ---------------------------------------- |
| `kubectl get nodes`              | Liste les nœuds dans le cluster.         |
| `kubectl get pods`               | Liste les Pods en cours d'exécution.     |
| `kubectl create deployment`      | Crée un déploiement.                     |
| `kubectl expose deployment`      | Expose un déploiement comme un Service.  |
| `kubectl delete pod <nom-pod>`   | Supprime un Pod.                         |
| `kubectl apply -f fichier.yaml`  | Applique une configuration YAML.         |
| `kubectl describe pod <nom-pod>` | Donne des détails sur un Pod spécifique. |

---

## **6. Exemple Pratique : Déploiement Simple**

### **Créer un Déploiement :**

1. Créez un fichier `deployment.yaml` :

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: nginx-deployment
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: nginx
     template:
       metadata:
         labels:
           app: nginx
       spec:
         containers:
           - name: nginx
             image: nginx:latest
             ports:
               - containerPort: 80
   ```

2. Appliquez le fichier YAML :

   ```bash
   kubectl apply -f deployment.yaml
   ```

3. Exposez le service :

   ```bash
   kubectl expose deployment nginx-deployment --type=NodePort --port=80
   ```

4. Obtenez l’URL du service (avec Minikube) :
   ```bash
   minikube service nginx-deployment
   ```

---

## **7. Bonnes Pratiques Kubernetes**

1. **Utilisez des labels** : Simplifiez la gestion des Pods en ajoutant des labels descriptifs.
2. **Configurez des sondes** :
   - **Sonde de vivacité** : Vérifie si un Pod est actif.
   - **Sonde de préparation** : Vérifie si un Pod est prêt à recevoir du trafic.
3. **Limitez les ressources** :
   - Définissez les limites CPU et mémoire pour chaque Pod.
4. **Stockage persistant** :
   - Utilisez des **Persistent Volumes** pour gérer les données persistantes.
5. **Automatisez les tâches** :
   - Mettez en place un pipeline CI/CD pour vos déploiements.

---

## **8. Ressources pour Apprendre Kubernetes**

- **Documentation officielle** : [kubernetes.io](https://kubernetes.io/)
- **Cours en ligne** : Plateformes comme Udemy, Coursera, ou Pluralsight.
- **Playgrounds** :
  - [Katacoda](https://katacoda.com/)
  - [Play with Kubernetes](https://labs.play-with-k8s.com/)
- **Livres** :
  - _Kubernetes Up and Running_ (O'Reilly)
  - _The Kubernetes Book_.

---

## **9. Résolution des Défis Courants**

| **Problème**                      | **Solution**                                                      |
| --------------------------------- | ----------------------------------------------------------------- |
| Les Pods ne démarrent pas         | Utilisez `kubectl describe pod` pour identifier les erreurs.      |
| Problèmes de mise en réseau       | Vérifiez les règles de pare-feu et les configurations du Service. |
| Cluster non disponible            | Redémarrez le cluster avec Minikube ou Kind.                      |
| Persistance des données manquante | Configurez des Persistent Volumes pour les Pods.                  |

---

## **10. Conclusion**

Kubernetes peut sembler complexe au début, mais ses concepts fondamentaux et son architecture flexible permettent de gérer des applications de manière efficace et évolutive. Commencez avec un environnement local comme Minikube ou Kind, expérimentez, et explorez les nombreux outils disponibles pour simplifier votre apprentissage.

Bonne exploration de Kubernetes ! 🚀
