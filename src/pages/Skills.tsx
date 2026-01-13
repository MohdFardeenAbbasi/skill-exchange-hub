import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkillCard } from "@/components/skills/SkillCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Code, Palette, Music, Dumbbell, Megaphone, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { icon: Code, name: "All", slug: "all" },
  { icon: Code, name: "Programming", slug: "programming" },
  { icon: Palette, name: "Design", slug: "design" },
  { icon: Music, name: "Music", slug: "music" },
  { icon: Dumbbell, name: "Fitness", slug: "fitness" },
  { icon: Megaphone, name: "Marketing", slug: "marketing" },
  { icon: GraduationCap, name: "Teaching", slug: "teaching" },
];

const allSkills = [
  { id: "1", title: "React & TypeScript Masterclass", category: "Programming", instructor: "Alex Chen", rating: 4.9, reviews: 156, points: 200, duration: "2 hours", level: "Intermediate" as const },
  { id: "2", title: "UI/UX Design Fundamentals", category: "Design", instructor: "Sarah Miller", rating: 4.8, reviews: 203, points: 150, duration: "1.5 hours", level: "Beginner" as const },
  { id: "3", title: "Digital Marketing Strategy", category: "Marketing", instructor: "James Wilson", rating: 4.7, reviews: 89, points: 175, duration: "2.5 hours", level: "Advanced" as const },
  { id: "4", title: "Guitar for Beginners", category: "Music", instructor: "Emily Rose", rating: 4.9, reviews: 312, points: 100, duration: "1 hour", level: "Beginner" as const },
  { id: "5", title: "Python Data Science", category: "Programming", instructor: "David Kim", rating: 4.8, reviews: 245, points: 250, duration: "3 hours", level: "Advanced" as const },
  { id: "6", title: "Logo Design Mastery", category: "Design", instructor: "Anna Lee", rating: 4.6, reviews: 178, points: 180, duration: "2 hours", level: "Intermediate" as const },
  { id: "7", title: "Yoga for Flexibility", category: "Fitness", instructor: "Maria Santos", rating: 4.9, reviews: 421, points: 80, duration: "1 hour", level: "Beginner" as const },
  { id: "8", title: "Public Speaking Confidence", category: "Teaching", instructor: "Robert Brown", rating: 4.7, reviews: 134, points: 120, duration: "1.5 hours", level: "Intermediate" as const },
];

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = allSkills.filter((skill) => {
    const matchesCategory = selectedCategory === "all" || skill.category.toLowerCase() === selectedCategory;
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Browse <span className="gradient-text">Skills</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover thousands of skills from experts around the world. Learn something new today.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search skills or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.slug;
              return (
                <Button
                  key={category.slug}
                  variant={isActive ? "hero" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(!isActive && "hover:bg-muted")}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredSkills.length}</span> skills
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No skills found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Skills;
