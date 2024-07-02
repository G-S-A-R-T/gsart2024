const mongoose = require('mongoose');



// Define sub-schema for class
const ClassSchema = new mongoose.Schema({
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true
    }
});

// Define main schema for input data
const InputDataSchema = new mongoose.Schema({
    datalayer: {
        type: String,
        required: true
    },
    noofclasses: {
        type: Number,
        required: true
    },
    classes: {
        type: [ClassSchema], // Array of ClassSchema objects
        required: true
    },
    classpixel: {
        type: [Number],
        required: true
    },
    floodpixel: {
        type: [Number],
        required: true
    },
    calculatedResult: {
        type: Object, // Define the structure of calculated results
        required: true
    }
});

const FactorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    factors: [InputDataSchema],
    createdAt: { type: Date, default: Date.now }
});

FactorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Factor = mongoose.model('Factor', FactorSchema);

module.exports = Factor;
