import React, { useState, useEffect } from 'react';
import { Button, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './RideBillGenerator.css'
import {
  fetchData,
  filterRideDataByDate,
  totalRideAmount,
  handleSubmit,
  handleDelete,
  copyToClipboard
} from './FunctionsForRideBillGenerator';
import RideReport from './RideReport'
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
    fetchData(setRideDetails);
  }, []);
  const filteredRidesByDate = filterRideDataByDate(rideDetails, fromDate, toDate);
  const rideTotalAmount = totalRideAmount(filteredRidesByDate, ratePerRide)
  const deleteRide = async (id) => {
    await handleDelete(id, fetchData, setRideDetails);
  };
  console.log("filteredRidesByDate ", filteredRidesByDate)
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
      <h1 style={{ textAlign: 'center' }}>Generated Ride Report</h1>
      <div>
        {RideReport({filteredRidesByDate, rideTotalAmount, deleteRide})}
        <Box style={{ textAlign: 'center' }}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button onClick={()=>copyToClipboard(filteredRidesByDate, rideTotalAmount, setCopied)}
            variant="contained" color="primary" type="submit">
            {copied ? 'Copied!' : 'Copy Generated Ride Report'}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default RideBillGenerator;