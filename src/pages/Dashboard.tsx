import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, BookOpen, Award, Coins, Clock, TrendingUp, 
  Calendar, Star, ArrowRight, Download, MessageCircle 
} from "lucide-react";

const stats = [
  { icon: Coins, label: "Points Balance", value: "2,450", change: "+120 this week", color: "text-primary" },
  { icon: BookOpen, label: "Skills Learned", value: "12", change: "3 in progress", color: "text-category-code" },
  { icon: Award, label: "Skills Taught", value: "8", change: "28 students", color: "text-accent" },
  { icon: Clock, label: "Total Hours", value: "47", change: "+5 this month", color: "text-category-music" },
];

const recentActivity = [
  { type: "earned", title: "Completed React Tutorial", points: 50, time: "2 hours ago", instructor: "Alex Chen" },
  { type: "spent", title: "Booked Piano Lesson", points: -100, time: "Yesterday", instructor: "Emily Rose" },
  { type: "earned", title: "Taught UI Design Basics", points: 150, time: "2 days ago", instructor: "You" },
  { type: "earned", title: "Completed Marketing Course", points: 75, time: "3 days ago", instructor: "James Wilson" },
];

const upcomingSessions = [
  { title: "Advanced TypeScript", instructor: "David Kim", date: "Today, 3:00 PM", points: 200 },
  { title: "Guitar Masterclass", instructor: "Emily Rose", date: "Tomorrow, 5:00 PM", points: 150 },
];

const Dashboard = () => {
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
              Welcome back, <span className="gradient-text">John!</span>
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
            {/* Recent Activity */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'earned' ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'}`}>
                        {activity.type === 'earned' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.instructor} • {activity.time}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${activity.type === 'earned' ? 'text-green-500' : 'text-accent'}`}>
                      {activity.points > 0 ? '+' : ''}{activity.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Upcoming</h2>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors duration-300">
                    <h3 className="font-medium text-foreground mb-1">{session.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{session.instructor}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">{session.date}</span>
                      <span className="font-semibold text-foreground">{session.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/skills">
                  Browse More Skills
                  <ArrowRight className="w-4 h-4" />
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
