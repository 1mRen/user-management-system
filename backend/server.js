require('rootpath')();
require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Allow CORS requests from specified origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['https://user-management-system-6yrwvx8op-1mrens-projects.vercel.app', 
     'https://user-management-system-pm.vercel.app',
     'https://user-management-system-j0up52tis-1mrens-projects.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    // For development/testing - allow requests with no origin
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
      callback(null, true);
    } else {
      console.log(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add OPTIONS handler for preflight requests
app.options('*', cors());

// API routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/departments', require('./departments/departments.controller'));
app.use('/employees', require('./employees/employees.controller'));
app.use('/requests', require('./request/requests.controller'));
app.use('/workflows', require('./workflows/workflows.controller'));

// Swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is running', status: 'healthy' });
});

// Global error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
