import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Award, Coins } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

const stats = [
  { icon: Users, value: "50K+", label: "Active Users" },
  { icon: Award, value: "10K+", label: "Skills Shared" },
  { icon: Coins, value: "$2M+", label: "Points Earned" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-surface" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Coins className="w-4 h-4" />
              <span>Earn points, learn skills, get paid</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Teach</span> What You Know.{" "}
              <span className="gradient-text">Learn</span> What You Love.{" "}
              <span className="gradient-text">Earn</span> While You Grow.
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Join the world's first skill exchange marketplace. Share your expertise, 
              learn new skills, and convert your knowledge into real earnings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Exchanging
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl">
                <Play className="w-5 h-5" />
                Watch How It Works
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Visual */}
          <div className="relative animate-slide-in-right hidden lg:block">
            <div className="relative w-full max-w-2xl mx-auto">
              <img 
                src={heroIllustration} 
                alt="People exchanging skills and knowledge" 
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 p-4 rounded-2xl glass shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">+50 points earned!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl glass shadow-lg animate-float" style={{ animationDelay: "3s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">New Learner</p>
                    <p className="text-xs text-muted-foreground">joined just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
