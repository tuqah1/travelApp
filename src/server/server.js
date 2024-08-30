// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express= require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    })


// Designates what port the app will listen to for incoming requests
app.listen(5500, function () {
    console.log('Example app listening on port 8081!');
});

// Initialize all route with a callback function


//post route
app.post('/add', (req, res) => {
    projectData = req.body; // Store the received data in projectData
    res.status(200).send('Data added successfully');
});

app.get('/all', (req, res) => {
    res.json(projectData); // Return the stored data
});
