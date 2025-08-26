import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { User } from "@/types";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
}

export default function ProfessionalInfoStep({ onNext, onPrevious, user }: StepProps) {
  const { data, setData, post, processing, errors } = useForm({
    profession: user?.profession || "",
    years_of_experience: user?.years_of_experience ? String(user.years_of_experience) : "",
  });
  
  const isComplete = data.profession && data.years_of_experience;

  const handleNext = () => {
    if (isComplete) {
      
      post(route('setup-profile.set-professional-info'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Professional information saved successfully");
          onNext();
        },
        onError: (errors) => {
          console.error(errors);
          toast.error(errors.profession || errors.years_of_experience || "Failed to save professional information");
        },
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Professional Information</CardTitle>
        <CardDescription className="text-base">
          Share your professional background to help others understand your expertise.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="profession" className="text-sm font-medium">
              Profession
            </Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="profession"
                placeholder="e.g. Web Developer, Designer, Consultant"
                value={data.profession}
                onChange={(e) => setData('profession', e.target.value)}
                className="pl-10"
                disabled={processing}
              />
            </div>
            {/* Display validation errors */}
            {errors.profession && (
              <p className="text-sm text-destructive">
                {errors.profession}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="years" className="text-sm font-medium">
              Years of Experience
            </Label>
            <Select 
              value={data.years_of_experience} 
              onValueChange={(value) => setData('years_of_experience', value)}
              disabled={processing}
            >
              <SelectTrigger id="years" className="w-full">
                <SelectValue placeholder="Select years of experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years (Beginner)</SelectItem>
                <SelectItem value="1-3">1-3 years (Intermediate)</SelectItem>
                <SelectItem value="3-5">3-5 years (Experienced)</SelectItem>
                <SelectItem value="5-10">5-10 years (Advanced)</SelectItem>
                <SelectItem value="10+">10+ years (Expert)</SelectItem>
              </SelectContent>
            </Select>
            {/* Display validation errors */}
            {errors.years_of_experience && (
              <p className="text-sm text-destructive">
                {errors.years_of_experience}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 mt-4">
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
              disabled={!isComplete || processing}
              className="flex-1 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            You can update your professional information later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}