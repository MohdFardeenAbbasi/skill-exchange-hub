import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Coins, Clock, User } from 'lucide-react';
import { VIDEO_CATEGORIES, VideoCategory } from '@/lib/videoCategories';
import { VideoPlayer } from './VideoPlayer';

interface VideoCardProps {
  id: string;
  title: string;
  description?: string | null;
  category: VideoCategory;
  filePath: string;
  createdAt: string;
  totalPointsEarned: number;
  uploaderName?: string | null;
  uploaderId: string;
  currentUserId?: string;
  userPoints?: number;
  onPointsTransferred?: () => void;
}

export function VideoCard({
  id,
  title,
  description,
  category,
  filePath,
  createdAt,
  totalPointsEarned,
  uploaderName,
  uploaderId,
  currentUserId,
  userPoints = 0,
  onPointsTransferred,
}: VideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  
  const categoryInfo = VIDEO_CATEGORIES.find(c => c.value === category) || VIDEO_CATEGORIES[8];
  const isOwnVideo = currentUserId === uploaderId;
  const canWatch = isOwnVideo || userPoints >= 10;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div 
          className="relative aspect-video bg-muted cursor-pointer"
          onClick={() => canWatch && setShowPlayer(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
          </div>
          <Badge className="absolute top-2 left-2" variant="secondary">
            {categoryInfo.icon} {categoryInfo.label}
          </Badge>
          {!isOwnVideo && (
            <Badge className="absolute top-2 right-2 bg-primary/90" variant="default">
              <Coins className="w-3 h-3 mr-1" />
              10 pts
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {uploaderName || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-primary">
            <Coins className="w-4 h-4" />
            <span>{totalPointsEarned} earned</span>
          </div>
          <Button 
            size="sm" 
            variant={canWatch ? "hero" : "secondary"}
            onClick={() => canWatch && setShowPlayer(true)}
            disabled={!canWatch}
          >
            {isOwnVideo ? 'Watch' : canWatch ? 'Watch (10 pts)' : 'Need points'}
          </Button>
        </CardFooter>
      </Card>

      {showPlayer && (
        <VideoPlayer
          videoId={id}
          title={title}
          filePath={filePath}
          uploaderId={uploaderId}
          currentUserId={currentUserId}
          onClose={() => setShowPlayer(false)}
          onPointsTransferred={onPointsTransferred}
        />
      )}
    </>
  );
}
