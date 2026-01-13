import { Link } from "react-router-dom";
import { Code, Palette, Music, Dumbbell, Megaphone, GraduationCap, Camera, Briefcase } from "lucide-react";

const categories = [
  { icon: Code, name: "Programming", count: 1240, color: "category-code" },
  { icon: Palette, name: "Design", count: 890, color: "category-design" },
  { icon: Music, name: "Music", count: 567, color: "category-music" },
  { icon: Dumbbell, name: "Fitness", count: 432, color: "category-fitness" },
  { icon: Megaphone, name: "Marketing", count: 678, color: "category-marketing" },
  { icon: GraduationCap, name: "Teaching", count: 345, color: "category-teaching" },
  { icon: Camera, name: "Photography", count: 289, color: "category-design" },
  { icon: Briefcase, name: "Business", count: 512, color: "category-marketing" },
];

export function Categories() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Explore Categories
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Find Your Next Skill
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our diverse categories and discover skills that match your interests.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/skills?category=${category.name.toLowerCase()}`}
                className="group p-6 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-${category.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 text-${category.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.count} skills</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
