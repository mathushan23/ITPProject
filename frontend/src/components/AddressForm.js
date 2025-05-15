import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import 'react-toastify/dist/ReactToastify.css';

const AddressForm = () => {
  const [address, setAddress] = useState('');
  const [useGps, setUseGps] = useState(false);
  const [location, setLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const locationHook = useLocation();
  const isOrderPage = locationHook.pathname === '/order';

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const userEmail = localStorage.getItem('userEmail'); // You must store it on login

  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const fetchedAddress = data.results[0].formatted_address;
        setAddress(fetchedAddress);
        await saveLocationToServer(userEmail, fetchedAddress, lat, lng);
      } else {
        toast.warn('No address found for this location');
        setAddress('Address not found');
      }
    } catch (err) {
      toast.error('Failed to fetch address');
      setAddress('Error retrieving address');
    }
  };

  const saveLocationToServer = async (email, address, lat, lng) => {
    try {
      const res = await fetch('/api/save-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, address, lat, lng }),
      });

      if (!res.ok) throw new Error('Failed to save location');
      toast.success('Location saved successfully');
    } catch (err) {
      toast.error('Could not save location');
    }
  };

  const handleUseGpsClick = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          setLocation(coords);
          setSelectedLocation(coords);
          await fetchAddressFromCoordinates(latitude, longitude);
          setShowInfoWindow(true);
          setIsFetchingLocation(false);
        },
        () => {
          toast.error('Failed to get your location');
          setIsFetchingLocation(false);
        }
      );
    }
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const clickedLocation = { lat, lng };
    setSelectedLocation(clickedLocation);
    await fetchAddressFromCoordinates(lat, lng);
    setUseGps(false);
    setShowInfoWindow(true);
  };

  if (!isOrderPage) return null;

  return (
    <div className="container mt-4">
      <label className="form-label">Address:</label>

      {useGps && (
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter or select address"
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleUseGpsClick}
            disabled={isFetchingLocation}
          >
            {isFetchingLocation ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Locating...
              </>
            ) : (
              <>
                <i className="bi bi-geo-alt me-2"></i>
                Use GPS
              </>
            )}
          </button>
        </div>
      )}

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="useCurrentAddress"
          checked={useGps}
          onChange={(e) => {
            const checked = e.target.checked;
            setUseGps(checked);
            if (checked) {
              handleUseGpsClick();
            } else {
              setSelectedLocation(null);
              setShowInfoWindow(false);
              setAddress('');
            }
          }}
        />
        <label className="form-check-label" htmlFor="useCurrentAddress">
          Use GPS Address
        </label>
      </div>

      {address && (
        <div className="alert alert-info p-2 small">
          <i className="bi bi-geo me-2" />
          {useGps ? 'GPS location:' : 'Selected location:'} {address}
        </div>
      )}

      <div style={{ height: '100px', width: '100%' }}>
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={{ height: '100px', width: '100%' }}
            center={selectedLocation || location || { lat: 20.5937, lng: 78.9629 }}
            zoom={selectedLocation || location ? 15 : 5}
            onClick={handleMapClick}
          >
            {(selectedLocation || location) && (
              <Marker position={selectedLocation || location} />
            )}
            {showInfoWindow && selectedLocation && (
              <InfoWindow
                position={selectedLocation}
                onCloseClick={() => setShowInfoWindow(false)}
              >
                <div>{address}</div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default AddressForm;
