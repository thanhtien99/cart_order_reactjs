const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const router = require("./router");

const hostname = '127.0.0.1';
const port = 3001;

// Socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    socket.on("add-to-cart", (data) => {
        // Phát lại dữ liệu đến tất cả client (trừ sender)
        socket.broadcast.emit("update-cart-qty", data);
        socket.broadcast.emit("update-cart", data);
    });

    socket.on("remove-to-cart", (data) => {
        socket.broadcast.emit("update-cart-qty", data);
    });

});

// Kết nối DB
db.connect();

app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

router(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});