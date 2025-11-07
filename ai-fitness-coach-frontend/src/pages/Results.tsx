import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";
import { RefreshCw, Download, Save, Headphones, ImageIcon } from "lucide-react";
import { useToast } from "../hooks/use-toast";

type UserData = {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessLevel: string;
  goal: string;
  environment: string;
  diet: string;
};

export default function Results() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("fitnessData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      navigate("/create");
    }
  }, [navigate]);

  const handleRegenerate = () => {
    toast({
      title: "Regenerating Plan",
      description: "Creating a fresh plan for you...",
    });
    setTimeout(() => {
      toast({
        title: "Plan Regenerated! ✨",
        description: "Your new plan is ready.",
      });
    }, 1500);
  };

  const handleSave = () => {
    toast({
      title: "Plan Saved! 💾",
      description: "Your fitness plan has been saved successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting PDF...",
      description: "Your plan will download shortly.",
    });
  };

  if (!userData) return null;

  // Mock workout plan
  const workoutPlan = [
    {
      day: "Monday",
      focus: "Chest & Triceps",
      exercises: ["Push-ups 3x15", "Bench Press 4x10", "Tricep Dips 3x12"],
    },
    {
      day: "Tuesday",
      focus: "Back & Biceps",
      exercises: ["Pull-ups 3x10", "Bent Rows 4x10", "Bicep Curls 3x12"],
    },
    {
      day: "Wednesday",
      focus: "Rest / Cardio",
      exercises: ["Light Jogging 30min", "Stretching 15min"],
    },
    {
      day: "Thursday",
      focus: "Legs",
      exercises: ["Squats 4x12", "Lunges 3x15", "Calf Raises 3x20"],
    },
    {
      day: "Friday",
      focus: "Shoulders & Core",
      exercises: ["Shoulder Press 4x10", "Planks 3x60s", "Russian Twists 3x20"],
    },
  ];

  // Mock diet plan
  const dietPlan = [
    {
      meal: "Breakfast",
      items: ["Oatmeal with berries", "Scrambled eggs", "Green tea"],
      calories: 450,
    },
    {
      meal: "Lunch",
      items: ["Grilled chicken breast", "Brown rice", "Mixed vegetables"],
      calories: 550,
    },
    { meal: "Snack", items: ["Greek yogurt", "Almonds"], calories: 200 },
    {
      meal: "Dinner",
      items: ["Salmon fillet", "Quinoa", "Steamed broccoli"],
      calories: 500,
    },
  ];

  const motivationQuote =
    "Your body can stand almost anything. It's your mind you have to convince. Keep pushing!";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Your Personalized Plan</h1>
          <p className="text-muted-foreground">
            Generated just for you, {userData.name}
          </p>
        </motion.div>

        {/* Motivation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-strong p-6 border-l-4 border-primary">
            <p className="text-lg italic">{motivationQuote}</p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel - Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="glass-strong p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">{userData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium capitalize">
                    {userData.gender}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span className="font-medium">{userData.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{userData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium capitalize">
                    {userData.fitnessLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="font-medium capitalize">
                    {userData.goal.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="font-medium capitalize">
                    {userData.environment}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diet:</span>
                  <span className="font-medium capitalize">
                    {userData.diet}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Plan
                </Button>
                <Button
                  onClick={handleExport}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Center Panel - Workout Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="glass-strong p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Workout Plan 🏋️</h2>
                <Button size="sm" variant="ghost">
                  <Headphones className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {workoutPlan.map((day, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{day.day}</h3>
                      <Button size="sm" variant="ghost">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-primary mb-2">{day.focus}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {day.exercises.map((exercise, i) => (
                        <li key={i}>• {exercise}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Panel - Diet Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="glass-strong p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Diet Plan 🥗</h2>
                <Button size="sm" variant="ghost">
                  <Headphones className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {dietPlan.map((meal, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{meal.meal}</h3>
                      <Button size="sm" variant="ghost">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground mb-2">
                      {meal.items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-primary font-medium">
                      {meal.calories} calories
                    </p>
                  </div>
                ))}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-semibold">Total Daily Calories</p>
                  <p className="text-2xl font-bold text-primary">
                    {dietPlan.reduce((sum, meal) => sum + meal.calories, 0)}{" "}
                    kcal
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
