import React from 'react';
import './RideReport.css';
import Button from '@material-ui/core/Button';
const RideReport = ({ filteredRidesByDate, rideTotalAmount, deleteRide }) => {
  console.log("RideReport input filteredRidesByDate, rideTotalAmount, handleDelete "
  ,filteredRidesByDate, rideTotalAmount, deleteRide)
  return (
    <div className='generatedReport'>
      <div className='scrollable-generatedReport'>
        <div>
          <div className="grid-header">
            <div className="grid-header-item">Date</div>
            <div className="grid-header-item">Rides Per Day</div>
            <div className="grid-header-item">Action</div>
          </div>
          <div className="grid">
            {Array.isArray(filteredRidesByDate) && filteredRidesByDate.length > 0 ? (
              filteredRidesByDate.map((ride, index) => (
                <div className="grid-row" key={index}>
                  <div className="grid-item">{ride.date}</div>
                  <div className="grid-item">{ride.ridesPerDay}</div>
                  <Button variant="contained"
                    className="delete-button"
                    onClick={() => deleteRide(ride._id)}>Delete</Button>
                </div>
              ))
            ) : (
              <div className="grid-row no-rides">
                <div className="grid-item" colSpan="3">No rides available</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="ride-total-amount">RideTotalAmount: {rideTotalAmount}</p>
      </div>
    </div>
  );
};

export default RideReport;
