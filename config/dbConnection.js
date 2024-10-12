const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
        console.log('Connected to DB' , connect.connection.name);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;