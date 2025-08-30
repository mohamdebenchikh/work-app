import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import { Tags, Award, Loader2, AlertCircle, CheckCircle, Star, Search, Filter } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import InputError from "@/components/input-error";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Skill } from "@/types";

// Popular categories and skills for better UX
const POPULAR_CATEGORIES = [
  "Web Development", "Mobile Development", "Design", "Marketing", "Writing", "Business"
];

const POPULAR_SKILLS = [
  "JavaScript", "React", "Python", "Design", "SEO", "Content Writing", "Project Management"
];

export default function SkillsCategoriesSetupPage({ categories, skills, canSkip, nextStepUrl }: { categories: Category[], skills: Skill[], canSkip?: boolean, nextStepUrl?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopular, setShowPopular] = useState(true);

  const { data, setData, post, processing, errors } = useForm({
    categories: [] as string[],
    skills: [] as string[],
  });

  // Filter options based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills;
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [skills, searchTerm]);

  // Convert backend data to MultiSelect format
  const categoryOptions = filteredCategories.map(category => ({
    label: category.name,
    value: category.id.toString(),
    description: category.description
  }));

  const skillOptions = filteredSkills.map(skill => ({
    label: skill.name,
    value: skill.id.toString(),
  }));

  // Get popular options that exist in our data
  const popularCategoryOptions = categoryOptions.filter(opt =>
    POPULAR_CATEGORIES.includes(opt.label)
  );

  const popularSkillOptions = skillOptions.filter(opt =>
    POPULAR_SKILLS.includes(opt.label)
  );


  const hasSelections = data.categories.length > 0 || data.skills.length > 0;
  const totalSelections = data.categories.length + data.skills.length;
  const progressPercentage = Math.min((totalSelections / 6) * 100, 100); // Assume 6 as ideal number

  const handleSubmit = () => {
    if (!hasSelections) {
      toast.error("Please select at least one category or skill to continue");
      return;
    }

    post(route('profile-setup.skills-categories'), {
      onSuccess: () => {
        toast.success("Skills and categories saved successfully!");
      },
      onError: (errors) => {
        console.error('Skills/Categories save errors:', errors);
        const errorMessage = errors.categories || errors.skills || errors.message || "Failed to save skills and categories";
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      },
    });
  };


  const handleQuickSelect = (type: 'category' | 'skill', value: string) => {
    if (type === 'category') {
      if (!data.categories.includes(value)) {
        setData('categories', [...data.categories, value]);
        toast.success("Category added!");
      }
    } else {
      if (!data.skills.includes(value)) {
        setData('skills', [...data.skills, value]);
        toast.success("Skill added!");
      }
    }
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

  const quickSelectVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <CustomProfileSetUpLayout
      title="Skills & Categories"
      description="Select your skills and categories to help clients find you"
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
              Selection Progress
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {totalSelections}/6 recommended
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

        {/* Search bar */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder="Search skills and categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 dark:border-slate-700"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </motion.div>

        {/* Popular suggestions */}
        <AnimatePresence>
          {showPopular && !searchTerm && (popularCategoryOptions.length > 0 || popularSkillOptions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-slate-900 dark:text-white">Popular Choices</span>
                </div>
                <button
                  onClick={() => setShowPopular(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Hide
                </button>
              </div>

              <div className="space-y-3">
                {popularCategoryOptions.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Popular Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularCategoryOptions.slice(0, 4).map((option) => (
                        <motion.button
                          key={`cat-${option.value}`}
                          variants={quickSelectVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickSelect('category', option.value)}
                          disabled={data.categories.includes(option.value)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-full transition-all duration-200",
                            data.categories.includes(option.value)
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 cursor-not-allowed"
                              : "bg-white text-slate-700 hover:bg-blue-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:border-slate-600"
                          )}
                        >
                          <Tags className="inline h-3 w-3 mr-1" />
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {popularSkillOptions.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Popular Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSkillOptions.slice(0, 5).map((option) => (
                        <motion.button
                          key={`skill-${option.value}`}
                          variants={quickSelectVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickSelect('skill', option.value)}
                          disabled={data.skills.includes(option.value)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-full transition-all duration-200",
                            data.skills.includes(option.value)
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 cursor-not-allowed"
                              : "bg-white text-slate-700 hover:bg-purple-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-purple-900/20 dark:border-slate-600"
                          )}
                        >
                          <Award className="inline h-3 w-3 mr-1" />
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error display */}
        <AnimatePresence>
          {(errors.categories || errors.skills) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              variants={itemVariants}
            >
              <Alert variant="destructive" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.categories || errors.skills}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Categories section */}
          <motion.div variants={itemVariants} className="grid gap-3">
            <Label className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-300",
                data.categories.length > 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-700"
              )}>
                <Tags className={cn(
                  "size-4 transition-colors duration-300",
                  data.categories.length > 0 ? "text-blue-500" : "text-slate-400"
                )} />
              </div>
              Categories
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                Max 4
              </span>
              {data.categories.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <CheckCircle className="size-4 text-green-500" />
                </motion.div>
              )}
            </Label>
            <MultiSelect
              options={categoryOptions}
              onValueChange={(values) => setData('categories', values)}
              defaultValue={data.categories}
              placeholder="Select categories that describe your work..."
              maxCount={4}
              className="w-full border-slate-200 dark:border-slate-700"
              emptyIndicator={
                <div className="text-center py-4">
                  <Filter className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No categories found.</p>
                  <p className="text-xs text-slate-400">Try adjusting your search terms.</p>
                </div>
              }
              disabled={processing}
            />
            <InputError message={errors.categories} className="mt-1" />
          </motion.div>

          {/* Skills section */}
          <motion.div variants={itemVariants} className="grid gap-3">
            <Label className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-300",
                data.skills.length > 0 ? "bg-purple-100 dark:bg-purple-900/30" : "bg-slate-100 dark:bg-slate-700"
              )}>
                <Award className={cn(
                  "size-4 transition-colors duration-300",
                  data.skills.length > 0 ? "text-purple-500" : "text-slate-400"
                )} />
              </div>
              Skills
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                Max 5
              </span>
              {data.skills.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <CheckCircle className="size-4 text-green-500" />
                </motion.div>
              )}
            </Label>
            <MultiSelect
              options={skillOptions}
              onValueChange={(values) => setData('skills', values)}
              defaultValue={data.skills}
              placeholder="Select skills you're proficient in..."
              maxCount={5}
              className="w-full border-slate-200 dark:border-slate-700"
              emptyIndicator={
                <div className="text-center py-4">
                  <Filter className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No skills found.</p>
                  <p className="text-xs text-slate-400">Try adjusting your search terms.</p>
                </div>
              }
              disabled={processing}
            />
            <InputError message={errors.skills} className="mt-1" />
          </motion.div>

          {/* Selection summary */}
          <AnimatePresence>
            {hasSelections && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                variants={itemVariants}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="size-5 text-green-500" />
                  <p className="font-medium text-slate-900 dark:text-white">Great choices!</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {data.categories.length > 0 && (
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Tags className="size-4" />
                      <span className="font-medium">
                        {data.categories.length} categories selected
                      </span>
                    </div>
                  )}
                  {data.skills.length > 0 && (
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Award className="size-4" />
                      <span className="font-medium">
                        {data.skills.length} skills selected
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-6">
          <Button
            onClick={handleSubmit}
            disabled={processing || !hasSelections}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Skills & Categories"
            )}
          </Button>


        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-slate-500 dark:text-slate-400"
        >
          You can update your skills and categories anytime in your profile settings
        </motion.p>
      </motion.div>
    </CustomProfileSetUpLayout>
  );
}