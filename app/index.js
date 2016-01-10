import socketio from "socket.io";
import roomsManager from "./roomsManager";

export function run() {
	var io = socketio(5000);

	io.sockets.on("connection", function(socket) {
		socket.on("authentication", function(userArgs) {
			var user = roomsManager.registerUser(userArgs);
			var room = roomsManager.getRoomOfUser(user);
			socket.emit("authenticated");
			socket.join(room.id);
			socket.emit("setRoom", room);
			io.sockets.in(room.id).emit("newUser", userArgs);
			socket.on("userRealtime", function(obj) {
				console.log(obj);
			});
		});
	});

	setTimeout(function() {
		console.log(roomsManager.rooms.data);
		console.log(roomsManager.users.data);
		console.log(roomsManager.userRoomRel.data);
	}, 1000);
}
