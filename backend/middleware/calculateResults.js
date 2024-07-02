// middleware/calculateResults.js

const calculatePercentage = (data) => {
    const sum = data.reduce((acc, curr) => acc + curr, 0);
    return data.map(value => parseFloat(((value / sum) * 100)));
};
const calculateSum = (data) => {
    const sum = data.reduce((acc, curr) => acc + curr, 0);
    return sum;
};

const calculateFr = (classpixel, floodpixel) => {
    return classpixel.map((classValue, index) => {
        return parseFloat((floodpixel[index] / classValue).toFixed(6));
    });
};

const calculateRf = (fr) => {
    const sum = fr.reduce((acc, curr) => acc + curr, 0);
    return fr.map(value => parseFloat(((value / sum).toFixed(6))));
};

const calculateMinMaxRf = (rf) => {
    const minRf = parseFloat(Math.min(...rf).toFixed(6));
    const maxRf = parseFloat(Math.max(...rf).toFixed(6));
    return {
        minRf,
        maxRf,
        rangeRf: parseFloat((maxRf - minRf).toFixed(6))
    };
};

const calculateIntRf = (rf) => {
    return {
        percentRf:rf.map(value =>parseFloat((value * 100).toFixed(6))),
        intRf:rf.map(value =>Math.round(value * 100))}
    
};

// Middleware to perform calculations
const calculateResults = (req, res, next) => {
    try {
        const { classpixel, floodpixel } = req.body;

        

        // Calculate percentages
        const classpixelPercentages = calculatePercentage(classpixel);
        const floodpixelPercentages = calculatePercentage(floodpixel);

        // Calculate fr
        const fr = calculateFr(classpixel, floodpixel);

        // Calculate rf
        const rf = calculateRf(fr);

        // Calculate min, max, and range of rf
        const { minRf, maxRf, rangeRf } = calculateMinMaxRf(rf);

        // Calculate integer rf
        const {percentRf,intRf} = calculateIntRf(rf);

        //Calculate sum
        const totalClassPixel=calculateSum(classpixel);
        const totalFloodPixel=calculateSum(floodpixel);
        const totalFr=calculateSum(fr);

        // Construct calculatedResult object
        const calculatedResult = {
            classpixelPercentages,
            totalClassPixel,
            floodpixelPercentages,
            totalFloodPixel,
            fr,
            totalFr,
            rf,
            minRf,
            maxRf,
            rangeRf,
            percentRf,
            intRf
        };


       

        // // Add calculatedResult to the request body
         req.body.calculatedResult = calculatedResult;

        next();
    } catch (error) {
        console.error('Error calculating results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = calculateResults;
