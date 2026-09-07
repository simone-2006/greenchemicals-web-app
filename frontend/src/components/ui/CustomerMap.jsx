"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src ?? markerIcon,
    iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
    shadowUrl: markerShadow.src ?? markerShadow,
});

const WORLD_BOUNDS = [
    [-85.051129, -180],
    [85.051129, 180],
];

const LAYERS = {
    street: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    },
    satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri",
        maxZoom: 19,
    },
};

function SyncMapSize() {
    const map = useMap();

    useEffect(() => {
        const container = map.getContainer();

        function sync() {
            map.invalidateSize();
        }

        sync();
        const observer = new ResizeObserver(sync);
        observer.observe(container);
        window.addEventListener("resize", sync);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", sync);
        };
    }, [map]);

    return null;
}

function FlyToPlace({ place }) {
    const map = useMap();

    useEffect(() => {
        if (!place) return;

        if (place.bounds) {
            map.fitBounds(place.bounds, { maxZoom: 16, padding: [32, 32] });
            return;
        }

        map.flyTo([place.lat, place.lon], 13, { duration: 0.75 });
    }, [place, map]);

    return null;
}

export default function CustomerMap({ layer = "street", place = null }) {
    const tiles = LAYERS[layer] || LAYERS.street;

    return (
        <MapContainer
            center={[45.4642, 9.19]}
            zoom={5}
            minZoom={2}
            maxZoom={tiles.maxZoom}
            scrollWheelZoom
            zoomControl
            worldCopyJump={false}
            maxBounds={WORLD_BOUNDS}
            maxBoundsViscosity={1}
            style={{ width: "100%", height: "100%" }}
        >
            <SyncMapSize />
            <FlyToPlace place={place} />
            <TileLayer
                key={layer}
                noWrap
                url={tiles.url}
                attribution={tiles.attribution}
                maxZoom={tiles.maxZoom}
                bounds={WORLD_BOUNDS}
            />
            {place && (
                <Marker position={[place.lat, place.lon]}>
                    <Popup>{place.label}</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
