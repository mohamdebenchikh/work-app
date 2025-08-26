import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, UserIcon, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { User } from "@/types";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
}

export default function SelectAvatarStep({ onNext, onPrevious, user }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar || null);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    avatar: null as File | null,
  });
  
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  }
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }
    
    setPreviewImage(URL.createObjectURL(file));
    setData('avatar', file);
  }
  
  const handleNext = () => {
    if (data.avatar) {
      // Submit with file upload
      post(route('setup-profile.set-avatar'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Avatar saved successfully");
          onNext();
        },
        onError: (errors) => {
          console.error(errors);
          toast.error(errors.avatar || "Failed to save avatar");
        },
      });
    } else {
      // Allow proceeding without an avatar
      onNext();
    }
  }
  
  const handleRemove = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setData('avatar', null);
    reset('avatar');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Select Your Avatar</CardTitle>
        <CardDescription className="text-base">
          Choose a profile picture to personalize your account. This will be visible to other users.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 bg-background rounded-xl border-2 border-dashed">
          <div className="relative mb-4">
            <Avatar className="size-32 border-4 border-background shadow-md">
              {previewImage ? (
                <AvatarImage src={previewImage} alt="Avatar preview" />
              ) : (
                <AvatarFallback className="text-3xl bg-muted">
                  <UserIcon className="size-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              size="icon"
              onClick={previewImage ? handleRemove : handleFileInputClick}
              variant={previewImage ? 'destructive' : 'default'}
              className={cn(
                "absolute bottom-0 right-0 rounded-full",
              )}
            >
              {previewImage ? (
                <Trash2 className="size-4" />
              ) : (
                <Camera className="size-4" />
              )}
            </Button>
            <input
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              ref={fileInputRef}
              accept="image/*"
            />
          </div>
          
          <p className="text-center text-muted-foreground">
            {previewImage 
              ? "Your profile picture looks great!" 
              : "Upload a photo to personalize your profile."
            }
          </p>
          
          {/* Display validation errors */}
          {errors.avatar && (
            <p className="text-sm text-destructive text-center">
              {errors.avatar}
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-center text-xs text-muted-foreground">
            JPG, PNG or GIF. Max file size: 5MB.
          </p>
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
              disabled={processing}
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
            You can update your avatar later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}