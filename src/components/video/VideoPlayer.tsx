import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useVideoPoints } from '@/hooks/useVideoPoints';
import { X, Coins, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  filePath: string;
  uploaderId: string;
  currentUserId?: string;
  onClose: () => void;
  onPointsTransferred?: () => void;
}

export function VideoPlayer({
  videoId,
  title,
  filePath,
  uploaderId,
  currentUserId,
  onClose,
  onPointsTransferred,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pointsDeducted, setPointsDeducted] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const { transferPointsForWatch, processing } = useVideoPoints();
  
  const isOwnVideo = currentUserId === uploaderId;
  const MIN_WATCH_DURATION = 5; // 5 seconds minimum watch time

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
        setVideoUrl(data.publicUrl);
      } catch (error) {
        console.error('Error loading video:', error);
        toast.error('Failed to load video');
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [filePath]);

  const handlePlay = () => {
    if (!watchStartTime) {
      setWatchStartTime(Date.now());
    }
  };

  const handleTimeUpdate = async () => {
    if (pointsDeducted || isOwnVideo || !currentUserId || !watchStartTime) return;
    
    const watchDuration = (Date.now() - watchStartTime) / 1000;
    
    // Only transfer points after minimum watch duration
    if (watchDuration >= MIN_WATCH_DURATION) {
      setPointsDeducted(true);
      const result = await transferPointsForWatch(videoId, currentUserId);
      if (result.success) {
        onPointsTransferred?.();
      }
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="relative bg-black">
          {loading ? (
            <div className="aspect-video flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full aspect-video"
              onPlay={handlePlay}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-muted-foreground">
              <AlertCircle className="w-8 h-8 mr-2" />
              Failed to load video
            </div>
          )}
        </div>
        
        {!isOwnVideo && (
          <div className="p-4 bg-muted/50 flex items-center gap-2 text-sm">
            <Coins className="w-4 h-4 text-primary" />
            {pointsDeducted ? (
              <span className="text-green-600">10 points transferred to creator!</span>
            ) : (
              <span className="text-muted-foreground">
                10 points will be transferred after {MIN_WATCH_DURATION} seconds of watching
              </span>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
