import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Loader2, AlertCircle, User as UserIcon } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
  isRequired?: boolean;
}

export default function PersonalInfoStep({ onNext, onPrevious, user, isRequired = false }: StepProps) {
  // Format birthdate for input field (YYYY-MM-DD)
  const formatBirthdate = (date: string | null) => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  // Check if user already has personal info set
  const hasExistingInfo = !!(user?.gender || user?.birthdate);

  // useForm hook with proper initial data
  const { data, setData, post, processing, errors } = useForm({
    gender: user?.gender || "",
    birthdate: formatBirthdate(user?.birthdate || null),
  });

  // Track if changes were made
  const hasChanges = useMemo(() => {
    const originalGender = user?.gender || "";
    const originalBirthdate = formatBirthdate(user?.birthdate || null);
    
    return data.gender !== originalGender || data.birthdate !== originalBirthdate;
  }, [data.gender, data.birthdate, user?.gender, user?.birthdate]);

  const isValidAge = (birthdate: string) => {
    if (!birthdate) return true; // Allow empty if not required
    
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  };

  // Form validation
  const isValidData = useMemo(() => {
    if (!isRequired && !data.gender && !data.birthdate) {
      return true; // Empty is valid if not required
    }
    
    // If any field is filled, validate both (or make them optional individually)
    if (data.birthdate && !isValidAge(data.birthdate)) {
      return false;
    }
    
    return true;
  }, [data.gender, data.birthdate, isRequired]);

  const handleNext = async () => {
    // If not required and no data entered, skip
    if (!isRequired && !data.gender && !data.birthdate) {
      onNext();
      return;
    }

    // Validate age if birthdate is provided
    if (data.birthdate && !isValidAge(data.birthdate)) {
      toast.error("You must be at least 18 years old to use this platform");
      return;
    }

    // If user has existing info and hasn't made changes, just move to next
    if (hasExistingInfo && !hasChanges) {
      toast.success("Using existing personal information");
      onNext();
      return;
    }

    // Only submit to server if there are changes or new data
    // Wait for 2ms as requested
    await new Promise(resolve => setTimeout(resolve, 2));

    post(route('setup-profile.set-personal-info'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Personal information saved successfully");
        onNext();
      },
      onError: (errors) => {
        console.error(errors);
        toast.error(errors.gender || errors.birthdate || "Failed to save personal information");
      },
    });
  };

  // Calculate max date (18 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return eighteenYearsAgo.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <Badge variant="outline" className="text-xs font-normal bg-muted/50">
            {isRequired ? "Required" : "Optional"}
          </Badge>
         
        </div>
        <CardDescription className="text-base">
          
              Please provide your personal information to help us customize your experience.
              {!isRequired && " You can skip this step if you prefer."}
           
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Display errors using Alert component */}
        {(errors.gender || errors.birthdate) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.gender || errors.birthdate}
            </AlertDescription>
          </Alert>
        )}

        
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-muted-foreground" />
              <Label htmlFor="gender" className="text-sm font-medium">
                Gender
                {!isRequired && <span className="text-xs text-muted-foreground ml-2">(Optional)</span>}
              </Label>
            </div>
            <Select 
              value={data.gender} 
              onValueChange={(value) => setData('gender', value)}
            >
              <SelectTrigger 
                id="gender" 
                className={cn(
                  "w-full",
                  errors.gender ? "border-red-500 dark:border-red-400" : ""
                )}
              >
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <Label htmlFor="birthdate" className="text-sm font-medium">
                Birthdate
                {!isRequired && <span className="text-xs text-muted-foreground ml-2">(Optional)</span>}
              </Label>
            </div>
            <Input
              id="birthdate"
              type="date"
              placeholder="Select your birthdate"
              value={data.birthdate}
              onChange={(e) => setData('birthdate', e.target.value)}
              max={getMaxDate()}
              className={cn(
                errors.birthdate ? "border-red-500 dark:border-red-400" : "",
                data.birthdate && !isValidAge(data.birthdate) ? "border-orange-400 dark:border-orange-500" : ""
              )}
            />
            <p className="text-xs text-muted-foreground">
              You must be at least 18 years old to use this platform
            </p>
            
            {/* Age validation feedback */}
            {data.birthdate && (
              <div className={cn(
                "text-xs p-2 rounded",
                isValidAge(data.birthdate) 
                  ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                  : "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              )}>
                {isValidAge(data.birthdate) ? (
                  <span>✓ Valid age</span>
                ) : (
                  <span>⚠️ Must be at least 18 years old</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          {!isRequired && !processing && !data.gender && !data.birthdate && (
            <Button 
              onClick={handleNext} 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip this step
            </Button>
          )}
          
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
              disabled={processing || !isValidData}
              className={cn(
                "flex-1 flex items-center gap-2",
                (!data.gender && !data.birthdate && !isRequired) ? "bg-secondary hover:bg-secondary/80" : ""
              )}
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {hasChanges ? "Saving changes..." : "Saving..."}
                </>
              ) : (
                <>
                  {(!data.gender && !data.birthdate && !isRequired) ? "Skip" : 
                   hasExistingInfo && !hasChanges ? "Continue" : 
                   hasChanges ? "Save Changes" : "Next"}
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            You can update your personal information later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}