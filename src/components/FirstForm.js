import React, { useState } from 'react';
import { FormControlLabel, Checkbox, TextField, Button, Container, Box, Typography } from '@mui/material';
import './components.css'
import LoadingScreen from './LoadingScreen';
function App() {
  const [homeToOffice, setHomeToOffice] = useState(false);
  const [officeToHome, setOfficeToHome] = useState(false);
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handleHomeToOfficeChange = () => {
    setHomeToOffice(!homeToOffice);
  };

  const handleOfficeToHomeChange = () => {
    setOfficeToHome(!officeToHome);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const convertToBinary = (value) => {
    return value ? 1 : 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    const homeToOfficeValue = convertToBinary(homeToOffice);
    const officeToHomeValue = convertToBinary(officeToHome);

    const dataFromMongo = {
      date: date,
      homeToOffice: homeToOfficeValue,
      officeToHome: officeToHomeValue,
      ridesPerDay: homeToOfficeValue + officeToHomeValue
    };

    // fetch('http://localhost:3001/submit', {
    try {
      const response = await fetch('https://ridebuddy.onrender.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFromMongo)
      });

      if (!response.ok) {
        throw new Error('Ride Record failed :(');
      }

      const data = await response.json();
      setSuccess(true);
      alert('Ride Record saved successfully :)');
      console.log('Success:', data);
    } catch (error) {
      alert('Ride Record failed :(');
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Container maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom
            style={{ fontFamily: 'Feast of Flesh BB', textAlign: 'center' }}
          >
            RIDEBUDDY
          </Typography>
          <div style={{ textAlign: 'center', fontFamily: 'Feast of Flesh BB reg' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={homeToOffice}
                  onChange={handleHomeToOfficeChange}
                  color="primary"
                />
              }
              label="Home to Office"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={officeToHome}
                  onChange={handleOfficeToHomeChange}
                  color="primary"
                />
              }
              label="Office to Home"
            />
            <TextField
              type="date"
              value={date}
              onChange={handleDateChange}
              label="Date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '50%' }}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              {isLoading && <LoadingScreen />}
              {error && <div>{error}</div>}
              {success}
            </Box>
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default App;
