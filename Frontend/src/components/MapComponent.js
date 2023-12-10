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

// This component houses the code for the Map page that shows the most likely location of the sequence on a dynamic and interactive map.

// The MapComponent to be rendered on the MainContent component
const MapComponent = ({ location }) => {

    // State to store the coordinates of the location
    const [coordinates, setCoordinates] = useState(null);

    // State to store the loading status while the coordinates are being fetched
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch the coordinates of the location using the OpenStreetMap API
    const fetchCoordinates = async () => {

        // Search for the location coordinates using the OpenStreetMap API
        try {

            // Send a GET request to the OpenStreetMap API to fetch the coordinates
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);

            // If the response is not empty, set the coordinates state
            if (response.data && response.data.length > 0) {
                var { lat, lon } = response.data[0];
                setCoordinates([parseFloat(lat), parseFloat(lon)]);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        } finally {

            // Set the loading status to false after the coordinates are fetched
            setIsLoading(false);
        }
    };

    // Fetch the coordinates when the location changes
    useEffect(() => {
        fetchCoordinates();
    }, [location]);

    // If the coordinates are being fetched, show a loading message
    if (isLoading) {
        return <p>Map is loading...</p>;
    }

    // If the coordinates are not found, show an error message
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
