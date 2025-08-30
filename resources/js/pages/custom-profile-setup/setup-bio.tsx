import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import InputError from "@/components/input-error";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import { motion, AnimatePresence } from "framer-motion";

export default function BioSetupPage({canSkip, nextStepUrl}: {canSkip?: boolean, nextStepUrl: string}) {
  const [wordCount, setWordCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    bio: "",
  });

  const hasMinimumLength = data.bio.trim().length >= 10;
  const hasContent = data.bio.trim().length > 0;
  const isMaxLength = data.bio.length >= 500;
  const progressPercentage = Math.min((data.bio.length / 500) * 100, 100);

  // Update word count when bio changes
  useEffect(() => {
    const words = data.bio.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(data.bio.trim().length > 0 ? words.length : 0);
  }, [data.bio]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setData('bio', value);
    }
  };

  const handleSubmit = () => {
    

    // Validate minimum length
    if (!hasMinimumLength) {
      toast.error("Bio should be at least 10 characters long");
      return;
    }

    post(route('profile-setup.bio'), {
      onSuccess: () => {
        toast.success("Bio saved successfully!");
      },
      onError: (errors) => {
        console.error('Bio save errors:', errors);
        const errorMessage = errors.bio || errors.message || "Failed to save bio";
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      },
    });
  };


  // Get status color and icon based on bio length
  const getStatusInfo = () => {
    if (!hasContent) {
      return { color: 'text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700', icon: null };
    }
    if (!hasMinimumLength) {
      return { color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertCircle };
    }
    return { color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle };
  };

  const statusInfo = getStatusInfo();

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

  const textareaVariants = {
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)"
    },
    focused: {
      scale: 1.01,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    }
  };

  return (
    <CustomProfileSetUpLayout
      title="About You"
      description="Share a brief bio to help others get to know you better"
      canSkip={canSkip}
      nextStepUrl={nextStepUrl}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="grid gap-4">
          <Label
            htmlFor="bio"
            className="text-slate-700 dark:text-slate-300 flex items-center gap-2 text-sm font-medium"
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-all duration-300",
              statusInfo.bgColor
            )}>
              <PenLine className={cn("size-4 transition-colors duration-300", statusInfo.color)} />
            </div>
            Your Bio

          </Label>

          <motion.div
            variants={textareaVariants}
            animate={isFocused ? "focused" : "unfocused"}
            className="relative"
          >
            <Textarea
              id="bio"
              placeholder="Write a short description about yourself, your interests, and what you're passionate about... Share what makes you unique!"
              value={data.bio}
              onChange={handleBioChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={6}
              maxLength={500}
              disabled={processing}
              className={cn(
                "resize-none border-2 transition-all duration-300 text-sm leading-relaxed",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "dark:focus:ring-blue-400/20 dark:focus:border-blue-400",
                hasContent && !hasMinimumLength && "border-orange-400 dark:border-orange-500",
                hasContent && hasMinimumLength && "border-green-400 dark:border-green-500",
                !hasContent && "border-slate-200 dark:border-slate-700"
              )}
            />

            {/* Status indicator */}
            <AnimatePresence>
              {hasContent && statusInfo.icon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-3 right-3"
                >
                  <statusInfo.icon className={cn("size-5", statusInfo.color)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress bar and stats */}
          <motion.div
            variants={itemVariants}
            className="space-y-3"
          >
            {/* Progress bar */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Progress
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {data.bio.length}/500
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <motion.div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    progressPercentage < 2 ? "bg-slate-300 dark:bg-slate-600" :
                      progressPercentage < 20 ? "bg-orange-400" :
                        progressPercentage < 80 ? "bg-blue-500" :
                          "bg-green-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Stats and validation messages */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
                <AnimatePresence>
                  {hasContent && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={cn(
                        "flex items-center gap-1 font-medium",
                        !hasMinimumLength ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
                      )}
                    >
                      {statusInfo.icon && <statusInfo.icon className="size-3" />}
                      {!hasMinimumLength ?
                        `${10 - data.bio.trim().length} more characters needed` :
                        "Looks good!"
                      }
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {isMaxLength && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-amber-600 dark:text-amber-400 font-medium"
                >
                  Maximum length reached
                </motion.span>
              )}
            </div>
          </motion.div>

          <InputError message={errors.bio} className="mt-2" />
        </motion.div>

        {/* Preview section */}
        <AnimatePresence>
          {hasContent && hasMinimumLength && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              variants={itemVariants}
              className="border-t border-slate-200 dark:border-slate-700 pt-4"
            >
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preview
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {data.bio}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={processing || (hasContent && !hasMinimumLength)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : hasContent ? (
              "Save Bio"
            ) : (
              "Skip Bio"
            )}
          </Button>

        </motion.div>

      </motion.div>
    </CustomProfileSetUpLayout>
  );
}