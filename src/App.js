import React, { useState } from 'react';
import FirstForm from './components/FirstForm';
import RideBillGenerator from './components/RideBillGenerator';
import './App.css'
import BackArrow from './components/backarrow.png';
import { Button,Typography,Box } from '@material-ui/core';
function App() {
  const [showComponent, setShowComponent] = useState('firstForm');
  const handleFirstFormSubmit = (date, homeToOffice, officeToHome) => {
    console.log('Date:', date);
    console.log('Home to Office:', homeToOffice);
    console.log('Office to Home:', officeToHome);
    setShowComponent('rideBillGenerator');
  };

  const handleBackToFirstForm = () => {
    setShowComponent('firstForm');
  };

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 0, 0.5)', minHeight: '100vh', padding: '20px' }}>
      {showComponent === 'firstForm' && (
        <div>
          <FirstForm onSubmit={handleFirstFormSubmit} />
          <div style={{
            textAlign: 'center',
            marginTop: '15px'
          }}>
                  <Box style={{ textAlign: 'center' }}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button  variant="contained" color="secondary" onClick={() => setShowComponent('rideBillGenerator')
            }
            
            >
              Generate Ride Bill
            </Button>
            </Box>
          </div>
        </div>
      )}
      {showComponent === 'rideBillGenerator' && (

        <div>
          <Button
            startIcon={
              <img src={BackArrow} alt="Back" style={{ width: 50, height: 40 }} />
            }
            onClick={handleBackToFirstForm}>Back</Button>
          <Typography variant="h6" gutterBottom
            style={{ fontFamily: 'Feast of Flesh BB', textAlign: 'center', fontSize: '35px' }}
          >
            Ride Payment Details
          </Typography>
          <RideBillGenerator />
        </div>
      )}
    </div>
  );
}

export default App;