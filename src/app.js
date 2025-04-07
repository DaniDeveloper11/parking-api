const express = require('express');
const morgan = require('morgan');
const {graphqlHTTP} = require('express-graphql');
const parkingSchema = require('./graphql/scheme')

const userRoutes = require('./routes/user.routes');
const parkingRoutes = require('./routes/parking.routes');
const checkinRoutes = require('./routes/chekin.routes')

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/graphql', graphqlHTTP({
    schema:parkingSchema,
    graphql:true
}));


app.use('/api/users', userRoutes);
app.use('/api/parkings',parkingRoutes);
app.use('/api/checkin',checkinRoutes);

module.exports = app;
