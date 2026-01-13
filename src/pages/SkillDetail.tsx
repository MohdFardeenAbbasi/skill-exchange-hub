import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  MessageCircle, 
  Calendar,
  ArrowLeft,
  Heart,
  Share2
} from "lucide-react";

// Mock skill data
const skillsData: Record<string, {
  id: string;
  title: string;
  category: string;
  provider: string;
  providerAvatar: string;
  rating: number;
  reviews: number;
  points: number;
  duration: string;
  level: string;
  students: number;
  description: string;
  highlights: string[];
  requirements: string[];
}> = {
  "1": {
    id: "1",
    title: "Web Development with React",
    category: "Technology",
    provider: "Sarah Chen",
    providerAvatar: "SC",
    rating: 4.9,
    reviews: 128,
    points: 50,
    duration: "2 hours",
    level: "Intermediate",
    students: 340,
    description: "Learn modern React development including hooks, state management, and building responsive web applications. Perfect for those with basic JavaScript knowledge looking to level up their frontend skills.",
    highlights: [
      "Build real-world React applications",
      "Learn React Hooks and Context API",
      "State management with modern patterns",
      "Responsive design with Tailwind CSS",
      "Best practices and performance optimization"
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "Understanding of HTML/CSS",
      "Laptop with Node.js installed"
    ]
  },
  "2": {
    id: "2",
    title: "Digital Marketing Strategy",
    category: "Marketing",
    provider: "Mike Johnson",
    providerAvatar: "MJ",
    rating: 4.8,
    reviews: 95,
    points: 40,
    duration: "1.5 hours",
    level: "Beginner",
    students: 220,
    description: "Master the fundamentals of digital marketing including SEO, social media, content marketing, and paid advertising. Learn to create effective campaigns that drive real results.",
    highlights: [
      "SEO fundamentals and keyword research",
      "Social media marketing strategies",
      "Content marketing best practices",
      "Paid advertising basics",
      "Analytics and measuring success"
    ],
    requirements: [
      "No prior experience needed",
      "Interest in marketing",
      "Basic computer skills"
    ]
  }
};

// Default skill for unknown IDs
const defaultSkill = {
  id: "0",
  title: "Skill Not Found",
  category: "Unknown",
  provider: "Unknown",
  providerAvatar: "?",
  rating: 0,
  reviews: 0,
  points: 0,
  duration: "N/A",
  level: "N/A",
  students: 0,
  description: "This skill could not be found.",
  highlights: [],
  requirements: []
};

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>();
  const skill = id && skillsData[id] ? skillsData[id] : defaultSkill;

  if (!id || !skillsData[id]) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Skill Not Found</h1>
            <p className="text-muted-foreground mb-6">The skill you're looking for doesn't exist.</p>
            <Button variant="hero" asChild>
              <Link to="/skills">Browse All Skills</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20 lg:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/skills" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Skills
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <Badge variant="secondary" className="mb-4">{skill.category}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {skill.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{skill.rating}</span>
                    <span>({skill.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{skill.students} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{skill.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{skill.level}</span>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex items-center gap-4 p-4 glass rounded-xl">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {skill.providerAvatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{skill.provider}</p>
                  <p className="text-sm text-muted-foreground">Skill Provider</p>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Skill</h2>
                <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
              </div>

              {/* What You'll Learn */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">What You'll Learn</h2>
                <ul className="space-y-3">
                  {skill.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {skill.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-primary">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24 space-y-6">
                {/* Points */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Points Required</p>
                  <p className="text-4xl font-bold gradient-text">{skill.points}</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button variant="hero" className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{skill.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium text-foreground">{skill.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium text-foreground">{skill.students}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
