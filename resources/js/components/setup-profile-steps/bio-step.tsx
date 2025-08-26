import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
  isRequired?: boolean;
}

export default function BioStep({ onNext, onPrevious, user, isRequired = false }: StepProps) {
  const { data, setData, post, processing, errors } = useForm({
    bio: user?.bio || "",
  });
  
  // Form is complete if bio is valid or if the step is not required
  const isComplete = data.bio.trim().length >= 10 || !isRequired;
  const hasMinimumLength = data.bio.trim().length >= 10;

  const handleNext = () => {
    // If bio is empty and step is not required, skip to next step
    if (data.bio.trim().length === 0 && !isRequired) {
      onNext();
      return;
    }
    
    // Otherwise, save the data if bio is valid
    if (isComplete && (hasMinimumLength || !isRequired)) {
      post(route('setup-profile.set-bio'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Bio saved successfully");
          onNext();
        },
        onError: (errors) => {
          console.error(errors);
          toast.error(errors.bio || "Failed to save bio");
        },
      });
    }
  };
  

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
          {!isRequired && (
            <Badge variant="outline" className="text-xs font-normal bg-muted/50">
              Optional
            </Badge>
          )}
        </div>
        <CardDescription className="text-base">
          Share a brief bio to help others get to know you better.
          {!isRequired && " You can skip this step if you prefer."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                <PenLine className="size-4" />
                Your Bio
              </Label>
            </div>
            <Textarea
              id="bio"
              placeholder="Write a short description about yourself, your interests, and what you're passionate about..."
              value={data.bio}
              onChange={(e) => setData('bio', e.target.value)}
              rows={5}
              maxLength={500}
              disabled={processing}
              className={cn(
                "resize-none",
                data.bio.length > 0 && !hasMinimumLength && isRequired && "border-destructive"
              )}
            />
            
            {/* Display validation errors */}
            {errors.bio && (
              <p className="text-sm text-destructive">
                {errors.bio}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 mt-4">
            
            <div className="flex gap-3">
              {onPrevious && (
                <Button
                  onClick={onPrevious}
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                  disabled={processing}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={(!isComplete && isRequired) || processing}
                className={cn(
                  "flex-1 flex items-center gap-2",
                  (data.bio.trim().length === 0 && !isRequired) ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : ""
                )}
              >
                {processing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {(data.bio.trim().length === 0 && !isRequired) ? "Skip" : "Next"}
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            You can update your bio later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}