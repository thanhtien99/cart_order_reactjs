const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const router = require("./router");
const hostname = '127.0.0.1';
const port = 3001;

//Connect to DB
db.connect()

app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // URL frontend
    credentials: true, // Cho phép gửi cookie
}));

router(app)

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});