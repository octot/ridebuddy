import React from 'react';
import { useState } from 'react';
import './RideReport.css';
import Button from '@material-ui/core/Button';
import {
  fetchData
} from './FunctionsForRideBillGenerator';
const RideReport = ({ filteredRidesByDate, rideTotalAmount, deleteRide }) => {
  console.log("RideReport input filteredRidesByDate, rideTotalAmount, handleDelete "
    , filteredRidesByDate, rideTotalAmount, deleteRide)
  const [editIndex, setEditIndex] = useState(null);
  const [editedRide, setEditedRide] = useState({});

  const handleEditClick = (index, ride) => {
    setEditIndex(index);
    setEditedRide({ ...ride });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRide({ ...editedRide, [name]: value });
  };

  const handleSaveClick = (id) => {
    console.log("editedRide ", editedRide)
    updateRide(id, editedRide);
    setEditIndex(null);
  };
  const updateRide = async (id, updatedRide) => {
    console.log("from updatedRide ", updatedRide)
    try {
      
      const response = await fetch(`https://ridebuddy.onrender.com/update/${id}`, {
      // const response = await fetch(`http://localhost:3001/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRide),
      });

      if (response.ok) {
        console.log("updatedRide")
        // Update was successful, handle any state updates if necessary
      } else {
        // Handle error response
        console.error('Failed to update ride');
      }
    } catch (error) {
      console.error('Error updating ride:', error);
    }
  };
  return (
    <div className='generatedReport'>
      <div className='scrollable-generatedReport'>
        <div className="grid-header">
          <div className="grid-header-item">Date</div>
          <div className="grid-header-item">Rides Per Day</div>
          <div className="grid-header-item">Action</div>
        </div>
        <div className="grid">
          {Array.isArray(filteredRidesByDate) && filteredRidesByDate.length > 0 ? (
            filteredRidesByDate.map((ride, index) => (
              <div className="grid-row" key={index}>
                {editIndex === index ? (
                  <>
                    <div className="grid-item">
                      <input
                        type="date"
                        name="date"
                        value={editedRide.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid-item">
                      <input
                        type="number"
                        name="ridesPerDay"
                        value={editedRide.ridesPerDay}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button
                      variant="contained"
                      className="save-button"
                      onClick={() => handleSaveClick(ride._id)}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid-item">{ride.date}</div>
                    <div className="grid-item">{ride.ridesPerDay}</div>
                    <Button
                      variant="contained"
                      className="edit-button"
                      onClick={() => handleEditClick(index, ride)}
                    >
                      Edit
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  className="delete-button"
                  onClick={() => deleteRide(ride._id)}
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <div className="grid-row no-rides">
              <div className="grid-item" colSpan="3">
                No rides available
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="ride-total-amount">RideTotalAmount: {rideTotalAmount}</p>
      </div>
    </div>
  );
};
export default RideReport;
