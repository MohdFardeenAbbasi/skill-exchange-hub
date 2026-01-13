import { UserPlus, BookOpen, Coins, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and list the skills you can teach. Set your availability and point rates for each skill session.",
    color: "primary",
  },
  {
    icon: BookOpen,
    step: "02",
    title: "Teach & Learn",
    description: "Teach your skills to earn points, or spend points to learn new skills from other experts in the community.",
    color: "accent",
  },
  {
    icon: Coins,
    step: "03",
    title: "Earn Real Money",
    description: "Convert your earned points into real money once you reach the minimum threshold. Withdraw anytime.",
    color: "primary",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Start in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of skill sharers who are already teaching, learning, and earning on SkillXchange.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative group">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border">
                    <ArrowRight className="absolute -right-3 -top-2.5 w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="relative z-10 p-8 rounded-2xl gradient-surface border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-2xl ${step.color === 'accent' ? 'gradient-accent' : 'gradient-primary'} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <span className="text-6xl font-bold text-muted/20 absolute top-4 right-6">
                    {step.step}
                  </span>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
