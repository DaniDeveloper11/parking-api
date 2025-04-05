const express = require('express');
const userRoutes = require('./routes/user.routes');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use('/api/users', userRoutes);

module.exports = app;
