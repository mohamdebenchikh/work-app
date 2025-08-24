import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

/**
 * Address info now uses browser geolocation + reverse geocoding (Nominatim)
 * - shows explanatory text
 * - button to request current location
 * - displays formatted address and OSM embed map with marker
 * - update button posts hidden fields (country, state, city, address, latitude, longitude)
 */
export default function AddressInfoForm({ user }: { user: User }) {
    const [latitude, setLatitude] = useState<number | undefined>(user.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(user.longitude);
    const [displayAddress, setDisplayAddress] = useState<string | undefined>(undefined);
    const [country, setCountry] = useState<string | undefined>(user.country || undefined);
    const [stateVal, setStateVal] = useState<string | undefined>(user.state || undefined);
    const [city, setCity] = useState<string | undefined>(user.city || undefined);
    const [addressLine, setAddressLine] = useState<string | undefined>(user.address || undefined);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        // If user already has lat/lng, try reverse geocoding once to populate a nicer address
        if (latitude && longitude && !displayAddress) {
            reverseGeocode(latitude, longitude);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function reverseGeocode(lat: number, lon: number) {
        setLoadingLocation(true);
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
                lat,
            )}&lon=${encodeURIComponent(lon)}`,
        )
            .then((r) => {
                if (!r.ok) throw new Error('Reverse geocode failed');
                return r.json();
            })
            .then((data) => {
                const display = data.display_name as string | undefined;
                setDisplayAddress(display || undefined);

                const addr = data.address || {};
                // Nominatim returns many possible keys; map common ones
                setCountry(addr.country || user.country || undefined);
                setStateVal(addr.state || addr.region || user.state || undefined);
                setCity(addr.city || addr.town || addr.village || user.city || undefined);
                const parts: string[] = [];
                if (addr.house_number) parts.push(addr.house_number);
                if (addr.road) parts.push(addr.road);
                if (addr.neighbourhood) parts.push(addr.neighbourhood);
                if (addr.suburb) parts.push(addr.suburb);
                if (!parts.length && display) parts.push(display.split(',').slice(0, 3).join(', '));
                setAddressLine(parts.join(' ') || user.address || undefined);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Unable to resolve address for the selected location');
            })
            .finally(() => setLoadingLocation(false));
    }

    function requestCurrentLocation() {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setLatitude(lat);
                setLongitude(lon);
                reverseGeocode(lat, lon);
                toast.success('Location captured — review and press Update to save');
                setLoadingLocation(false);
            },
            (err) => {
                console.error(err);
                toast.error('Unable to get current location — permission denied or unavailable');
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 20000 },
        );
    }

    return (
        <Form
            method="patch"
            action={route('profile.update.address')}
            onSuccess={() => toast.success('Address updated')}
            onError={(errors: Record<string, string>) => {
                if (errors && Object.keys(errors).length) {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first);
                }
            }}
            options={{ preserveScroll: true }}
            className="space-y-6"
        >
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            We can use your device's location to set your address. Click
                            "Get Current Location" to allow the app to detect your position. You
                            will see a preview on the map — press "Update Location" to save to your
                            profile.
                        </p>

                        <div className="flex gap-2">
                            <Button type="button" onClick={requestCurrentLocation} disabled={loadingLocation}>
                                {loadingLocation ? 'Getting location…' : 'Get Current Location'}
                            </Button>
                            <Button type="submit" disabled={processing || !latitude || !longitude}>
                                {processing ? 'Updating…' : 'Update Location'}
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Location preview</Label>
                        <div className="rounded-md border bg-muted p-2">
                            {latitude && longitude ? (
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        {displayAddress || addressLine || `${city || ''} ${stateVal || ''}`}
                                    </div>

                                    <div className="w-full aspect-[4/3] overflow-hidden rounded-md border">
                                        {latitude && longitude && (
                                            (() => {
                                                const zoom = 14; // city-level default; adjust if you want closer/farther
                                                const src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&zoom=${zoom}&lat=${encodeURIComponent(
                                                    latitude.toString(),
                                                )}&lon=${encodeURIComponent(longitude.toString())}&marker=${encodeURIComponent(
                                                    latitude.toString(),
                                                )},${encodeURIComponent(longitude.toString())}`;
                                                return (
                                                    <iframe title="map-preview" src={src} className="w-full h-full" loading="lazy" />
                                                );
                                            })()
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    No location selected yet. Click "Get Current Location" to begin.
                                </div>
                            )}
                        </div>
                        <InputError className="mt-2" message={errors.latitude || errors.longitude} />
                    </div>

                    {/* Hidden fields to submit to the profile update endpoint */}
                    <input type="hidden" name="country" value={country || ''} />
                    <input type="hidden" name="state" value={stateVal || ''} />
                    <input type="hidden" name="city" value={city || ''} />
                    <input type="hidden" name="address" value={addressLine || ''} />
                    <input type="hidden" name="latitude" value={latitude ?? ''} />
                    <input type="hidden" name="longitude" value={longitude ?? ''} />

                    <div className="flex items-center gap-4">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </>
            )}
        </Form>
    );
}
