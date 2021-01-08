const express = require('express');
const morgan = require('morgan');
require('./services/passport');

// Routes
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(morgan('dev'));
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
