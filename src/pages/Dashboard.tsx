import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { VideoUpload } from "@/components/VideoUpload";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { VIDEO_CATEGORIES, VideoCategory } from "@/lib/videoCategories";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, BookOpen, Award, Coins, Clock, TrendingUp, 
  Calendar, ArrowRight, Download, MessageCircle, Video, Play
} from "lucide-react";

interface Profile {
  full_name: string | null;
  points_balance: number;
  total_hours_taught: number;
  total_hours_learned: number;
}

interface UserVideo {
  id: string;
  title: string;
  created_at: string;
  file_size: number | null;
  category: VideoCategory;
  total_points_earned: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, points_balance, total_hours_taught, total_hours_learned")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user's videos
      const { data: videosData } = await supabase
        .from("videos")
        .select("id, title, created_at, file_size, category, total_points_earned")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (videosData) {
        setVideos(videosData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const stats = [
    { 
      icon: Coins, 
      label: "Points Balance", 
      value: profile?.points_balance?.toLocaleString() || "0", 
      change: "+0 this week", 
      color: "text-primary" 
    },
    { 
      icon: BookOpen, 
      label: "Skills Learned", 
      value: Math.floor(profile?.total_hours_learned || 0).toString(), 
      change: "hours total", 
      color: "text-category-code" 
    },
    { 
      icon: Award, 
      label: "Skills Taught", 
      value: Math.floor(profile?.total_hours_taught || 0).toString(), 
      change: "hours total", 
      color: "text-accent" 
    },
    { 
      icon: Video, 
      label: "Videos Uploaded", 
      value: videos.length.toString(), 
      change: "tutorials", 
      color: "text-category-music" 
    },
  ];

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Welcome back, <span className="gradient-text">{displayName}!</span>
            </h1>
            <p className="text-muted-foreground mt-2">Here's what's happening with your skills today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-primary mt-2">{stat.change}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Upload */}
            <div className="lg:col-span-2">
              <VideoUpload onUploadComplete={fetchData} />
            </div>

            {/* Your Videos */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Your Videos</h2>
                <Video className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {videos.length > 0 ? (
                  videos.map((video) => {
                    const categoryInfo = VIDEO_CATEGORIES.find(c => c.value === video.category);
                    return (
                      <div key={video.id} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors duration-300">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-foreground truncate flex-1">{video.title}</h3>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {categoryInfo?.icon} {categoryInfo?.label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(video.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-primary flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            {video.total_points_earned} earned
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No videos uploaded yet
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/videos">
                  <Play className="w-4 h-4 mr-2" />
                  Browse All Videos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <Button variant="secondary" className="h-auto p-4 justify-start" asChild>
              <Link to="/wallet">
                <Coins className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Wallet</p>
                  <p className="text-xs text-muted-foreground">Manage earnings</p>
                </div>
              </Link>
            </Button>
            <Button variant="secondary" className="h-auto p-4 justify-start" asChild>
              <Link to="/records">
                <Download className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Skill Records</p>
                  <p className="text-xs text-muted-foreground">View certificates</p>
                </div>
              </Link>
            </Button>
            <Button variant="secondary" className="h-auto p-4 justify-start" asChild>
              <Link to="/support">
                <MessageCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Support</p>
                  <p className="text-xs text-muted-foreground">Get help</p>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
