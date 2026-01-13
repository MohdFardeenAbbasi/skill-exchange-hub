import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "SkillXchange completely changed how I think about learning. I taught web development and earned enough points to learn piano - something I've always wanted to do!",
    author: "Michael Chen",
    role: "Full Stack Developer",
    avatar: "",
    rating: 5,
  },
  {
    id: 2,
    content: "The platform is incredibly intuitive. I've met amazing people, learned photography, and even converted my teaching points into real money. Highly recommended!",
    author: "Sarah Johnson",
    role: "Graphic Designer",
    avatar: "",
    rating: 5,
  },
  {
    id: 3,
    content: "As a music teacher, I found a whole new audience here. The community is supportive, and the points system is fair and transparent. Love it!",
    author: "Emily Rodriguez",
    role: "Music Instructor",
    avatar: "",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by Skill Sharers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our community members have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-8 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-semibold text-muted-foreground">
                    {testimonial.author[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
