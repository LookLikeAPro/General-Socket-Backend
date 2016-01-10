import socketio from "socket.io";
import roomsManager from "./roomsManager";

class User {
	constructor({name, password}) {
		this.name = name;
		this._password = password;
	}
}

export function run() {
	var io = socketio(5000);

	io.on("connection", function(socket) {
		socket.on("authentication", function(userArgs) {
			roomsManager.registerUser(new User(userArgs));
			socket.emit("authenticated");
		});
	});

	setTimeout(function() {
		io.sockets.emit("authenticated", "everyone");
	}, 1000);
}
