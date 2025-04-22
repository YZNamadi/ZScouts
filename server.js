require('dotenv').config();
const express = require('express');
const sequelize = require('./database/sequelize');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');

const playerRoutes = require('./routes/playerRoutes');
const scoutRoutes = require('./routes/scoutRoutes');
const transactionRoutes = require("./routes/transactionRoutes");
const scoutKycRoutes = require("./routes/scoutKycRouter");
const playerKycRoutes = require("./routes/playerKycRoutes");
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(morgan('dev'));

// ✅ Secure CORS setup with fallback for Postman/local dev
const allowedOrigins = [
  "https://zscouts.onrender.com",       // Swagger (hosted)
  "https://z-scoutsf.vercel.app",       // Frontend (hosted)
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/scouts', scoutRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/v1', playerKycRoutes);
app.use('/api/v1', scoutKycRoutes);
app.use('/api', ratingRoutes);
app.use('/api/admin', adminRoutes);

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZScouts API Documentation",
      version: "1.0.0",
      description: "API documentation for ZScouts, the football talent marketplace.",
    },
    servers: [
      {
        url: 'https://zscouts.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:1990',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Provide the token in the format: Bearer {your_token}',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.send('ZScouts API is running!');
});

// Error middleware
app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

// Sync DB and start server
const server = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database!');
    await sequelize.sync();
    console.log("Database synchronized!");
  } catch (error) {
    console.error('Unable to connect or sync to the database:', error.message);
  }
};

server();

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
