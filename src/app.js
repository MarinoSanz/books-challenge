const express = require('express');
const mainRouter = require('./routes/main');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const app = express();



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method - override para procesamiento de put y delete //
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
// npm i cookie-parser
// npm i express-session
// Sesiones y cookies
app.use(session({
  secret: 'BookSecret',
  resave: false,
  saveUninitialized: true,
}));
app.use(cookieParser());

const userLoggedMiddleware = require('./middwares/userLoggedMiddleware');
app.use(userLoggedMiddleware);


app.set('view engine', 'ejs');
app.set('views', 'src/views');



app.use('/', mainRouter);



app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
