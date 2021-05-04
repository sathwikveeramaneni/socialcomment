const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const userRoutes = require('./router/user');

const app = express();
app.use(express.json());
const store = new MongoDBStore({
  uri: "mongodb+srv://sathwik:Rohith@cluster0.56asa.mongodb.net/socialcomment",
  collection: 'sessions'
});
app.use(bodyParser.urlencoded({extended: true}));
dotenv.config();

app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  }));

app.use("/user",userRoutes);




mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });