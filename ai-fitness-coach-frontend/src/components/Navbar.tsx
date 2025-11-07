import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    console.log('Theme applied:', theme, 'Classes:', root.classList.toString());
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Dumbbell className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold gradient-text">
              AI Fitness Coach
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
            <Link to="/create">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Get My Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
