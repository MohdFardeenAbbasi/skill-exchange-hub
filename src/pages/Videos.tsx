import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoCard } from "@/components/video/VideoCard";
import { CategoryFilter } from "@/components/video/CategoryFilter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { VideoCategory } from "@/lib/videoCategories";
import { Video, Coins, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoWithUploader {
  id: string;
  title: string;
  description: string | null;
  category: VideoCategory;
  file_path: string;
  created_at: string;
  total_points_earned: number;
  user_id: string;
  uploader: {
    full_name: string | null;
  } | null;
}

interface CategoryStats {
  category: VideoCategory;
  count: number;
}

const Videos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoWithUploader[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch videos
      let query = supabase
        .from("videos")
        .select(`
          id,
          title,
          description,
          category,
          file_path,
          created_at,
          total_points_earned,
          user_id
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data: videosData, error: videosError } = await query;

      if (videosError) {
        console.error("Error fetching videos:", videosError);
      } else if (videosData) {
        // Fetch profiles for uploaders
        const userIds = [...new Set(videosData.map(v => v.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);
        
        const videosWithUploaders = videosData.map(v => ({
          ...v,
          uploader: { full_name: profileMap.get(v.user_id) || null }
        }));
        
        setVideos(videosWithUploaders as VideoWithUploader[]);
      }

      // Fetch user points if logged in
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("points_balance")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileData) {
          setUserPoints(profileData.points_balance);
        }
      }

      // Fetch category stats
      const { data: allVideos } = await supabase
        .from("videos")
        .select("category");

      if (allVideos) {
        const stats = allVideos.reduce((acc: Record<string, number>, v) => {
          acc[v.category] = (acc[v.category] || 0) + 1;
          return acc;
        }, {});
        
        setCategoryStats(
          Object.entries(stats).map(([category, count]) => ({
            category: category as VideoCategory,
            count,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalVideos = categoryStats.reduce((sum, s) => sum + s.count, 0);
  const topCategory = categoryStats.sort((a, b) => b.count - a.count)[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Video className="w-5 h-5" />
              <span>Video Library</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Browse <span className="gradient-text">Videos</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Watch videos and support creators with points
                </p>
              </div>
              
              {user && (
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg py-2 px-4">
                    <Coins className="w-5 h-5 mr-2 text-primary" />
                    {userPoints} points
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3">
                <Video className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalVideos}</p>
                  <p className="text-sm text-muted-foreground">Total Videos</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{categoryStats.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground capitalize">
                    {topCategory?.category || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Most Popular</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Filter by Category</h2>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : videos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  category={video.category}
                  filePath={video.file_path}
                  createdAt={video.created_at}
                  totalPointsEarned={video.total_points_earned}
                  uploaderName={video.uploader?.full_name}
                  uploaderId={video.user_id}
                  currentUserId={user?.id}
                  userPoints={userPoints}
                  onPointsTransferred={fetchData}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground">
                {selectedCategory !== 'all' 
                  ? `No videos in the ${selectedCategory} category yet.`
                  : "Be the first to upload a video!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Videos;
