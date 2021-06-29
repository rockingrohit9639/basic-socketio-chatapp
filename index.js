const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = 8000;

const users = {};

const io = new Server(server);

io.on("connection", socket => {

    socket.on("send-chat-message", message => {
        socket.broadcast.emit("chat-message", { message, name: users[socket.id]});
    })

    socket.on("new-user", name => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connect", name);
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnect", users[socket.id]);
        delete users[socket.id];
    })
})


app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/index.html")
})


server.listen(PORT, () =>
{
    console.log(`App running on http://localhost:${PORT}/`)
})