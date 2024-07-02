const { validationResult } = require('express-validator');

// Custom validation middleware to check if max is greater than min
const validateInputData = (req, res, next) => {
    const errors = [];
    const { noofclasses, classes: classes, classpixel, floodpixel } = req.body;
    
    // Check if arrays have lengths equal to noofclasses
    if (!classes || !Array.isArray(classes) || classes.length !== noofclasses) {
        errors.push({ message: `Length of 'class' array must be equal to noofclasses` });
    }
    if (!classpixel || !Array.isArray(classpixel) || classpixel.length !== noofclasses) {
        errors.push({ message: `Length of 'classpixel' array must be equal to noofclasses` });
    }
    if (!floodpixel || !Array.isArray(floodpixel) || floodpixel.length !== noofclasses) {
        errors.push({ message: `Length of 'floodpixel' array must be equal to noofclasses` });
    }

    // Check each class
    if (classes) {
        classes.forEach((classItem, index) => {
            if (classItem.min >= classItem.max) {
                errors.push({ message: `max value must be greater than min value for class ${index + 1}` });
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = validateInputData;
