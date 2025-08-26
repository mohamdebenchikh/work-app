import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Search, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
  isRequired?: boolean;
}

type UserRole = 'client' | 'provider';

export default function SelectRoleStep({ onNext, onPrevious, user, isRequired = true }: StepProps) {
  const { data, setData, post, processing, errors, clearErrors } = useForm({
    role: (user?.role as UserRole) || '' as UserRole
  });

  console.log(user?.role)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Clear any previous errors
    clearErrors();
    
    // Client-side validation
    if (!data.role) {
      return;
    }

    if(data.role === user?.role) {
      onNext();
      return;
    }

    post(route('setup-profile.set-role'), {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Role updated successfully');
        onNext();
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
        // Errors are automatically handled by useForm
      }
    });
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setData('role', selectedRole);
    // Clear any validation errors when user makes a selection
    if (errors.role) {
      clearErrors('role');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">Choose Your Role</CardTitle>
          {isRequired && (
            <Badge variant="outline" className="text-xs font-normal bg-muted/50">
              Required
            </Badge>
          )}
        </div>
        <CardDescription className="text-base">
          Select how you want to use our platform. This helps us customize your experience.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          {/* Client Option */}
          <button
            type="button"
            className={cn([
              "p-6 hover:bg-accent/50 border-2 rounded-xl transition-all duration-200 flex items-start gap-4 group cursor-pointer w-full text-left mb-4",
              data.role === 'client' ? "bg-accent/50 border-primary/50" : "bg-background"
            ])}
            onClick={() => handleRoleSelect('client')}
            aria-pressed={data.role === 'client'}
            disabled={processing}
          >
            <Avatar className="size-14">
              <AvatarFallback className={data.role === 'client' ? "bg-accent" : "bg-accent/50"}>
                <Search className="text-secondary-foreground size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Client
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  I want to hire
                </span>
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                Find skilled professionals, post projects, and manage contracts in one place.
              </p>
            </div>
          </button>

          {/* Provider Option */}
          <button
            type="button"
            className={cn([
              "p-6 hover:bg-accent/50 border-2 rounded-xl transition-all duration-200 flex items-start gap-4 group cursor-pointer w-full text-left mb-4",
              data.role === 'provider' ? "bg-accent/50 border-primary/50" : "bg-background"
            ])}
            onClick={() => handleRoleSelect('provider')}
            aria-pressed={data.role === 'provider'}
            disabled={processing}
          >
            <Avatar className="size-14">
              <AvatarFallback className={data.role === 'provider' ? "bg-accent" : "bg-accent/50"}>
                <Briefcase className="text-secondary-foreground size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Service Provider
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                  I want to work
                </span>
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                Showcase your skills, find clients, and grow your business.
              </p>
            </div>
          </button>

          {/* Server validation errors */}
          {errors.role && (
            <div className="flex items-center gap-2 text-destructive text-sm mb-4">
              <AlertCircle className="size-4" />
              <p>{errors.role}</p>
            </div>
          )}

          <div className="flex gap-2">
            
            <Button
              type="submit"
              variant="default"
              className={onPrevious ? "flex-1" : "w-full"}
              disabled={processing || !data.role}
            >
              {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
              {processing ? "Saving..." : "Next"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}