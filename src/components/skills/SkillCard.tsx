import { Link } from "react-router-dom";
import { Star, Clock, Coins, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorAvatar?: string;
  rating: number;
  reviews: number;
  points: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image?: string;
}

const levelColors = {
  Beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  Intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const categoryColors: Record<string, string> = {
  Programming: "bg-category-code/10 text-category-code",
  Design: "bg-category-design/10 text-category-design",
  Marketing: "bg-category-marketing/10 text-category-marketing",
  Music: "bg-category-music/10 text-category-music",
  Fitness: "bg-category-fitness/10 text-category-fitness",
  Teaching: "bg-category-teaching/10 text-category-teaching",
};

export function SkillCard({
  id,
  title,
  category,
  instructor,
  rating,
  reviews,
  points,
  duration,
  level,
}: SkillCardProps) {
  return (
    <Link to={`/skills/${id}`} className="group block">
      <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 group-hover:-translate-y-1">
        {/* Image Placeholder */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full gradient-primary opacity-20" />
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", categoryColors[category] || "bg-muted text-muted-foreground")}>
              {category}
            </span>
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", levelColors[level])}>
              {level}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <User className="w-3 h-3 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">{instructor}</span>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg text-foreground">{points}</span>
              <span className="text-sm text-muted-foreground">points</span>
            </div>
            <Button variant="hero" size="sm">Book</Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
