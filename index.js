const express = require('express');
const Datastore = require('nedb');
const { request } = require('http');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// Creates DB
const database = new Datastore('database.db');
database.loadDatabase();

// Returns amount of expenses registered
app.get('/api', (request, response) => {
    database.count({type: 'expense'}, (err, data) => {
        response.json(data);
    });
});

// Returns all the database to form the table for the report
app.get('/report', (request, response) =>{
    database.find({}, (err, data) => {
        response.json(data);
    });

});

// Sends info about expense/income and uploads to DB
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

