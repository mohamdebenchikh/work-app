import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import { Tags, Award, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Category, Skill, User } from "@/types";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
  categories?: Category[];
  skills?: Skill[];
  isRequired?: boolean;
}

export default function SkillsCategoriesStep({ onNext, onPrevious, user, categories = [], skills = [], isRequired = false }: StepProps) {
  // Convert backend categories and skills to the format expected by MultiSelect
  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.id.toString()
  }));

  const skillOptions = skills.map(skill => ({
    label: skill.name,
    value: skill.id.toString()
  }));

  const { data, setData, post, processing, errors } = useForm({
    categories: user?.categories?.map((cat: Category) => cat.id.toString()) || [],
    skills: user?.skills?.map((skill: Skill) => skill.id.toString()) || [],
  });

  const isComplete = !isRequired || data.categories.length > 0 || data.skills.length > 0;
  const hasSelections = data.categories.length > 0 || data.skills.length > 0;

  const handleNext = () => {
    // If not required and nothing selected, just skip
    if (!isRequired && !hasSelections) {
      onNext();
      return;
    }

    // Otherwise submit the data
    post(route('setup-profile.set-skills-categories'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Skills and categories saved successfully");
        onNext();
      },
      onError: (errors) => {
        console.error(errors);
        const errorMessage = errors.categories || errors.skills || "Failed to save skills and categories";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">Skills & Categories</CardTitle>
          {!isRequired && (
            <Badge variant="outline" className="text-xs font-normal bg-muted/50">
              Optional
            </Badge>
          )}
          {isRequired && (
            <Badge variant="default" className="text-xs font-normal bg-primary/90">
              Required
            </Badge>
          )}
        </div>
        <CardDescription className="text-base">
          Select your skills and categories to help clients find you.
          {!isRequired && " You can skip this step if you prefer."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Display general form errors */}
        {(errors.categories || errors.skills) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.categories || errors.skills}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="categories" className="text-sm font-medium flex items-center gap-2">
                <Tags className="size-4" />
                Categories
              </Label>
            </div>
            <MultiSelect
              options={categoryOptions}
              onValueChange={(values) => setData('categories', values)}
              defaultValue={data.categories}
              placeholder="Select categories..."
              maxCount={4}
              className="w-full"
              emptyIndicator="No categories found."
              variant="default"
              disabled={processing}
            />
            {/* Display category-specific errors */}
            {errors.categories && (
              <p className="text-sm text-destructive">
                {errors.categories}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="skills" className="text-sm font-medium flex items-center gap-2">
                <Award className="size-4" />
                Skills 
              </Label>
            </div>
            <MultiSelect
              options={skillOptions}
              onValueChange={(values) => setData('skills', values)}
              defaultValue={data.skills}
              placeholder="Select skills..."
              maxCount={5}
              className="w-full"
              emptyIndicator="No skills found."
              variant="default"
              disabled={processing}
            />
            {/* Display skill-specific errors */}
            {errors.skills && (
              <p className="text-sm text-destructive">
                {errors.skills}
              </p>
            )}
          </div>

          {/* Selection summary */}
          {hasSelections && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Selected:</p>
              <div className="flex flex-wrap gap-2">
                {data.categories.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tags className="size-3" />
                    <span className="text-xs font-medium">{data.categories.length} categories</span>
                  </div>
                )}
                {data.skills.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Award className="size-3" />
                    <span className="text-xs font-medium">{data.skills.length} skills</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
              disabled={processing || (isRequired && !isComplete)}
              className={cn(
                "flex-1 flex items-center gap-2",
                (!hasSelections && !isRequired) ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : ""
              )}
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {!hasSelections && !isRequired ? 'Skip' : 'Next'}
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can update your skills and categories later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}