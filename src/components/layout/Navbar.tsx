import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Sparkles, Wallet, LayoutDashboard, BookOpen, MessageCircle, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/skills", label: "Browse Skills", icon: BookOpen },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/support", label: "Support", icon: MessageCircle },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">
              SkillXchange
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-2 mt-3 px-4">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" size="sm" className="flex-1" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
