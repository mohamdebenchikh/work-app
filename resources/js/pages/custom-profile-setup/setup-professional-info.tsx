import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Loader2, CheckCircle, Briefcase, TrendingUp, Star, Users } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { useState } from "react";
import InputError from "@/components/input-error";
import { cn } from "@/lib/utils";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import { motion, AnimatePresence } from "framer-motion";

// Professional categories for better UX
const PROFESSION_SUGGESTIONS = [
  { category: "Technology", professions: ["Web Developer", "Software Engineer", "Data Scientist", "UI/UX Designer", "DevOps Engineer"] },
  { category: "Design", professions: ["Graphic Designer", "Product Designer", "Interior Designer", "Brand Designer", "Illustrator"] },
  { category: "Business", professions: ["Business Analyst", "Project Manager", "Consultant", "Marketing Manager", "Sales Manager"] },
  { category: "Creative", professions: ["Writer", "Photographer", "Video Editor", "Content Creator", "Copywriter"] },
  { category: "Healthcare", professions: ["Doctor", "Nurse", "Therapist", "Pharmacist", "Medical Researcher"] },
  { category: "Education", professions: ["Teacher", "Professor", "Tutor", "Training Specialist", "Educational Consultant"] }
];

const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "0-1 years", description: "Just starting out", icon: Star, color: "text-green-500" },
  { value: "1-3", label: "1-3 years", description: "Building skills", icon: TrendingUp, color: "text-blue-500" },
  { value: "3-5", label: "3-5 years", description: "Gaining expertise", icon: Award, color: "text-purple-500" },
  { value: "5-10", label: "5-10 years", description: "Highly experienced", icon: Briefcase, color: "text-orange-500" },
  { value: "10+", label: "10+ years", description: "Industry expert", icon: Users, color: "text-red-500" }
];

export default function ProfessionalInfoSetupPage({canSkip,nextStepUrl}: {canSkip?: boolean; nextStepUrl?: string;}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    profession: "",
    years_of_experience: "",
  });
  
  const isComplete = data.profession.trim() && data.years_of_experience;
  const selectedExperience = EXPERIENCE_LEVELS.find(level => level.value === data.years_of_experience);

  const handleSubmit = () => {
    if (!isComplete) {
      toast.error("Please fill in all fields");
      return;
    }

    post(route('profile-setup.professional-info'), {
      onSuccess: () => {
        toast.success("Professional information saved successfully!");
      },
      onError: (errors) => {
        console.error('Professional info save errors:', errors);
        const errorMessage = errors.profession || errors.years_of_experience || errors.message || "Failed to save professional information";
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      },
    });
  };

  const handleProfessionSelect = (profession: string) => {
    setData('profession', profession);
    setShowSuggestions(false);
    toast.success(`Selected: ${profession}`);
  };

  const handleProfessionFocus = () => {
    if (!data.profession) {
      setShowSuggestions(true);
    }
  };

  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData('profession', value);
    setShowSuggestions(value.length === 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const suggestionVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      marginTop: 8,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      transition: { duration: 0.2 }
    }
  };

  const progressPercentage = (isComplete ? 100 : (data.profession ? 50 : 0));

  return (
    <CustomProfileSetUpLayout
      title="Professional Information"
      description="Share your professional background to help others understand your expertise"
      canSkip={canSkip}
      nextStepUrl={nextStepUrl}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Progress indicator */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Setup Progress
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Profession field */}
        <motion.div variants={itemVariants} className="grid gap-3">
          <Label htmlFor="profession" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg transition-all duration-300",
              data.profession ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-700"
            )}>
              <Award className={cn(
                "h-4 w-4 transition-colors duration-300",
                data.profession ? "text-blue-500" : "text-slate-400"
              )} />
            </div>
            Profession
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
              <Briefcase className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="profession"
              placeholder="e.g. Web Developer, Designer, Consultant"
              value={data.profession}
              onChange={handleProfessionChange}
              onFocus={handleProfessionFocus}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className={cn(
                "pl-10 border-2 transition-all duration-300",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "dark:focus:ring-blue-400/20 dark:focus:border-blue-400",
                data.profession ? "border-blue-400 dark:border-blue-500" : "border-slate-200 dark:border-slate-700"
              )}
              disabled={processing}
            />
            {data.profession && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 right-3"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </div>
          
          {/* Profession suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                variants={suggestionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2 flex-wrap">
                    {PROFESSION_SUGGESTIONS.map((category) => (
                      <button
                        key={category.category}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.category ? null : category.category
                        )}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full transition-all duration-200",
                          selectedCategory === category.category
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        )}
                      >
                        {category.category}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {PROFESSION_SUGGESTIONS
                    .filter(cat => !selectedCategory || cat.category === selectedCategory)
                    .flatMap(cat => cat.professions)
                    .map((profession) => (
                      <button
                        key={profession}
                        onClick={() => handleProfessionSelect(profession)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                      >
                        {profession}
                      </button>
                    ))
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <InputError message={errors.profession} className="mt-1" />
        </motion.div>
        
        {/* Experience field */}
        <motion.div variants={itemVariants} className="grid gap-3">
          <Label htmlFor="years" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg transition-all duration-300",
              data.years_of_experience ? "bg-purple-100 dark:bg-purple-900/30" : "bg-slate-100 dark:bg-slate-700"
            )}>
              <TrendingUp className={cn(
                "h-4 w-4 transition-colors duration-300",
                data.years_of_experience ? "text-purple-500" : "text-slate-400"
              )} />
            </div>
            Years of Experience
          </Label>
          <Select 
            value={data.years_of_experience} 
            onValueChange={(value) => setData('years_of_experience', value)}
            disabled={processing}
          >
            <SelectTrigger 
              id="years" 
              className={cn(
                "w-full border-2 transition-all duration-300",
                "focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500",
                "dark:focus:ring-purple-400/20 dark:focus:border-purple-400",
                data.years_of_experience ? "border-purple-400 dark:border-purple-500" : "border-slate-200 dark:border-slate-700"
              )}
            >
              <SelectValue placeholder="Select years of experience" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700">
              {EXPERIENCE_LEVELS.map((level) => {
                const IconComponent = level.icon;
                return (
                  <SelectItem 
                    key={level.value} 
                    value={level.value}
                    className="focus:bg-purple-50 dark:focus:bg-purple-900/20"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={cn("size-4", level.color)} />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-slate-500">{level.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <InputError message={errors.years_of_experience} className="mt-1" />
        </motion.div>

        {/* Preview card */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              variants={itemVariants}
              className="border-t border-slate-200 dark:border-slate-700 pt-4"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <Award className="size-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {data.profession}
                      </h3>
                      {selectedExperience && (
                        <div className="flex items-center gap-2 mt-1">
                          <selectedExperience.icon className={cn("size-4", selectedExperience.color)} />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {selectedExperience.label} • {selectedExperience.description}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || processing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Professional Information"
            )}
          </Button>

          
        </motion.div>
        
      </motion.div>
    </CustomProfileSetUpLayout>
  );
}