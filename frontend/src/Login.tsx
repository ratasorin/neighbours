import "leaflet/dist/leaflet.css";
import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
  useMemo,
  RefAttributes,
  useCallback,
} from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import CustomIcon from "./components/Icon";

export type LocationSelectorProps = {
  setLocation: Dispatch<
    SetStateAction<{ latitude: number; longitude: number }>
  >;
};

function LocationSelector({ setLocation }: LocationSelectorProps) {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [permissionStatus, setPermissionStatus] =
    useState<null | PermissionState>(null);

  const markerRef = useRef<L.Marker | null>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const coords = marker.getLatLng();
          setPosition([coords.lat, coords.lng]);
        }
      },
    }),
    []
  );

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log({ pos });
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setLocation({ latitude, longitude });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  };

  // Function to prompt for location access
  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setLocation({ latitude, longitude });
      },
      (error) => console.error("Error requesting location:", error),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Check the current geolocation permission status
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permission) => {
        setPermissionStatus(permission.state);

        // If permission is granted, get the user's position
        if (permission.state === "granted") {
          getCurrentLocation();
        } else if (permission.state === "prompt") {
          // Ask for location if it's prompt status
          requestLocation();
        }

        // Listen to permission state changes
        permission.onchange = () => setPermissionStatus(permission.state);
      })
      .catch((error) =>
        console.error("Permissions API is not supported:", error)
      );
  }, [setLocation]);

  // Update position on map click
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setPosition([lat, lng]);
      setLocation({ latitude: lat, longitude: lng });
    },
  });

  return position ? (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={CustomIcon}
    />
  ) : null;
}

function LoginPage() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Submitted with location:", location);
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleFormSubmit}
            sx={{ mt: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="forename"
                  label="Forename"
                  name="forename"
                  autoComplete="given-name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  size="small"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  size="small"
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                />
              </Grid>

              {/* Location Map Field */}
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Select Your Location
                </Typography>
                <MapContainer
                  key={`${location.latitude}    ${location.longitude}`}
                  center={[location.latitude, location.longitude]}
                  zoom={
                    location.latitude !== 0 && location.longitude !== 0 ? 13 : 0
                  }
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationSelector setLocation={setLocation} />
                </MapContainer>
              </Grid>
            </Grid>
            <Button
              type="submit"
              size="small"
              variant="contained"
              sx={{
                mt: 2,
                boxShadow: "none",
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
