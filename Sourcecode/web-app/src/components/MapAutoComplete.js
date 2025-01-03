import React, { useState } from 'react';
import { TextField, Paper, List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Map from './Map';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
  },
  searchResults: {
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    maxHeight: 200,
    overflow: 'auto',
  },
  mapContainer: {
    height: 200,
    marginTop: theme.spacing(2),
  },
}));

const MapAutoComplete = ({ placeholder, value, onChange }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const searchLocation = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchText(query);
    if (query.length > 2) {
      searchLocation(query);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleLocationSelect = (location) => {
    const selectedPlace = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      add: location.display_name,
    };
    setSelectedLocation(selectedPlace);
    setSearchText(location.display_name);
    setShowResults(false);
    onChange(selectedPlace);
  };

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchText}
        onChange={handleSearchChange}
        variant="outlined"
      />
      {showResults && searchResults.length > 0 && (
        <Paper className={classes.searchResults}>
          <List>
            {searchResults.map((result) => (
              <ListItem
                button
                key={result.place_id}
                onClick={() => handleLocationSelect(result)}
              >
                <ListItemText primary={result.display_name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {selectedLocation && (
        <div className={classes.mapContainer}>
          <Map
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={15}
            markers={[
              {
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                popup: selectedLocation.add,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default MapAutoComplete; 