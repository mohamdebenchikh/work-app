import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Phone } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { User } from "@/types";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
  isRequired?: boolean;
}

export default function SelectPhoneStep({ onNext, onPrevious, user, isRequired = false }: StepProps) {
  // Single state for the complete phone number
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");

  // Check if user already has a phone number
  const hasExistingPhone = !!(user?.phone && user.phone.trim() !== '');

  // Form data only contains the phone field that backend expects
  const { setData, post, processing, errors } = useForm({
    phone: user?.phone || "",
  });

  // Check if changes were made
  const hasChanges = useMemo(() => {
    if (!hasExistingPhone) return phoneNumber.trim() !== '';
    return phoneNumber !== (user?.phone || '');
  }, [phoneNumber, hasExistingPhone, user?.phone]);

  // Phone validation
  const isValidPhone = useMemo(() => {
    if (phoneNumber.trim() === '') return !isRequired; // Empty is valid if not required

    // Check if it starts with + and has at least 8 digits
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }, [phoneNumber, isRequired]);

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits, spaces, and + symbol
    const filtered = value.replace(/[^\d\s+]/g, '');
    setPhoneNumber(filtered);
  }, []);

  const handleNext = async () => {
    const cleanPhone = phoneNumber.trim();

    // If not required and no phone number entered, skip
    if (!isRequired && cleanPhone === '') {
      onNext();
      return;
    }

    // Validate phone number
    if (!isValidPhone) {
      toast.error("Please enter a valid phone number with country code");
      return;
    }

    // If user has existing phone and hasn't made changes, just move to next
    if (hasExistingPhone && !hasChanges) {
      toast.success("Using existing phone number");
      onNext();
      return;
    }

    // Set the phone data (remove spaces for backend)
    const formattedPhone = cleanPhone.replace(/\s/g, '');

    setData('phone', formattedPhone);

    setTimeout(() => {

      post(route('setup-profile.set-phone'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Phone number saved successfully");
          onNext();
        },
        onError: (errors) => {
          console.error(errors);
          toast.error(errors.phone || "Failed to save phone number");
        },
      });
    }, 500);


  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">Add Your Phone Number</CardTitle>
          <Badge variant="outline" className="text-xs font-normal bg-muted/50">
            {isRequired ? "Required" : "Optional"}
          </Badge>
        </div>
        <CardDescription className="text-base">

          Please provide your complete phone number including the country code for important updates and notifications.
          {!isRequired && " You can skip this step if you prefer."}

        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Display errors using Alert component */}
        {errors.phone && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.phone}
            </AlertDescription>
          </Alert>
        )}


        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="phone-number" className="text-sm font-medium flex items-center gap-2">
              <Phone className="size-4" />
              Phone Number
            </Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder="Enter your full phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className={cn(
                errors.phone ? "border-red-500 dark:border-red-400" : "",
                !isValidPhone && phoneNumber.trim() !== '' ? "border-orange-400 dark:border-orange-500" : ""
              )}
              aria-invalid={errors.phone ? "true" : "false"}
            />

            {/* Validation feedback */}
            {phoneNumber.trim() !== '' && (
              <div className={cn(
                "text-xs p-2 rounded",
                isValidPhone
                  ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
              )}>
                {isValidPhone ? (
                  <span>✓ Valid phone number format</span>
                ) : (
                  <span>⚠️ Please include country code (starts with +) and use 8-15 digits</span>
                )}
              </div>
            )}

          </div>
        </div>

        <div className="flex flex-col gap-3">
          {!isRequired && !processing && phoneNumber.trim() === '' && (
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
              disabled={processing || (phoneNumber.trim() !== '' && !isValidPhone)}
              className={cn(
                "flex-1 flex items-center gap-2",
                (phoneNumber.trim() === '' && !isRequired) ? "bg-secondary hover:bg-secondary/80" : ""
              )}
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {hasChanges ? "Saving changes..." : "Saving..."}
                </>
              ) : (
                <>
                  {phoneNumber.trim() === '' && !isRequired ? 'Skip' :
                    hasExistingPhone && !hasChanges ? 'Continue' :
                      hasChanges ? 'Save Changes' : 'Next'}
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can update your phone number later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}