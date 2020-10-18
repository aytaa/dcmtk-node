const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const server = require("http").Server(app);
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const cors = require('cors');

app.set('view engine', 'ejs');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/errors');
const accountRoutes = require('./routes/account');

const User = require('./models/user');
const ConnectionString = 'mongodb+srv://ayta:Odak1098@cluster0-zrcks.mongodb.net/wado?retryWrites=true&w=majority';

var store = new mongoDbStore({
    uri: ConnectionString,
    collection: 'mySessions'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) });
});

app.use(csurf());
app.use(cors());
app.use('/', adminRoutes);
app.use('/' , accountRoutes);
app.use(errorController.get404Page);


mongoose
  .connect(ConnectionString , { useNewUrlParser: true , useUnifiedTopology: true })
  .then(() => {
    console.log("connected mongodb");
  })
  .catch((err) => {
    console.log(err);
});

server.listen(process.env.PORT || 3000);   