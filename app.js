const sequelize = require('./integration/sequelize');
const Contacts = require('./models/contacts');
const ContactRoutes = require('./routes/contacts')
const morgan = require('morgan');

const express = require('express')
const app = express()
const cors = require("cors")

const port = process.env.PORT || 80
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev'));


// Synchronize the model with the database
async function syncDatabase() {
  try {
      await sequelize.sync({ force: false }); // Set { force: true } to recreate the table on every application start
      console.log('Database synchronized');
  } catch (error) {
      console.error('Error synchronizing database:', error);
  }
}


// Routes
app.use('/identify', ContactRoutes)


//Ping
app.get('/ping', (req, res) => {
  res.send('pong')
})

// Staring Server
syncDatabase();
app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})