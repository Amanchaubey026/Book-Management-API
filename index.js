/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const { connectionToDb } = require('./src/config/dbConfig');
const { userRouter } = require('./src/routes/user.routes');
const bookRouter = require('./src/routes/book.routes');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const PORT = process.env.port || 8080;
const swaggerUi = require('swagger-ui-express');



const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Book Management',
        version: '1.0.0',
      },
      servers:[
          {
              url:`http://localhost:${PORT}/`
          }
      ]
    },
    apis: ['./src/routes/*.js'], 
};
  
  const openapiSpecification = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json())
app.use('/user',userRouter);
app.use('/book',bookRouter);

app.get('/',(req,res)=>{
  res.send(`Server is up`);
})

app.listen(PORT,async()=>{
    try {
        await connectionToDb();
        console.log(`App is running on the port http://localhost:${PORT}`);
    } catch (error) {
        console.log(error.message);
    }
})