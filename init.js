import dotenv from 'dotenv';
import socketIO from "socket.io";
import "./db";
import app from './app';
import "./models/Comment";
import "./models/User";
import "./models/Video";
import "./models/Photo";


dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListing = () =>
    console.log(`😈Listening on: http://localhost:${PORT}`);

const server = app.listen(PORT, handleListing);

const io = socketIO(server);

io.on("connection", socket => {
    console.log("😘Socket Connect")
    socket.on("newMessage", ({ message }) => {
        socket.broadcast.emit("messageNotif", {
            message,
            nickname: socket.nickname || "Inguk"
        });
    });
    socket.on("setNickname", ({ nickname }) => {
        socket.nickname = nickname;
    });
});