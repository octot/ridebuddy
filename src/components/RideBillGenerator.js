import React, { useState, useEffect } from 'react';
import { Button, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LoadingScreen from './LoadingScreen';
const useStyles = makeStyles((theme) => ({
  formField: {
    margin: theme.spacing(3, 0), // Increased the margin to 3 spacing units
  },
}));
const RideBillGenerator = () => {
  const classes = useStyles();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [ratePerRide, setRatePerRide] = useState('');
  const [rideDetails, setRideDetails] = useState([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      // const response = await fetch('http://localhost:3001/getRideDetails');
      const response = await fetch('https://ridebuddy.onrender.com/getRideDetails');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      console.log("responseData ", responseData)
      setRideDetails(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  function filterRideDataByDate(rideDetails, fromDate, toDate) {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const filteredData = rideDetails.filter((ride) => {
      const rideDate = new Date(ride.date);
      return rideDate >= fromDateObj && rideDate <= toDateObj;
    });
    return filteredData;
  };
  function totalRideAmount(filteredRidesByDate, ratePerRide) {
    let totalAmount = 0;
    filteredRidesByDate.forEach((ride) => {
      totalAmount += ride.ridesPerDay;
    });
    totalAmount *= ratePerRide;
    return totalAmount;
  }
  const handleSubmit = () => {
    if (fromDate > toDate) {
      alert("From Date cannot be after To Date");
      return;
    }
    if (isNaN(ratePerRide) || ratePerRide <= 0) {
      alert("Rate per Ride must be a positive number");
      return;
    }
    alert("Form submitted successfully!");
  };

  const filteredRidesByDate = filterRideDataByDate(rideDetails, fromDate, toDate);
  const rideTotalAmount = totalRideAmount(filteredRidesByDate, ratePerRide)
  console.log("filteredRidesByDate ", filteredRidesByDate)
  console.log("rideAmount ", rideTotalAmount)
  const copyToClipboard = () => {
    const reportData = `Ride Report\n\n${filteredRidesByDate
      .map(
        (ride) =>
          `Date: ${ride.date}, Rides Per Day: ${ride.ridesPerDay}\n`
      )
      .join('')}Total Ride Amount: ${rideTotalAmount}`;

    navigator.clipboard.writeText(reportData)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });



  }





  const containerContent = (
    <div className='generatedReport'>
      <div className='scrollable-generatedReport'>
        <div>
          <div className="grid-header">
            <div className="grid-header-item">Date</div>
            <div className="grid-header-item">Rides Per Day</div>
          </div>
          <div className="grid-body">
            {Array.isArray(filteredRidesByDate) && filteredRidesByDate.length > 0 ? (
              filteredRidesByDate.map((ride, index) => (
                <div className="grid-row" key={index}>
                  <div className="grid-item">{ride.date}</div>
                  <div className="grid-item">{ride.ridesPerDay}</div>
                </div>
              ))
            ) : (
              <div className="grid-row no-rides">
                <div className="grid-item" colSpan="2">No rides available</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <p>RideTotalAmount: {rideTotalAmount}</p>
      </div>
    </div>

  );
  return (
    <div>
      <Box style={{ textAlign: 'center' }} display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Rate per Ride"
          type="number"
          value={ratePerRide}
          onChange={(e) => setRatePerRide(e.target.value)}
          className={classes.formField}
          variant="outlined"
          fullWidth
        />
      </Box>
      <h1 style={{textAlign:'center'}}>Generated Ride Report</h1>
      <div>
        {containerContent}
        <Box style={{ textAlign: 'center' }}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button onClick={copyToClipboard}  variant="contained" color="primary" type="submit">
          {copied ? 'Copied!' : 'Copy Generated Ride Report'}
        </Button>
        </Box>
      </div>
    </div>
  );
};

export default RideBillGenerator;