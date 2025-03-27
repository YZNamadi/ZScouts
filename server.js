const express = require('express');
const sequelize = require('./database/sequelize');
const cors= require('cors')
// const userRouter = require('./routes/userRouter');

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

// app.use('/api/v1/user', userRouter);

app.use('/', (req, res) => {
    res.send('ZScouts API is running!');
})

app.use((error, req, res, next) => {
    if(error){
       return res.status(400).json({message:  error.message})
    }
    next()
})

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
    console.log(`Server is listening to PORT: ${PORT}`)
});