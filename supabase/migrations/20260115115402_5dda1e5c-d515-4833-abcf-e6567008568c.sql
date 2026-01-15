-- Create enum for video categories
CREATE TYPE public.video_category AS ENUM (
  'education',
  'entertainment',
  'sports',
  'technology',
  'music',
  'gaming',
  'lifestyle',
  'news',
  'other'
);

-- Add category column to videos table
ALTER TABLE public.videos 
ADD COLUMN category public.video_category NOT NULL DEFAULT 'other';

-- Add total_points_earned to videos
ALTER TABLE public.videos 
ADD COLUMN total_points_earned integer NOT NULL DEFAULT 0;

-- Create video_watches table to track watches and prevent duplicate point deductions
CREATE TABLE public.video_watches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  watcher_user_id uuid NOT NULL,
  points_transferred integer NOT NULL,
  watched_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on video_watches
ALTER TABLE public.video_watches ENABLE ROW LEVEL SECURITY;

-- Users can view their own watch history
CREATE POLICY "Users can view their own watch history"
ON public.video_watches
FOR SELECT
USING (auth.uid() = watcher_user_id);

-- Users can insert their own watch records
CREATE POLICY "Users can insert their own watch records"
ON public.video_watches
FOR INSERT
WITH CHECK (auth.uid() = watcher_user_id);

-- Create index for efficient lookups
CREATE INDEX idx_video_watches_video_id ON public.video_watches(video_id);
CREATE INDEX idx_video_watches_watcher_user_id ON public.video_watches(watcher_user_id);
CREATE INDEX idx_video_watches_watched_at ON public.video_watches(watched_at);
CREATE INDEX idx_videos_category ON public.videos(category);

-- Function to transfer points when watching a video (atomic transaction)
CREATE OR REPLACE FUNCTION public.watch_video_and_transfer_points(
  p_video_id uuid,
  p_watcher_user_id uuid,
  p_points_to_transfer integer DEFAULT 10
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_video_owner_id uuid;
  v_watcher_balance integer;
  v_last_watch timestamp with time zone;
  v_cooldown_minutes integer := 30; -- 30 minute cooldown between watches
BEGIN
  -- Get video owner
  SELECT user_id INTO v_video_owner_id
  FROM public.videos
  WHERE id = p_video_id;

  IF v_video_owner_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Video not found');
  END IF;

  -- Prevent watching own video
  IF v_video_owner_id = p_watcher_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot earn points from your own video');
  END IF;

  -- Check last watch time for cooldown
  SELECT MAX(watched_at) INTO v_last_watch
  FROM public.video_watches
  WHERE video_id = p_video_id 
    AND watcher_user_id = p_watcher_user_id;

  IF v_last_watch IS NOT NULL AND v_last_watch > (now() - (v_cooldown_minutes || ' minutes')::interval) THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Please wait before watching this video again',
      'cooldown_remaining_minutes', EXTRACT(EPOCH FROM (v_last_watch + (v_cooldown_minutes || ' minutes')::interval - now())) / 60
    );
  END IF;

  -- Check watcher's balance
  SELECT points_balance INTO v_watcher_balance
  FROM public.profiles
  WHERE user_id = p_watcher_user_id;

  IF v_watcher_balance IS NULL OR v_watcher_balance < p_points_to_transfer THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient points', 'current_balance', COALESCE(v_watcher_balance, 0));
  END IF;

  -- Deduct points from watcher
  UPDATE public.profiles
  SET points_balance = points_balance - p_points_to_transfer,
      updated_at = now()
  WHERE user_id = p_watcher_user_id;

  -- Add points to video owner
  UPDATE public.profiles
  SET points_balance = points_balance + p_points_to_transfer,
      updated_at = now()
  WHERE user_id = v_video_owner_id;

  -- Update total points earned on video
  UPDATE public.videos
  SET total_points_earned = total_points_earned + p_points_to_transfer,
      updated_at = now()
  WHERE id = p_video_id;

  -- Record the watch
  INSERT INTO public.video_watches (video_id, watcher_user_id, points_transferred)
  VALUES (p_video_id, p_watcher_user_id, p_points_to_transfer);

  RETURN json_build_object(
    'success', true, 
    'points_transferred', p_points_to_transfer,
    'new_balance', v_watcher_balance - p_points_to_transfer
  );
END;
$$;

-- Give new users some starting points (update the handle_new_user function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, points_balance)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 100);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;