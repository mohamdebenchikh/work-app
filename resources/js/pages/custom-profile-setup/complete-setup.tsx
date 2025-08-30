import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import { Progress } from "@/components/ui/progress";

interface Step {
  id: string;
  name: string;
  status: 'completed' | 'skipped' | 'pending';
  required: boolean;
  weight: number;
  url: string;
}

interface PageProps {
  steps: Step[];
  completionPercentage: number;
  minCompletionPercentage: number;
  canComplete: boolean;
  missingRequiredSteps: string[];
  [key: string]: any;
}

export default function CompleteSetupPage() {
  const [submitting, setSubmitting] = useState(false);
  const { steps, completionPercentage, minCompletionPercentage, canComplete, missingRequiredSteps } = 
    usePage<PageProps>().props;

  const handleComplete = () => {
    if (!canComplete) return;
    
    setSubmitting(true);
    router.post(route('profile-setup.complete-setup'), {
      profile_completed: true
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Profile setup completed!");
        router.visit(route('dashboard'));
      },
      onError: (errors) => {
        console.error(errors);
        toast.error("Failed to complete profile setup");
        setSubmitting(false);
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'skipped':
        return <AlertTriangle className="size-4 text-yellow-500" />;
      default:
        return <X className="size-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'skipped':
        return 'Skipped';
      default:
        return 'Pending';
    }
  };

  return (
    <CustomProfileSetUpLayout
      title={`Profile Progress: ${Math.round(completionPercentage)}%`}
      description={`Complete your profile to unlock all features. Minimum ${minCompletionPercentage}% required.`}
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Profile Completion</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Missing Required Steps */}
        {missingRequiredSteps.length > 0 && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h3 className="font-medium text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
              <AlertCircle className="size-5" />
              Action Required
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              Please complete the following required steps:
            </p>
            <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
              {missingRequiredSteps.map((step, index) => (
                <li key={index} className="flex items-center gap-2">
                  <X className="size-4" />
                  <span>{step.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps List */}
        <div className="space-y-2">
          <h3 className="font-medium text-slate-900 dark:text-white">Setup Progress</h3>
          <div className="space-y-2">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`p-3 rounded-lg border ${
                  step.status === 'completed' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : step.status === 'skipped'
                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/50'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(step.status)}
                    <span className="font-medium">{step.name}</span>
                    {step.required && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        Required
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {getStatusText(step.status)}
                  </span>
                </div>
                {step.status !== 'completed' && step.status !== 'skipped' && (
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.visit(step.url)}
                      className="text-xs h-7"
                    >
                      Complete Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        <div className="pt-4">
          <Button
            onClick={handleComplete}
            disabled={!canComplete || submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Completing...
              </>
            ) : (
              'Go to Dashboard'
            )}
          </Button>
          
          {!canComplete && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 text-center">
              Please complete all required steps before finishing setup.
            </p>
          )}
        </div>
      </div>
    </CustomProfileSetUpLayout>
  );
}
