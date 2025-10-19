-- Create enum for emotions
CREATE TYPE public.emotion_type AS ENUM (
  'feliz',
  'triste',
  'ansioso',
  'calmo',
  'irritado',
  'animado',
  'cansado',
  'grato'
);

-- Create enum for timeline categories
CREATE TYPE public.timeline_category AS ENUM (
  'infancia',
  'adolescencia',
  'vida_adulta',
  'relacionamentos',
  'carreira',
  'saude',
  'outros'
);

-- Create profiles table (with nickname instead of email)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  apelido TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create daily entries table
CREATE TABLE public.daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  emocao emotion_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create timeline events table
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria timeline_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for daily_entries
CREATE POLICY "Users can view their own entries"
  ON public.daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries"
  ON public.daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON public.daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON public.daily_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for timeline_events
CREATE POLICY "Users can view their own timeline events"
  ON public.timeline_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own timeline events"
  ON public.timeline_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timeline events"
  ON public.timeline_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timeline events"
  ON public.timeline_events FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();