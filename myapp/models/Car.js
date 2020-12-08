

const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    prod: String,
    quality: String,
    color: String,
    year: Number,
    wheel: String,
    picture: String,
    bodyType: String,
    fuel: String,
    capacity: Number,
    drive: String,
    price: String,
    description: String,    
});

const car = mongoose.model('motercycleList',vehicleSchema);

module.exports = car;

