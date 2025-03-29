require('dotenv').config();
const express = require('express');
const sequelize = require('./database/sequelize'); 
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import your onboarding routes for players and scouts
// const playerRoutes = require('./routes/playerRoutes');
// const scoutRoutes = require('./routes/scoutRoutes');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

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
        url: 'https://your-production-domain.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:1990',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your API docs in route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use onboarding routes for players and scouts
// app.use('/api/players', playerRoutes);
// app.use('/api/scouts', scoutRoutes);

// Root route
app.use('/', (req, res) => {
  res.send('ZScouts API is running!');
});

// Connect to the database using Sequelize
const server = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database!');
  } catch (error) { 
    console.error('Unable to connect to the database:', error.message);
  }
};

server();

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
