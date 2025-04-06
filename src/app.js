const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/user.routes');
const parkingRoutes = require('./routes/parking.routes');

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/parkings',parkingRoutes);

module.exports = app;
