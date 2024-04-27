/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config();
const connectionToDb = async()=>{
    try {
        await mongoose.connect(process.env.mongoURI);
        console.log('connected to the database successfully');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    connectionToDb
}