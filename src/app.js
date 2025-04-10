const express = require('express');
const morgan = require('morgan');
const {graphqlHTTP} = require('express-graphql');
const parkingSchema = require('./graphql/scheme')

const userRoutes = require('./routes/user.routes');
const parkingRoutes = require('./routes/parking.routes');
const checkinRoutes = require('./routes/chekin.routes')

 const auth = require('./middlewares/authMiddleware')

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// app.use('/graphql',auth);
app.use('/graphql', graphqlHTTP((req) =>({
    schema:parkingSchema,
    graphql:true,
    context:{
        user:req.user
    }
})));


app.use('/api/users', userRoutes);
app.use('/api/parkings',parkingRoutes);
app.use('/api/checkin',checkinRoutes);

module.exports = app;
