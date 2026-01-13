import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/skills/SkillCard";
import { ArrowRight } from "lucide-react";

const featuredSkills = [
  {
    id: "1",
    title: "React & TypeScript Masterclass",
    category: "Programming",
    instructor: "Alex Chen",
    instructorAvatar: "",
    rating: 4.9,
    reviews: 156,
    points: 200,
    duration: "2 hours",
    level: "Intermediate" as const,
    image: "",
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    category: "Design",
    instructor: "Sarah Miller",
    instructorAvatar: "",
    rating: 4.8,
    reviews: 203,
    points: 150,
    duration: "1.5 hours",
    level: "Beginner" as const,
    image: "",
  },
  {
    id: "3",
    title: "Digital Marketing Strategy",
    category: "Marketing",
    instructor: "James Wilson",
    instructorAvatar: "",
    rating: 4.7,
    reviews: 89,
    points: 175,
    duration: "2.5 hours",
    level: "Advanced" as const,
    image: "",
  },
  {
    id: "4",
    title: "Guitar for Beginners",
    category: "Music",
    instructor: "Emily Rose",
    instructorAvatar: "",
    rating: 4.9,
    reviews: 312,
    points: 100,
    duration: "1 hour",
    level: "Beginner" as const,
    image: "",
  },
];

export function FeaturedSkills() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Featured Skills
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Trending This Week
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Discover the most popular skills being exchanged on our platform right now.
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0" asChild>
            <Link to="/skills">
              Browse All Skills
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
