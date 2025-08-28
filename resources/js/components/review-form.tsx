import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Review } from '@/types';

interface ReviewFormProps {
    providerId: number;
    review?: Review; // Optional review prop for editing
    onSuccess?: () => void;
}

export default function ReviewForm({ providerId, review, onSuccess }: ReviewFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        rating: review?.rating || 0,
        comment: review?.comment || '',
    });

    const [hoverRating, setHoverRating] = useState(0);

    // Update form data if review prop changes (e.g., when opening for a different review)
    useEffect(() => {
        if (review) {
            setData({ rating: review.rating, comment: review.comment || '' });
        } else {
            reset(); // Clear form for new review
        }
    }, [review]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (review) {
            put(route('reviews.update', review.id), {
                onSuccess: () => {
                    toast.success('Review updated successfully!');
                    onSuccess?.();
                },
                onError: (err) => {
                    console.error(err);
                    toast.error('Failed to update review.');
                },
            });
        } else {
            post(route('providers.reviews.store', providerId), {
                onSuccess: () => {
                    toast.success('Review submitted successfully!');
                    reset();
                    onSuccess?.();
                },
                onError: (err) => {
                    console.error(err);
                    toast.error('Failed to submit review.');
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="rating" className="sr-only">Rating</Label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "h-7 w-7 cursor-pointer transition-colors",
                                (star <= data.rating || star <= hoverRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            )}
                            onClick={() => setData('rating', star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
                {errors.rating && <p className="text-sm text-red-500 mt-1">{errors.rating}</p>}
            </div>

            <div>
                <Label htmlFor="comment">Comment (optional)</Label>
                <Textarea
                    id="comment"
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    className="mt-1"
                />
                {errors.comment && <p className="text-sm text-red-500 mt-1">{errors.comment}</p>}
            </div>

            <Button type="submit" disabled={processing || data.rating === 0}>
                {processing ? (review ? 'Updating...' : 'Submitting...') : (review ? 'Update Review' : 'Submit Review')}
            </Button>
        </form>
    );
}
