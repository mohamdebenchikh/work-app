import { Button } from "./ui/button";
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface ProfileSetupSkipButtonProps {
    canSkip?: boolean;
    nextStepUrl: string
}


export default function ProfileSetupSkipButton({ canSkip = true, nextStepUrl }: ProfileSetupSkipButtonProps) {
    const [isSkipping, setIsSkipping] = useState(false);

    const handleSkip = () => {
        if (!canSkip) return;

        setIsSkipping(true);

        // Make POST request to skip endpoint
        router.post(nextStepUrl, {}, {
            onSuccess: () => {
                // Redirect handled by Laravel controller
                setIsSkipping(false);
            },
            onError: (errors) => {
                console.error('Skip failed:', errors);
                setIsSkipping(false);
            },
            onFinish: () => {
                setIsSkipping(false);
            }
        })
    };

    if (!canSkip) return null;


    return (
        <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-300"
            disabled={isSkipping}
        >
            {isSkipping ? 'Skipping...' : 'Skip this step'}
        </Button>
    )
}