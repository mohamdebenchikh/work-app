import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { LocationDetails } from '@/types';



interface LocationPickerDialogProps {
    onLocationSelect: (location: LocationDetails) => void;
    initialPosition?: { lat: number; lng: number };
}

interface NominatimResponse {
    address: {
        country: string;
        city?: string;
        town?: string;
        neighbourhood?: string;
        suburb?:string;
        village?: string;
        road?: string;
    };
    display_name: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<Omit<LocationDetails, 'lat' | 'lng'>> {
    try {
        const response = await axios.get<NominatimResponse>(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = response.data;

        return {
            country: data.address.country || '',
            city: data.address.city || data.address.town || data.address.village || '',
            street: data.address.road || data.address.neighbourhood || data.address.suburb ,
            fullAddress: data.display_name || ''
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        // Return empty values if geocoding fails
        return {
            country: '',
            city: '',
            street: '',
            fullAddress: ''
        };
    }
}

function LocationMarker({
    position,
    setPosition,
}: {
    position: LatLng | null;
    setPosition: (position: LatLng) => void;
}) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

export function LocationPickerDialog({ onLocationSelect, initialPosition }: LocationPickerDialogProps) {
    const [position, setPosition] = React.useState<LatLng | null>(
        initialPosition ? new LatLng(initialPosition.lat, initialPosition.lng) : null
    );
    const [loading, setLoading] = useState(false);

    const handleSelect = async () => {
        if (!position) return;

        setLoading(true);
        const addressDetails = await reverseGeocode(position.lat, position.lng);

        // Create the complete location object
        const locationData: LocationDetails = {
            lat: position.lat,
            lng: position.lng,
            country: addressDetails.country as string,
            city: addressDetails.city as string,
            street: addressDetails.street as string,
            fullAddress: addressDetails.fullAddress as string
        };

        onLocationSelect(locationData);
        setLoading(false);
    };

    return (
        <>
            <MapContainer
                center={initialPosition ? new LatLng(initialPosition.lat, initialPosition.lng) : new LatLng(51.505, -0.09)}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {position && <LocationMarker position={position} setPosition={setPosition} />}
            </MapContainer>
            <DialogFooter className='mt-4'>
                <Button onClick={handleSelect} disabled={!position || loading}>
                    {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
                    {loading ? 'Selecting...' : 'Select Location'}
                </Button>
            </DialogFooter>
        </>
    );
}