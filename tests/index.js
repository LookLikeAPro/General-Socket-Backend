import io from "socket.io-client";
import {run as runApp} from "../app";

var socketURL = "http://0.0.0.0:5000";

function mockClient(name) {
	var client = io.connect(socketURL);
	var room = "";
	client.on("connect", function() {
		client.emit("authentication", {name: name, password: "secret"});
		client.on("authenticated", function() {
			console.log("I am now authenticated");
		});
		client.on("newUser", function(user) {
			console.log(`Room ${room.id} has new joiner ${user.name}`);
		});
		client.on("setRoom", function(newRoom) {
			room = newRoom;
			setInterval(function() {
				client.emit("userRealtime", {
					position: {
						
					},
					vector: {
						
					}
				});
			}, 1000);
		});
	});
	return client;
}

export function run() {
	runApp();
	mockClient(1);
	mockClient(2);
}
