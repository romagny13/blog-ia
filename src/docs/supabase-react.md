---
category: Web
title: Supabase avec React
date: 2024-11-21
author: Romagny13
---

# Guide Complet de Supabase avec React

## 1. Configuration Initiale

### Installation des Dépendances

```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-react
```

### Configuration du Client Supabase

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 2. Opérations CRUD avec Fetch

### Récupération de Données (Read)

```javascript
const fetchData = async () => {
  const response = await fetch(`${supabaseUrl}/rest/v1/votre_table`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  });
  const data = await response.json();
  return data;
};
```

### Insertion de Données (Create)

```javascript
const insertData = async (newItem) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/votre_table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify(newItem)
  });
  return response.json();
};
```

### Mise à Jour de Données (Update)

```javascript
const updateData = async (id, updatedItem) => {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/votre_table?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(updatedItem)
    }
  );
  return response.json();
};
```

### Suppression de Données (Delete)

```javascript
const deleteData = async (id) => {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/votre_table?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    }
  );
  return response.status === 204;
};
```

## 3. Opérations CRUD avec @supabase/supabase-js

### Récupération de Données (Read)

```javascript
const fetchData = async () => {
  const { data, error } = await supabase.from("votre_table").select("*");

  if (error) console.error("Erreur:", error);
  return data;
};
```

### Insertion de Données (Create)

```javascript
const insertData = async (newItem) => {
  const { data, error } = await supabase
    .from("votre_table")
    .insert(newItem)
    .select();

  if (error) console.error("Erreur:", error);
  return data;
};
```

### Mise à Jour de Données (Update)

```javascript
const updateData = async (id, updatedItem) => {
  const { data, error } = await supabase
    .from("votre_table")
    .update(updatedItem)
    .eq("id", id)
    .select();

  if (error) console.error("Erreur:", error);
  return data;
};
```

### Suppression de Données (Delete)

```javascript
const deleteData = async (id) => {
  const { error } = await supabase.from("votre_table").delete().eq("id", id);

  if (error) console.error("Erreur:", error);
  return !error;
};
```

## 4. Sécurité RLS (Row Level Security)

### Exemple de Politique RLS

```sql
-- Autoriser les utilisateurs à lire uniquement leurs propres enregistrements
CREATE POLICY "Users can read own records"
ON votre_table FOR SELECT
USING (auth.uid() = user_id);

-- Autoriser les utilisateurs à insérer des enregistrements
CREATE POLICY "Users can insert own records"
ON votre_table FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 5. Handlers API avec Supabase Edge Functions

### Exemple de Handler

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { method } = req;

  switch (method) {
    case "GET":
      // Logique de récupération
      break;
    case "POST":
      // Logique d'insertion
      break;
    case "PUT":
      // Logique de mise à jour
      break;
    case "DELETE":
      // Logique de suppression
      break;
    default:
      return new Response("Méthode non autorisée", { status: 405 });
  }
});
```

## Conseils de Sécurité

1. Toujours utiliser des variables d'environnement
2. Implémenter des politiques RLS strictes
3. Valider et assainir les entrées utilisateur
4. Utiliser l'authentification pour protéger vos routes
5. Limiter les permissions au strict nécessaire

## Bonnes Pratiques

- Utilisez toujours la bibliothèque `@supabase/supabase-js` de préférence à fetch
- Activez RLS sur toutes vos tables
- Gérez les erreurs de manière explicite
- Utilisez des types TypeScript pour plus de sécurité

## 6. Authentification Complète avec Supabase Auth (v2+)

### Configuration Initiale

```typescript
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-helpers-react";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);
```

### Inscription Utilisateur

```typescript
const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Données supplémentaires du profil
        data: {
          first_name: "John",
          last_name: "Doe",
          role: "user"
        }
      }
    });

    if (error) throw error;

    // Vérification par email envoyée
    console.log("Inscription réussie, vérifiez votre email");
    return data;
  } catch (error) {
    console.error("Erreur lors de l'inscription", error);
  }
};
```

### Connexion Utilisateur

```typescript
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    console.log("Connexion réussie", data.user);
    return data;
  } catch (error) {
    console.error("Erreur de connexion", error);
  }
};
```

### Connexion avec Providers Sociaux

```typescript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Options supplémentaires
      redirectTo: "http://localhost:3000/dashboard"
    }
  });

  if (error) console.error("Erreur de connexion Google", error);
};
```

### Gestion des Sessions

```typescript
// Composant de gestion de session
const SessionManager = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Écoute les changements de session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Nettoyage de l'abonnement
    return () => subscription.unsubscribe();
  }, []);

  // Déconnexion
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Erreur de déconnexion", error);
  };

  return (
    <div>
      {session ? (
        <>
          <p>Connecté en tant que: {session.user.email}</p>
          <button onClick={handleSignOut}>Déconnexion</button>
        </>
      ) : (
        <p>Non connecté</p>
      )}
    </div>
  );
};
```

## 7. Utilisation de l'Authentification avec RLS

### Exemple de Table Utilisateur

```sql
-- Création de la table des profils
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Politiques RLS pour la table profiles
CREATE POLICY "Utilisateurs peuvent modifier leur profil"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Utilisateurs peuvent voir leur profil"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

### Hook Personnalisé de Gestion de Profil

```typescript
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur de récupération du profil", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
};
```

### Middleware de Protection de Route

```typescript
const ProtectedRoute = ({ children }) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) return null;

  return children;
};

// Utilisation
function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

## 8. Gestion des Roles Avancée

### Vérification de Rôle

```typescript
const checkUserRole = async (requiredRole: string) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  return data?.role === requiredRole;
};
```

## Bonnes Pratiques d'Authentification

1. **Sécurité**

   - Toujours utiliser HTTPS
   - Implementer la double authentification
   - Limiter les tentatives de connexion

2. **Gestion des Sessions**

   - Définir des durées de session appropriées
   - Implémenter une déconnexion automatique
   - Gérer les tokens de renouvellement

3. **Protection des Données**

   - Ne jamais stocker de mots de passe en clair
   - Utiliser RLS pour protéger les données
   - Valider et assainir les entrées utilisateur

4. **Expérience Utilisateur**
   - Fournir des messages d'erreur clairs
   - Gérer les états de chargement
   - Proposer plusieurs méthodes de connexion
