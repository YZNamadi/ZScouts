require('dotenv').config();
const express = require('express');
const sequelize = require('./database/sequelize'); 
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const playerRoutes = require('./routes/playerRoutes');
const scoutRoutes = require('./routes/scoutRoutes');
const transactionRoutes = require("./routes/transactionRoutes");

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
        url: ' ',
        description: 'Production server',
      },
      {
        url: 'http://localhost:1990',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/players', playerRoutes);
app.use('/api/scouts', scoutRoutes);
app.use("/api/transactions", transactionRoutes);

// Root route
app.use('/', (req, res) => {
  res.send('ZScouts API is running!');
});

// Connect to the database and synchronize tables
const server = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database!');
    // This will create or update tables based on your models
    await sequelize.sync({ alter: true });
    console.log("Database synchronized!");
  } catch (error) { 
    console.error('Unable to connect or sync to the database:', error.message);
  }
};

server();

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
