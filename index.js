"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const PORT = 5000;
const app = (0, express_1.default)();
const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
const urls = ["http://localhost:3000", "http://127.0.0.1:3000"];
const io = new socket_io_1.Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : urls
    }
});
io.on("connection", socket => {
    // fix Search problem
    const userIdAbbreviated = (socket.id).slice(0, 7);
    console.log(`user ${userIdAbbreviated} connected.`);
    socket.on("joinUserInThisRooms", (rooms) => {
        socket.join(rooms);
    });
    socket.on("message", (message, roomId) => {
        io.to(roomId).emit("message", message, roomId);
    });
    // a new chat can be a private chat or a group chat.
    socket.on("createNewChat", (inbox) => {
        console.log("createNewChat", "joined again");
        socket.join(inbox._id);
        socket.emit("newInbox", inbox);
    });
    socket.on("joinChat", (roomId) => {
        console.log(57, roomId);
        socket.join(roomId);
    });
    socket.on("leaveChat", (roomId) => {
        console.log(62, roomId);
        socket.leave(roomId);
    });
    socket.on("disconnect", () => {
        console.log(`user ${userIdAbbreviated} disconnected`);
    });
});
