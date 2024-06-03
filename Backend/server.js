const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allows requests from your React frontend

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://user:user@cluster0.syund4p.mongodb.net/rideBuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Timeout after 30s
  socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema
const dataSchema = new mongoose.Schema({
  date: String,
  homeToOffice: Number,
  officeToHome: Number,
  ridesPerDay: Number
});

// Define a model
const Data = mongoose.model('Data', dataSchema);

// Define a route to handle the form submission
app.post('/submit', async (req, res) => {
  try {
    const newData = new Data({
      date: req.body.date,
      homeToOffice: req.body.homeToOffice,
      officeToHome: req.body.officeToHome,
      ridesPerDay: req.body.homeToOffice + req.body.officeToHome
    });

    await newData.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Define a route to fetch data (GET)
app.get('/getRideDetails', async (req, res) => {
  try {
    const dataList = await Data.find({});
    console.log('Data retrieved successfully', dataList);
    res.json(dataList);
  } catch (error) {
    if (error.name === 'MongooseError' && error.message.includes('timed out')) {
      console.error('Timeout error:', error);
      res.status(500).json({ error: 'Database operation timed out' });
    } else {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Error retrieving data' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { Data };
