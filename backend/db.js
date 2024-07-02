const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, './.env') });
const mongoURI = process.env.mongoURI;

const connectToMongo = async () => {
    try {
        const conn = await mongoose.connect(mongoURI, {
           
        });
        console.log(`Mongo db connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectToMongo;
