import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, UserIcon, Trash2, Loader2, Upload, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import InputError from "@/components/input-error";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import { motion, AnimatePresence } from "framer-motion";

export default function AvatarSetupPage({canSkip,nextStepUrl}: {canSkip?: boolean; nextStepUrl?: string;}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    avatar: null as File | null,
  });

  // Cleanup preview image URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  const validateFile = (file: File): string | null => {
    // File size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPG, PNG, GIF, or WebP)";
    }

    return null;
  };

  const processFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    // Clean up previous preview
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setPreviewImage(URL.createObjectURL(file));
    setData('avatar', file);
    toast.success("Image loaded successfully!");
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!data.avatar) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsUploading(true);

    post(route('profile-setup.avatar'), {
      onSuccess: () => {
        toast.success("Profile picture saved successfully!");
        setIsUploading(false);
      },
      onError: (errors) => {
        console.error('Upload errors:', errors);
        const errorMessage = errors.avatar || errors.message || "Failed to save profile picture";
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
        setIsUploading(false);
      },
      onFinish: () => {
        setIsUploading(false);
      }
    });
  };

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
    toast.success("Image removed");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const avatarVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <CustomProfileSetUpLayout
      title="Profile Picture"
      description="Upload a photo to personalize your account"
      canSkip={canSkip}
      nextStepUrl={nextStepUrl}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className={cn(
            "flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer group",
            dragActive
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 border-solid"
              : previewImage
                ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10 border-solid"
                : "border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!previewImage ? handleFileInputClick : undefined}
        >
          <motion.div
            variants={avatarVariants}
            className="relative mb-6"
          >
            <Avatar className="size-32 border-4 border-white dark:border-slate-800 shadow-lg transition-all duration-300 group-hover:shadow-xl">
              <AnimatePresence mode="wait">
                {previewImage ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AvatarImage
                      src={previewImage}
                      alt="Avatar preview"
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <AvatarFallback className="text-3xl bg-slate-100 dark:bg-slate-700 transition-colors duration-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600">
                      <UserIcon className="size-12 text-slate-400" />
                    </AvatarFallback>
                  </motion.div>
                )}
              </AnimatePresence>
            </Avatar>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="icon"
                onClick={previewImage ? handleRemove : handleFileInputClick}
                variant={previewImage ? 'destructive' : 'outline'}
                className={cn(
                  "absolute bottom-2 right-2 rounded-full border-4 border-white dark:border-slate-800 shadow-lg transition-all duration-300",
                  previewImage
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200 dark:shadow-red-900"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200 dark:shadow-blue-900"
                )}
              >
                {previewImage ? (
                  <Trash2 className="size-4" />
                ) : (
                  <Camera className="size-4" />
                )}
              </Button>
            </motion.div>

            <input
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              ref={fileInputRef}
              accept="image/*"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {previewImage ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="size-5 text-green-500" />
                  <p className="font-medium text-green-700 dark:text-green-400">
                    Perfect!
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Your profile picture looks great!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <Upload className="size-8 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {dragActive ? "Drop your image here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Upload a photo to personalize your profile
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <InputError message={errors.avatar} className="mt-3 text-center" />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supported formats: JPG, PNG, GIF, WebP • Max file size: 5MB
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={processing || isUploading || !data.avatar}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {processing || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Profile Picture"
            )}
          </Button>

        </motion.div>
      </motion.div>
    </CustomProfileSetUpLayout>
  );
}