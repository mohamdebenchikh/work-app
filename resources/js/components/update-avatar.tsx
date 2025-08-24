import { usePage, router } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { SharedData } from "@/types"
import { useInitials } from "@/hooks/use-initials";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { Alert,AlertTitle,AlertDescription } from "./ui/alert";


export default function UpdateAvatar() {
    const { auth } = usePage<SharedData>().props
    const { avatar, name } = auth.user;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error,setError] = useState<string | null>(null);

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
        setSelectedFile(file);
        setOpenDialog(true);
    }

    const handleUpload = () => {
        if (!selectedFile) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        
        router.post(
            route('profile.update.avatar'),
            formData, 
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                onProgress: (progress ) => {
                    // progress.percentage is available in newer versions of Inertia
                    if (progress?.percentage) {
                        setUploadProgress(progress.percentage);
                    } else {
                        // Fallback: simulate progress if not available
                        setUploadProgress(prev => Math.min(prev + 10, 90));
                    }
                },
                onSuccess: () => {
                    setUploadProgress(100);
                    toast.success("Avatar updated successfully!");
                    handleDialogClose();
                },
                onError: (errors) => {
                    console.error('Upload errors:', errors);
                    setError(errors.avatar);
                    
                    // Handle specific error messages
                    if (errors.avatar) {
                        toast.error(errors.avatar);
                    } else if (Object.keys(errors).length > 0) {
                        toast.error("Failed to update avatar. Please try again.");
                    } else {
                        toast.error("An unexpected error occurred. Please try again.");
                    }
                    
                    setIsUploading(false);
                    setUploadProgress(0);
                },
                onFinish: () => {
                    setIsUploading(false);
                }
            }
        );
    }

    const handleDialogClose = () => {
        if (isUploading) return; // Prevent closing during upload
        
        // Cleanup object URL to prevent memory leaks
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        
        setPreviewImage(null);
        setSelectedFile(null);
        setOpenDialog(false);
        setUploadProgress(0);
    }

    return (
        <div className="relative">
            <Avatar className="size-36 border-2 border-accent-foreground">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="text-3xl">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>
            <Button 
                size={'icon'} 
                onClick={handleFileInputClick} 
                className="absolute bottom-2 right-0 rounded-full"
                disabled={isUploading}
            >
                <Camera className="size-4" />
            </Button>
            <input 
                type="file" 
                className="hidden" 
                onChange={handleFileInputChange} 
                ref={fileInputRef} 
                accept="image/*" 
                disabled={isUploading}
            />

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Update Avatar</DialogTitle>
                        <DialogDescription>
                            Choose a new avatar for your account. Max file size: 5MB.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <Alert>
                            <AlertTitle>
                                Uplaoding Failed
                            </AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {previewImage && (
                        <div className="flex items-center justify-center py-6">
                            <Avatar className="size-64 border-4 border-accent-foreground">
                                <AvatarImage src={previewImage} alt="Avatar preview" />
                            </Avatar>
                        </div>
                    )}

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button 
                            onClick={handleDialogClose} 
                            variant="secondary"
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Cancel"}
                        </Button>
                        <Button 
                            onClick={handleUpload}
                            disabled={isUploading || !selectedFile}
                        >
                            {isUploading ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}