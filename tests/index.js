import io from "socket.io-client";
var socketURL = "http://0.0.0.0:"+require(__dirname + "/../config/config.json").port;

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
					velocity: {
						
					}
				});
			}, 1000);

			client.on("positions", function(positions) {
				console.log(positions);
			});
		});
	});
	return client;
}

export function run() {
	mockClient(1);
	mockClient(2);
}
