import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FormData = {
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

export default function CreatePlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessLevel: "",
    goal: "",
    environment: "",
    diet: "",
  });

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Store form data in localStorage
    localStorage.setItem("fitnessData", JSON.stringify(formData));
    toast({
      title: "Plan Generated! 🎉",
      description: "Your personalized fitness plan is ready.",
    });
    navigate("/results");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.height && formData.weight && formData.fitnessLevel;
      case 3:
        return formData.goal;
      case 4:
        return formData.environment && formData.diet;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Create Your Plan</h1>
          <p className="text-muted-foreground">
            Let's customize your fitness journey
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-1/4 h-2 rounded-full mx-1 transition-all ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Card className="glass-strong p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  Personal Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Body Stats</h2>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height"
                    value={formData.height}
                    onChange={(e) => updateFormData("height", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitness-level">Fitness Level</Label>
                  <Select
                    value={formData.fitnessLevel}
                    onValueChange={(value) =>
                      updateFormData("fitnessLevel", value)
                    }
                  >
                    <SelectTrigger id="fitness-level">
                      <SelectValue placeholder="Select your fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Your Goal</h2>

                <div className="space-y-2">
                  <Label>What's your primary fitness goal?</Label>
                  <RadioGroup
                    value={formData.goal}
                    onValueChange={(value) => updateFormData("goal", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weight-loss" id="weight-loss" />
                      <Label htmlFor="weight-loss" className="cursor-pointer">
                        Weight Loss
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                      <Label htmlFor="muscle-gain" className="cursor-pointer">
                        Muscle Gain
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="strength" id="strength" />
                      <Label htmlFor="strength" className="cursor-pointer">
                        Build Strength
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="endurance" id="endurance" />
                      <Label htmlFor="endurance" className="cursor-pointer">
                        Improve Endurance
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general" className="cursor-pointer">
                        General Fitness
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Preferences</h2>

                <div className="space-y-2">
                  <Label>Training Environment</Label>
                  <RadioGroup
                    value={formData.environment}
                    onValueChange={(value) =>
                      updateFormData("environment", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="cursor-pointer">
                        Home
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gym" id="gym" />
                      <Label htmlFor="gym" className="cursor-pointer">
                        Gym
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outdoor" id="outdoor" />
                      <Label htmlFor="outdoor" className="cursor-pointer">
                        Outdoor
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet">Dietary Preference</Label>
                  <Select
                    value={formData.diet}
                    onValueChange={(value) => updateFormData("diet", value)}
                  >
                    <SelectTrigger id="diet">
                      <SelectValue placeholder="Select your diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">
                        Non-Vegetarian
                      </SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
