import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import InputError from "@/components/input-error";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  user?: User;
  isRequired?: boolean;
}

interface LocationInfo {
  country: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function SelectLocationStep({ onNext, onPrevious, user, isRequired = true }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const { data, setData, post, processing, errors } = useForm<LocationInfo>({
    country: user?.country || '',
    state: user?.state || '',
    city: user?.city || '',
    address: user?.address || '',
    latitude: user?.latitude || 0,
    longitude: user?.longitude || 0,
  });

  const hasLocationData = !!data.country;

  async function requestCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location details");
          }

          const responseData = await response.json();
          const address = responseData.address;

          const locationInfo: LocationInfo = {
            country: address.country || "Unknown",
            state: address.state || address.region || "Unknown",
            city: address.city || address.town || address.village || "Unknown",
            address: address.road ? `${address.road} ${address.house_number || ""}`.trim() : "Unknown",
            latitude: lat,
            longitude: lon
          };

          setData(locationInfo);
          setIsChange(true);

          toast.success("Location captured successfully!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to get location details");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error("Unable to get current location — permission denied or unavailable");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  }

  const handleNext = () => {
    if (hasLocationData) {
      if (!isChange) return onNext();

      post(route('setup-profile.set-location'), {
        preserveScroll: true,
        onSuccess: () => {
          onNext();
        },
        onError: () => {
          toast.error("Failed to save location data");
        }
      });
    } else if (!isRequired) {
      onNext();
    } else {
      toast.error("Please enable location services to continue");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl">Share Your Location</CardTitle>
          <Badge variant="outline" className="text-xs font-normal bg-muted/50">
            {isRequired ? "Required" : "Optional"}
          </Badge>
        </div>
        <CardDescription className="text-base">
          Enable GPS to help us find opportunities near you. This will improve your experience by showing relevant local services.
          {!isRequired && " You can skip this step if you prefer."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed">
          <div className="relative mb-4">
            <MapPin className="size-12" />
          </div>

          {hasLocationData ? (
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Your Location</h3>
              <div className="text-sm space-y-1">
                <p>{data.city}, {data.state}</p>
                <p>{data.country}</p>               
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Your location will help us match you with nearby clients or service providers.
            </p>
          )}
          <InputError
            message={errors.address || errors.city || errors.country || errors.latitude || errors.longitude || errors.state}
            className="mt-2"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={requestCurrentLocation}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
            variant={hasLocationData ? "outline" : "default"}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Getting your location...
              </>
            ) : hasLocationData ? (
              <>
                <Navigation className="size-4" />
                Update Location
              </>
            ) : (
              <>
                <MapPin className="size-4" />
                Enable Location Services
              </>
            )}
          </Button>

          {!isRequired && !processing && !hasLocationData && (
            <Button
              onClick={onNext}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              Skip this step
            </Button>
          )}

          <div className="flex gap-3 mt-4">
            {onPrevious && (
              <Button
                onClick={onPrevious}
                variant="outline"
                className="flex-1"
                disabled={processing}
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={(isRequired && !hasLocationData) || processing}
              className={cn(
                "flex-1",
                (!hasLocationData && !isRequired) ? "bg-secondary hover:bg-secondary/80" : ""
              )}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                (!hasLocationData && !isRequired) ? "Skip" : "Next"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can update your location later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}