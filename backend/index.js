const connectToMongo = require('./db');
const express = require('express');
const path = require('path');
const factorRoutes = require('./routes/factorRoutes');
const userRoutes = require('./routes/userRoutes');
var cors = require('cors')

  
connectToMongo();
const app = express();

app.use(cors())
app.use(express.json())


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build')));


// Use userRoutes for handling user authentication related routes
app.use('/api/user', userRoutes);
// Use factorRoutes for handling factors related routes
app.use('/api/factor', factorRoutes);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  })
  
