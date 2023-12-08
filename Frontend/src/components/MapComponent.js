import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MapComponent = ({ location }) => {
    const [coordinates, setCoordinates] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCoordinates = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
            if (response.data && response.data.length > 0) {
                var { lat, lon } = response.data[0];
                setCoordinates([parseFloat(lat), parseFloat(lon)]);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoordinates();
    }, [location]);

    if (isLoading) {
        return <p>Map is loading...</p>;
    }

    if (!coordinates) {
        return <p>Unable to fetch coordinates</p>;
    }

    return (
        <MapContainer center={coordinates} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordinates}>
                <Popup>{location}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;
