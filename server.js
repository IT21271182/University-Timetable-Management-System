const  express = require('express');
const errorHandler = require('./middleware/errorHandler.js');
const connectDB = require('./config/dbConnection.js');
const dotenv = require('dotenv').config();

connectDB();

const app = express();
const port = process.env.PORT;

//Passing the body of the request as a JSON object
app.use(express.json());

app.use("/api/courses", require('./routes/courseRoutes.js'));
app.use("/api/users", require('./routes/userRoutes.js'));
app.use("/api/timetables", require('./routes/timeTableRoutes.js'));
app.use("/api/classRoooms" , require('./routes/classRoomRoutes.js'));
app.use("/api/bookings" , require('./routes/bookingRoutes.js'));
app.use("/api/enrollments" , require('./routes/enrollmentRoutes.js'));
app.use("/api/notifications" , require('./routes/notificationRoutes.js'));

//error handling middleware
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Serer running on port ${port} `);
});

// Export the Express app
module.exports = app;