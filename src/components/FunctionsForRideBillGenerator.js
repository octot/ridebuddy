export const fetchData = async (setRideDetails) => {
  try {
    const response = await fetch('http://localhost:3001/getRideDetails');
    // const response = await fetch('https://ridebuddy.onrender.com/getRideDetails');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const responseData = await response.json();
    console.log("responseData ", responseData);
    setRideDetails(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const filterRideDataByDate = (rideDetails, fromDate, toDate) => {
  console.log("filterRideDataByDate input rideDetails: fromDate: toDate:", rideDetails, fromDate, toDate)
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);
  const filteredData = rideDetails.filter((ride) => {
    const rideDate = new Date(ride.date);
    return rideDate >= fromDateObj && rideDate <= toDateObj;
  });
  console.log("filterRideDataByDate output ", filteredData)
  return filteredData;
};

export const totalRideAmount = (filteredRidesByDate, ratePerRide) => {
  let totalAmount = 0;
  filteredRidesByDate.forEach((ride) => {
    totalAmount += ride.ridesPerDay;
  });
  totalAmount *= ratePerRide;
  return totalAmount;
};

export const handleSubmit = (fromDate, toDate, ratePerRide) => {
  if (fromDate > toDate) {
    alert("From Date cannot be after To Date");
    return false;
  }
  if (isNaN(ratePerRide) || ratePerRide <= 0) {
    alert("Rate per Ride must be a positive number");
    return false;
  }
  alert("Form submitted successfully!");
  return true;
};

export const handleDelete = async (id, fetchData, setRideDetails) => {
  try {
    const response = await fetch(`http://localhost:3001/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete ride');
    }
    alert('Ride deleted successfully!');
    // Refresh ride details after delete
    await fetchData(setRideDetails);
  } catch (error) {
    console.error('Error deleting ride:', error);
    alert('Failed to delete ride.');
  }
};
export const copyToClipboard = (filteredRidesByDate, rideTotalAmount, setCopied) => {
  const reportData = `Ride Report\n\n${filteredRidesByDate
    .map(
      (ride) => `Date: ${ride.date}, Rides Per Day: ${ride.ridesPerDay}\n`
    )
    .join('')}Total Ride Amount: ${rideTotalAmount}`;
  // Check if the document is focused
  if (!document.hasFocus()) {
    console.error('Document is not focused. Clipboard operations require focus.');
    return;
  }

  navigator.clipboard.writeText(reportData)
    .then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err);
    });
};

