import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Apple,
  Headphones,
  ImageIcon,
  Sparkles,
  Target,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Dumbbell,
      title: "Workout Generation",
      description:
        "AI-crafted workout plans tailored to your fitness level and goals.",
    },
    {
      icon: Apple,
      title: "Diet Planning",
      description:
        "Personalized meal plans that match your dietary preferences and targets.",
    },
    {
      icon: Headphones,
      title: "Voice Coach",
      description:
        "Audio guidance and motivation to keep you on track every step.",
    },
    {
      icon: ImageIcon,
      title: "Visual Previews",
      description:
        "See AI-generated images of exercises and meals for clarity.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Personalized
              <br />
              <span className="gradient-text">AI Fitness Partner</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get AI-crafted workouts, meal plans, and motivation — all
              customized for you. Start your transformation journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/create">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fitness tools powered by AI to help you reach your
              goals faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass p-6 hover:scale-105 transition-transform cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass-strong p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Fitness?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands who have achieved their goals with personalized
                AI coaching. Your journey starts with a single click.
              </p>
              <Link to="/create">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Create Your Plan Now
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
