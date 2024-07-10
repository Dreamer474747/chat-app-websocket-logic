import express from "express";
import { Server } from "socket.io";


const PORT = 4000;


const app = express();


const expressServer = app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
})


const io = new Server(expressServer, {
	cors: {
		origin: [
			"http://localhost:3000",
			"http://127.0.0.1:3000",
			"https://dreamer-chatapp.liara.run",
			"http://0.0.0.0",
		]
	}
})




io.on("connection", socket => {
	
	socket.on("joinUserInThisChatRooms", (rooms) => {
		
		socket.join(rooms);
	})
	
	socket.on("message", (message, roomId) => {
		
		io.to(roomId).emit("message", message, roomId);
	})
	
	// a new chat can be a private chat or a group chat.
	socket.on("createNewChatRoom", (chatRoom) => {
		
		socket.join(chatRoom._id);
		socket.emit("newChatRoom", chatRoom);
	})
	
	
	socket.on("joinChatRoom", (roomId) => {
		
		socket.join(roomId);
	})
	
	socket.on("leaveChatRoom", (roomId) => {
		
		socket.leave(roomId);
	})
	
	socket.on("messageIsSeen", (messageId, roomId) => {
		
		io.to(roomId).emit("newSeenMessage", messageId);
	})
	
})

