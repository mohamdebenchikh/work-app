import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface StepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  user?: any;
}

export default function CompleteStep({ user }: StepProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = () => {
    setSubmitting(true);
    
    router.post(route('setup-profile.complete'), {
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="size-16 text-primary" />
        </div>
        <CardTitle className="text-2xl">Profile Setup Complete!</CardTitle>
        <CardDescription className="text-base">
          You've successfully set up your profile. You're now ready to start using the platform.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Profile Summary</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-primary" />
                <span>Role: {user?.role === 'client' ? 'Client' : 'Service Provider'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-primary" />
                <span>Location: {user?.city}, {user?.country}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-primary" />
                <span>Profile: {user?.name}</span>
              </li>
              {user?.profession && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-primary" />
                  <span>Profession: {user?.profession}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <Button
          onClick={handleComplete}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : (
            "Go to Dashboard"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}