const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { body, validationResult } = require('express-validator');
const Factor = require('../models/Factor');
const validateInputData = require('../middleware/validateInputData');
const calculateResults = require('../middleware/calculateResults');
const fetchUser = require('../middleware/fetchUser');
const fetchSession = require('../middleware/fetchSession');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const JWT_SECRET = process.env.JWT_SECRET;  




// Function to calculate min(rangerf) among all factors 
const calculateMinRangeRf = (userData) => {
    let minRangeRf = Number.MAX_VALUE;

    userData.factors.forEach(factor => {
        const { calculatedResult } = factor;
        const { rangeRf } = calculatedResult;
        minRangeRf = parseFloat((Math.min(minRangeRf, rangeRf)).toFixed(6));
    });

    return minRangeRf;
};

// Route:1 for creating a new session using: POST "api/factor/createSession"
router.post('/createSession', fetchUser, async (req, res) => {
    let success = false;
    try {
        const user = req.user.id;

        // Create a new factor document to represent the session
        const factor = new Factor({ user, factors: [] });

        // Save the factor document to the database
        await factor.save();
        const data = {
            factor: {
                id: factor.id
            }
        }
        const sessiontoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, sessiontoken });

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Route:2 for handling form submission and calculation using: POST "api/factor/submitData"
router.post('/submitData', [
    body('datalayer').notEmpty(),
    body('noofclasses').isInt({ min: 1 }),
    body('classes').isArray(),
    body('classes.*.min').isFloat(),
    body('classes.*.max').isFloat(),
    body('classpixel').isArray(),
    body('floodpixel').isArray() 
], fetchUser, fetchSession, validateInputData, calculateResults, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new factor object with submitted data and calculated results
        const factor = {
            datalayer: req.body.datalayer,
            noofclasses: req.body.noofclasses,
            classes: req.body.classes,
            classpixel: req.body.classpixel,
            floodpixel: req.body.floodpixel,
            calculatedResult: req.body.calculatedResult // Include calculated results
        };

        const sessionId = req.factor.id;
        // Find the UserInput document based on user ID or create a new one
        let userInput = await Factor.findById(sessionId);
        if (!userInput) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Add the factor to the factors array
        userInput.factors.push(factor);

        // Save the userInput document to the database
        await userInput.save();

        res.json({ message: 'Factor submitted successfully', userInput });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route:3 for displaying all data using: GET "api/factor/displayData"
router.get('/displayData', fetchUser, fetchSession, async (req, res) => {
    try {
        const sessionId = req.factor.id;
        // Retrieve data associated with the session ID
        const userData = await Factor.findById(sessionId);

        if (!userData) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (userData.factors.length === 0) {
            return res.send('No data found for the current session');
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet
        const worksheet = workbook.addWorksheet('Calculated Results');


        // Add headers to the worksheet
        worksheet.addRow([
            'SL.NO', 'Data Layer', 'Class', 'Class Pixel', 'Total Class Pixel', '% Class Pixel', 'Flood Pixel', 'Total Flood Pixel',
            '% Flood Pixel',
            'FR', 'Total FR', 'RF', 'RF(NON%)', 'RF(INT)', 'Min RF', 'Max RF', 'MAX-MIN RF', '(MAX-MIN)MIN RF', 'PR'
        ]);

        let slNo = 1; // Initialize serial number
        // Calculate min range RF value
        const minRangeRf = calculateMinRangeRf(userData);

        // Iterate over each factor in the user input data object

        userData.factors.forEach(factor => {
            const { datalayer, noofclasses, calculatedResult } = factor;
            const { classes: classArray, classpixel: classPixelArray, floodpixel: floodPixelArray } = factor;
           
            for (let i = 0; i < noofclasses; i++) {
                const pr = calculatedResult.rangeRf / minRangeRf;
                // Add data row to the worksheet
                const rowData = [
                    i === 0 ? slNo++ : '',
                    i === 0 ? datalayer : '',
                    getClassRange(classArray[i]),
                    classPixelArray[i] || '',
                    i === 0 ? calculatedResult.totalClassPixel : '',
                    calculatedResult.classpixelPercentages[i].toFixed(6) || '',
                    floodPixelArray[i] || '',
                    i === 0 ? calculatedResult.totalFloodPixel : '',
                    calculatedResult.floodpixelPercentages[i].toFixed(6) || '',
                    calculatedResult.fr[i].toFixed(6) || '',
                    i === 0 ? calculatedResult.totalFr.toFixed(6) : '',
                    calculatedResult.rf[i].toFixed(6) || '',
                    calculatedResult.percentRf[i].toFixed(6) || '',
                    calculatedResult.intRf[i] || '',
                    i === 0 ? calculatedResult.minRf.toFixed(6) : '',
                    i === 0 ? calculatedResult.maxRf.toFixed(6) : '',
                    i === 0 ? calculatedResult.rangeRf.toFixed(6) : '',
                    i === 0 ? minRangeRf.toFixed(6) : '',
                    i === 0 ? pr.toFixed(6) : ''
                ];
                worksheet.addRow(rowData);
            }
        });

        // Generate a file name
        const fileName = 'calculated_results.xlsx';

        // Set headers for response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        // Write the workbook to response
        await workbook.xlsx.write(res);

        // End response
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route:4  for exiting the session and removing user's data from the database using: GET "api/factor/exit"
router.get('/exit', fetchUser, fetchSession, async (req, res) => {
    try {
        const sessionId = req.factor.id;
        await Factor.findByIdAndDelete(sessionId);
        res.send('Factor Session ended successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Function to extract min and max values from classArray object and return as a range
function getClassRange(classData) {
    if (!classData) return ''; // If classData is null or undefined, return empty string
    return `${classData.min}-${classData.max}`;
}

module.exports = router;
