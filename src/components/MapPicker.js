import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Autocomplete, OverlayView} from "@react-google-maps/api";

const libraries = ["places"];
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


export const MapPicker = ({ isEditing, ubication, setUbication }) => {
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (autocompleteRef.current && isEditing) {
      autocompleteRef.current.setBounds(new window.google.maps.LatLngBounds(ubication.location));
    }
  }, [isEditing, ubication.location]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setUbication({
          ...ubication,
          address: place.formatted_address || "",
          location: newLocation,
        });

        if (mapRef.current) {
          mapRef.current.panTo(newLocation);
        }

        setMarkerPosition(newLocation);
      }
    }
  };

  useEffect(() => {
    if (isMapLoaded && ubication.location) {
      setMarkerPosition(ubication.location);
    }
  }, [ubication.location, isMapLoaded]);

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          placeholder="Selecciona una dirección"
          value={ubication.address || ""}
          onChange={(e) => setUbication({ ...ubication, address: e.target.value })}
          style={{ width: "300px", padding: "8px" }}
        />
      </Autocomplete>

      <GoogleMap
        center={ubication.location}
        zoom={ubication.address ? 15 : 5}
        mapContainerStyle={{ width: "100%", height: "400px", marginTop: "10px" }}
        onLoad={(map) => {
          mapRef.current = map;
          setIsMapLoaded(true);
        }}
      >
        {isMapLoaded && markerPosition && (
          <OverlayView
            position={markerPosition}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                fontSize: "40px",
                transform: "translate(-50%, -50%)",
              }}
            >
              📍
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
