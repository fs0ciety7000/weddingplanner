# Notre mariage — espace de planification

Un site privé, pensé pour deux, pour organiser un mariage de bout en bout : lieux, hébergements, cérémonie, prestataires, moodboard, budget, tâches et idées.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + TypeScript
- **Supabase** (Postgres, Auth, Storage) — une base par mariage, sécurisée par Row Level Security
- **Tailwind CSS v4** + **shadcn/ui** (style `base-nova`, sur Base UI)
- **@dnd-kit** pour le kanban des prestataires
- Polices **Cormorant Garamond** (titres) et **Hanken Grotesk** (texte), palette sauge & crème

## Modules

| Module | Ce qu'il couvre |
| --- | --- |
| Tableau de bord | Compte à rebours, budget engagé, prestataires validés, tâches, déroulé du jour J, idées récentes |
| Lieux & réceptions | Fiche par domaine (capacités, tarifs, sono, traiteur, couchages) + matrice de comparaison pondérée |
| Hébergements & logistique | Couchages sur place, hôtels/gîtes à proximité, carte schématique par minutes de route, attribution des chambres |
| Cérémonie & déroulé | Chronologie des temps forts, fiche tenues/cortège/interventions/musique par moment |
| Prestataires | Kanban par statut (à contacter → validé), catégorie, devis, acompte, coup de cœur |
| Moodboard | Palette, matières, typographies, faire-part, inspirations florales, scénographie |
| Budget & échéancier | Estimé vs devis réel vs acomptes payés vs solde restant, échéancier par mois |
| Invités | Liste, RSVP, régimes, besoin d'hébergement (alimente l'attribution des chambres) |
| Tâches / Idées | Checklist partagée par thème et personne, pense-bête libre par thème |

## Mise en route

### 1. Créer le projet Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécutez dans l'ordre les fichiers de `supabase/migrations/` :
   - `0001_schema.sql` — tables
   - `0002_rls.sql` — sécurité (Row Level Security)
   - `0003_bootstrap.sql` — création automatique du propriétaire + valeurs par défaut à la création d'un mariage, bucket de stockage
   (Si vous utilisez la CLI Supabase : `supabase db push` depuis la racine du projet.)
3. Dans **Project Settings → API**, récupérez l'URL du projet et la clé `anon public`.

### 2. Configurer l'environnement

```bash
cp .env.local.example .env.local
# puis renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Lancer le site

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Créez un compte : le premier écran vous laisse créer votre mariage (nom, date, budget, ambiance). Invitez votre partenaire depuis **Réglages** — l'email invité pourra créer un compte et rejoindre le même espace.

## Notes d'architecture

- **Multi-mariage** : un compte peut appartenir à plusieurs mariages (`wedding_members`), avec un mariage "actif" mémorisé en cookie.
- **RLS** : chaque table est filtrée par appartenance à `wedding_members` — aucune donnée n'est accessible en dehors de son propre mariage.
- **Images** : les champs image (moodboard, etc.) acceptent une URL. Le bucket de stockage privé `wedding-media` est déjà configuré côté Supabase (RLS incluse) pour un futur envoi de fichiers directement depuis l'interface.
- **Design** : les tokens (couleurs, typographies, rayons) vivent dans `src/app/globals.css` ; les libellés et statuts métier dans `src/lib/status.ts`.

## Déploiement

Le plus simple est [Vercel](https://vercel.com/new) : connectez le repo, renseignez les deux variables d'environnement Supabase, déployez.
