-- Création de la table 'users' pour stocker les informations supplémentaires des utilisateurs
-- Cette table est liée à l'authentification Supabase (auth.users)
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  plan text DEFAULT 'Free' NOT NULL, -- 'Free', 'Pro', 'Team'
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
-- Activation de Row Level Security (RLS) pour la table 'users'
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Politique pour permettre aux utilisateurs authentifiés de voir leur propre profil
CREATE POLICY "Users can view their own profile." ON public.users
  FOR SELECT USING (auth.uid() = id);
-- Politique pour permettre aux utilisateurs authentifiés de créer leur propre profil
CREATE POLICY "Users can create their own profile." ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile." ON public.users
  FOR UPDATE USING (auth.uid() = id);
-- Création de la table 'videos' pour stocker les métadonnées des vidéos générées
CREATE TYPE public.video_status AS ENUM ('processing', 'ready', 'failed');
CREATE TABLE public.videos (
  id text PRIMARY KEY, -- videoId généré par l'application
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status public.video_status DEFAULT 'processing' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  -- Ajoutez d'autres champs si vous souhaitez stocker plus de détails sur la vidéo
  -- par exemple, 'title' text, 'config_json' jsonb, 'scenes_json' jsonb
  title text,
  config_json jsonb,
  scenes_json jsonb
);
-- Activation de Row Level Security (RLS) pour la table 'videos'
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
-- Politique pour permettre aux utilisateurs authentifiés de voir leurs propres vidéos
CREATE POLICY "Users can view their own videos." ON public.videos
  FOR SELECT USING (auth.uid() = user_id);
-- Politique pour permettre aux utilisateurs authentifiés de créer leurs propres vidéos
CREATE POLICY "Users can create their own videos." ON public.videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour le statut de leurs propres vidéos
CREATE POLICY "Users can update their own videos." ON public.videos
  FOR UPDATE USING (auth.uid() = user_id);
-- Politique pour permettre aux utilisateurs authentifiés de supprimer leurs propres vidéos
CREATE POLICY "Users can delete their own videos." ON public.videos
  FOR DELETE USING (auth.uid() = user_id);
-- Création d'un index pour accélérer les recherches par user_id
CREATE INDEX idx_videos_user_id ON public.videos (user_id);
-- Fonction pour créer un profil utilisateur après l'inscription
-- Ceci est un trigger qui s'exécute après l'insertion dans auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Création du trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();