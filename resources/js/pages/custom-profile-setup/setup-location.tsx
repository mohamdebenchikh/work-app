import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin, Navigation, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import { motion, AnimatePresence } from "framer-motion";

interface LocationInfo {
  country: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationSetupPage({canSkip,nextStepUrl}: {canSkip?: boolean; nextStepUrl?: string;}) {
  const [loading, setLoading] = useState(false);

  const { data, setData, post, processing, errors } = useForm<LocationInfo>({
    country: '',
    state: '',
    city: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  const hasLocationData = !!data.country && data.country !== 'Unknown';

  async function requestCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000 * 60 * 5 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'WorkApp-LocationService/1.0'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          
          if (!responseData || !responseData.address) {
            throw new Error("Invalid response from location service");
          }

          const address = responseData.address;

          const locationInfo: LocationInfo = {
            country: address.country || "Unknown",
            state: address.state || address.region || address.province || "Unknown",
            city: address.city || address.town || address.village || address.municipality || "Unknown",
            address: address.road ? 
              `${address.house_number ? address.house_number + ' ' : ''}${address.road}`.trim() : 
              responseData.display_name?.split(',')[0] || "Unknown",
            latitude: lat,
            longitude: lon
          };

          setData(locationInfo);
          toast.success("Location captured successfully!");
        } catch (error) {
          console.error('Location error:', error);
          toast.error("Failed to get location details. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = "Unable to get your location. ";
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += "Please allow location access in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage += "Location request timed out. Please try again.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        
        toast.error(errorMessage);
        setLoading(false);
      },
      options
    );
  }

  const handleSubmit = () => {
    if (!hasLocationData) {
      toast.error("Please enable location services to continue");
      return;
    }

    post(route('profile-setup.location'));
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

  const locationCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <CustomProfileSetUpLayout
      title="Location Settings"
      description="Share your location to find opportunities near you"
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
          variants={locationCardVariants}
          className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
            hasLocationData 
              ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10' 
              : 'border-dashed border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex flex-col items-center justify-center p-6">
            <motion.div 
              className="relative mb-4"
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
            >
              {hasLocationData ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle className="size-12 text-green-500" />
                </motion.div>
              ) : (
                <MapPin className={`size-12 transition-colors duration-300 ${
                  loading ? 'text-blue-500' : 'text-slate-400'
                }`} />
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {hasLocationData ? (
                <motion.div
                  key="location-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
                    Location Found
                  </h3>
                  <div className="space-y-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <span className="text-sm font-medium">
                        {data.city}, {data.state}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {data.country}
                    </p>
                    {data.address && data.address !== 'Unknown' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {data.address}
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-location"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center max-w-sm"
                >
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Enable Location Access
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your location will help us match you with nearby clients or service providers for better opportunities.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <InputError
              message={Object.values(errors)[0]} // Show first error
              className="mt-3"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <Button
            onClick={requestCurrentLocation}
            disabled={loading || processing}
            className={`w-full flex items-center justify-center gap-2 transition-all duration-300 ${
              hasLocationData 
                ? "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            }`}
            variant={hasLocationData ? "outline" : "default"}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!hasLocationData || processing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Location"
              )}
            </Button>
          </div>

        </motion.div>
      </motion.div>
    </CustomProfileSetUpLayout>
  );
}