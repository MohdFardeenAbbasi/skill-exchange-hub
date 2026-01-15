import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WatchResult {
  success: boolean;
  error?: string;
  points_transferred?: number;
  new_balance?: number;
  current_balance?: number;
  cooldown_remaining_minutes?: number;
}

export function useVideoPoints() {
  const [processing, setProcessing] = useState(false);

  const transferPointsForWatch = async (
    videoId: string,
    watcherUserId: string,
    pointsToTransfer: number = 10
  ): Promise<WatchResult> => {
    setProcessing(true);
    
    try {
      const { data, error } = await supabase.rpc('watch_video_and_transfer_points', {
        p_video_id: videoId,
        p_watcher_user_id: watcherUserId,
        p_points_to_transfer: pointsToTransfer,
      });

      if (error) throw error;

      const result = data as unknown as WatchResult;
      
      if (result.success) {
        toast.success(`${result.points_transferred} points transferred to video creator!`);
      } else if (result.error) {
        if (result.error.includes('Insufficient points')) {
          toast.error(`Insufficient points. You have ${result.current_balance || 0} points.`);
        } else if (result.error.includes('wait')) {
          const mins = Math.ceil(result.cooldown_remaining_minutes || 0);
          toast.info(`Please wait ${mins} minutes before re-watching this video.`);
        } else if (result.error.includes('own video')) {
          // Don't show error for own videos - just let them watch
        } else {
          toast.error(result.error);
        }
      }

      return result;
    } catch (error: any) {
      console.error('Error transferring points:', error);
      toast.error('Failed to process video watch');
      return { success: false, error: error.message };
    } finally {
      setProcessing(false);
    }
  };

  return { transferPointsForWatch, processing };
}
